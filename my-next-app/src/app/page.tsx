"use client";

import { useRef, useState } from "react";
// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
// Lucide icon (shadcn/ui uses these icons internally)
import { Loader2, UploadCloud } from "lucide-react";

export default function HomePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // We'll store a ref to the hidden file input so we can trigger it
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputClick = () => {
    // Programmatically open the file picker
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setOutputUrl(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;

    setStep(2); // move to "Analyzing..." step
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Something went wrong");
      }

      const { outputUrl } = await res.json();
      setOutputUrl(outputUrl);
      setStep(3); // final step
    } catch (err: any) {
      setError(err.message);
      setOutputUrl(null);
      setStep(1); // reset to step 1 so they can try again
    }
  };

  // --- Step Content ---
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Modern upload box */}
            <div
              onClick={handleFileInputClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
            >
              <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-800">
                Drag & drop or click to upload
              </p>
              <p className="mt-2 text-sm text-gray-400">
                MP4 or WEBM (max ~200MB)
              </p>
              {selectedFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Hidden file input */}
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <CardFooter className="p-0 mt-4">
              <Button
                // Use a custom className to ensure a visible color
                className="bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
                disabled={!selectedFile}
              >
                Analyze with YOLOv11
              </Button>
            </CardFooter>
          </form>
        );

      case 2:
        return (
          <div className="flex flex-col items-center space-y-4 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="text-sm text-gray-700">
              Our fine-tuned YOLOv11 CNN is analyzing the video for road damage...
            </p>
            <p className="text-xs text-gray-400">
              Please wait, this may take a moment.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-700">
              Analysis complete! Here’s your processed video:
            </p>
            {outputUrl && (
              <video
                src={outputUrl}
                controls
                className="border rounded w-full"
              />
            )}
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
      <Card className="w-full max-w-2xl shadow-xl transform scale-150">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold text-gray-800">
            AI Road Damage Analysis
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Upload your POV drive footage to analyze surface conditions using our fine-tuned neural network.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">{renderStepContent()}</CardContent>
      </Card>
    </main>
  );
}

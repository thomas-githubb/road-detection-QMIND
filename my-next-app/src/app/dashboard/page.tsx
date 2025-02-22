"use client";

import React, { useState, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import ClientMapWrapper from "@/components/ClientMapWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud } from "lucide-react";

// 1. We'll fetch the SAS token from the Next.js route /api/get-sas-token
const sasBackendUrl = "/api/get-sas-token";

// 2. Construct the base Blob Storage endpoint from environment variables
const blobEndpoint = `https://${
  // Make sure you set NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME in your .env file
  process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME || "YOUR-STORAGE-ACCOUNT"
}.blob.core.windows.net`;

/**
 * Fetches the account-level SAS token from /api/get-sas-token
 */
const fetchSASToken = async (): Promise<string> => {
  const response = await fetch(sasBackendUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch SAS token: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  if (!data?.sasToken) {
    throw new Error("SAS token not found in the response.");
  }
  return data.sasToken;
};

/**
 * Creates a BlobServiceClient using the fetched SAS token
 */
const getBlobServiceClient = async (): Promise<BlobServiceClient> => {
  const sasToken = await fetchSASToken();
  // If the token doesn’t start with “?”, add one
  const separator = sasToken.startsWith("?") ? "" : "?";
  return new BlobServiceClient(`${blobEndpoint}${separator}${sasToken}`);
};

export default function DashboardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const analysisFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAnalysisFileInputClick = () => {
    analysisFileInputRef.current?.click();
  };

  const handleAnalysisFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      setOutputUrl(null);
      setAnalysisError(null);
    }
  };

  const handleAnalysisSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return;
    setStep(2);
    setAnalysisError(null);

    try {
      // 1) Create a BlobServiceClient using the account-level SAS token.
      const blobServiceClient = await getBlobServiceClient();

      // 2) Ensure the "uploads" container exists and upload the raw video
      const uploadsContainerName =
        process.env.NEXT_PUBLIC_AZURE_STORAGE_UPLOADS_CONTAINER_NAME || "uploads";
      const uploadsContainerClient = blobServiceClient.getContainerClient(
        uploadsContainerName
      );
      await uploadsContainerClient.createIfNotExists({ access: "container" });

      const rawBlobClient = uploadsContainerClient.getBlockBlobClient(
        selectedFile.name
      );
      await rawBlobClient.uploadData(selectedFile, {
        blobHTTPHeaders: { blobContentType: selectedFile.type },
      });

      // 3) Call your Next.js route to do the Python YOLO processing
      //    (which saves the processed video to /public/processed locally)
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        let errorMessage = "Something went wrong during analysis";
        try {
          const json = JSON.parse(text);
          errorMessage = json.error || errorMessage;
        } catch {
          errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      // Suppose the response gives us a relative URL like /processed/XYZ-output.mp4
      const data = await res.json();
      if (!data.outputUrl) {
        throw new Error("No outputUrl returned from /api/process");
      }
      setOutputUrl(data.outputUrl);

      // 4) Download the processed result (the local /processed/XYZ-output.mp4)
      const processedResponse = await fetch(data.outputUrl);
      if (!processedResponse.ok) {
        throw new Error(
          `Failed to fetch processed video: ${processedResponse.status} ${processedResponse.statusText}`
        );
      }
      const processedBlob = await processedResponse.blob();

      // 5) Upload the processed file to "processed" container in Azure
      const processedContainerName =
        process.env.NEXT_PUBLIC_AZURE_STORAGE_PROCESSED_CONTAINER_NAME ||
        "processed";
      const processedContainerClient = blobServiceClient.getContainerClient(
        processedContainerName
      );
      await processedContainerClient.createIfNotExists({ access: "container" });

      const processedBlobClient = processedContainerClient.getBlockBlobClient(
        selectedFile.name
      );
      await processedBlobClient.uploadData(processedBlob, {
        blobHTTPHeaders: { blobContentType: processedBlob.type },
      });

      // Completed successfully
      setStep(3);
      setSelectedFile(null);
    } catch (err: any) {
      console.error("Analysis submission error:", err);
      setAnalysisError(err.message);
      setOutputUrl(null);
      setStep(1);
    }
  };

  /**
   * Render the step-specific UI
   */
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleAnalysisSubmit} className="space-y-4">
            <div
              onClick={handleAnalysisFileInputClick}
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
            <Input
              ref={analysisFileInputRef}
              type="file"
              accept="video/*"
              onChange={handleAnalysisFileChange}
              className="hidden"
            />
            {analysisError && (
              <p className="text-red-600 text-sm">{analysisError}</p>
            )}
            <CardFooter className="p-0 mt-4">
              <Button
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
            {analysisError && (
              <p className="text-red-600 text-sm">{analysisError}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-8 bg-gradient-to-b from-white to-gray-50 space-y-8 md:space-y-0 md:space-x-8">
      <div className="md:w-1/2 p-4">
        <h1 className="text-3xl font-bold mb-6">Maps</h1>
        <div className="border rounded-lg shadow-md overflow-hidden">
          <ClientMapWrapper />
        </div>
      </div>
      <div className="md:w-1/2 p-4">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">
              AI Road Damage Analysis
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Upload your drive footage to analyze road damage using our YOLOv11
              model.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
      </div>
    </div>
  );
}

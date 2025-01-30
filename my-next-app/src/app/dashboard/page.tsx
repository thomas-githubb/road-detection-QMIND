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

export default function DashboardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const backendUrl = "http://localhost:4000/api/get-sas-token";
  const blobEndpoint = "https://paveaiblob.blob.core.windows.net/";
  const containerName = "videos";

  const fetchSASToken = async (): Promise<string> => {
    const response = await fetch(backendUrl);
    if (!response.ok) throw new Error("Failed to fetch SAS token");
    const data = await response.json();
    return data.sasToken;
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file to upload.");
    setUploadStatus("Uploading...");
    try {
      const sasToken = await fetchSASToken();
      const blobServiceClient = new BlobServiceClient(
        `${blobEndpoint}?${sasToken}`
      );
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      });
      setUploadStatus("Upload successful!");
    } catch (error) {
      setUploadStatus("Upload failed. Check console for details.");
    }
  };

  return (
    <div className="flex min-h-screen p-6 bg-gray-50 gap-6">
      {/* Left: Map */}
      <div className="w-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Geospatial Mapping</h2>
        <ClientMapWrapper />
      </div>

      {/* Right: Upload & Analyze */}
      <div className="w-1/2">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              AI Road Damage Analysis
            </CardTitle>
            <CardDescription>
              Upload a video to analyze surface conditions.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="mt-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
            >
              <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-800">
                Drag & drop or click to upload
              </p>
              {selectedFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <CardFooter className="p-0 mt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!selectedFile}
              >
                Analyze with YOLOv11
              </Button>
            </CardFooter>
          </CardContent>
        </Card>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Upload & Download MP4</h2>
          <input
            type="file"
            className="border p-2 w-full mb-2"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
          <p className="mt-2">{uploadStatus}</p>
          <input
            type="text"
            placeholder="Enter filename to download"
            className="border p-2 w-full mt-4"
            value={downloadFileName}
            onChange={(e) => setDownloadFileName(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Download
          </button>
          {videoSrc && (
            <video controls className="mt-4 border rounded w-full">
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

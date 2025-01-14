"use client";

import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import ClientMapWrapper from "@/components/ClientMapWrapper"; // Your existing map wrapper

export default function MapsPage() {
  // State variables for upload/download functionality
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Azure Blob Storage Configurations
  const backendUrl = "http://localhost:4000/api/get-sas-token"; // Backend to get SAS token
  const blobEndpoint = "https://paveaiblob.blob.core.windows.net/"; // Your Azure Blob endpoint
  const containerName = "videos"; // Replace with your container name

  // Fetch SAS token from backend
  const fetchSASToken = async (): Promise<string> => {
    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch SAS token");
      }
      const data = await response.json();
      return data.sasToken;
    } catch (error) {
      console.error("Error fetching SAS token:", error);
      throw error;
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      setUploadStatus("Uploading...");
      const sasToken = await fetchSASToken();
      const blobServiceClient = new BlobServiceClient(`${blobEndpoint}?${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: { blobContentType: file.type },
      });

      setUploadStatus("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Check console for details.");
    }
  };

  // Handle file download
  const handleDownload = async () => {
    if (!downloadFileName) {
      alert("Please enter the file name to download.");
      return;
    }

    try {
      setDownloadStatus("Downloading...");
      const sasToken = await fetchSASToken();
      const blobServiceClient = new BlobServiceClient(`${blobEndpoint}?${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blobClient = containerClient.getBlobClient(downloadFileName);
      const response = await blobClient.download();
      const blob = await response.blobBody;

      if (blob) {
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
        setDownloadStatus("Download and playback successful!");
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus("Download failed. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      {/* Map Section */}
      <h1 className="text-3xl font-bold mb-6">Maps</h1>
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-2">Map</h2>
        <div className="border rounded-lg shadow-md overflow-hidden">
          {/* Existing Map Wrapper */}
          <ClientMapWrapper />
        </div>
      </div>

      {/* Upload Section */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upload MP4 File</h2>
        <div className="border rounded-lg shadow-md p-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border p-2 mb-2"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
          <p className="mt-2">{uploadStatus}</p>
        </div>
      </div>

      {/* Download Section */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-2">Download MP4 File</h2>
        <div className="border rounded-lg shadow-md p-4">
          <input
            type="text"
            placeholder="Enter file name to download"
            value={downloadFileName}
            onChange={(e) => setDownloadFileName(e.target.value)}
            className="w-full border p-2 mb-2"
          />
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download
          </button>
          <p className="mt-2">{downloadStatus}</p>
          {videoSrc && (
            <video controls width="640" height="360" className="mt-4">
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}

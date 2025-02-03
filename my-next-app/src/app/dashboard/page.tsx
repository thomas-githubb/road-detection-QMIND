"use client";

import React, { useState, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import ClientMapWrapper from "@/components/ClientMapWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud } from "lucide-react";

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
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await fetch("http://localhost:4000/api/process", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });
      if (!res.ok) {
        const text = await res.text();
        let errorMessage = "Something went wrong during analysis";
        try {
          const json = JSON.parse(text);
          errorMessage = json.error || errorMessage;
        } catch (e) {
          errorMessage = text;
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      setOutputUrl(data.outputUrl);
      setStep(3);
      setSelectedFile(null);
    } catch (err: any) {
      setAnalysisError(err.message);
      setOutputUrl(null);
      setStep(1);
    }
  };
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleAnalysisSubmit} className="space-y-4">
            <div onClick={handleAnalysisFileInputClick} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition">
              <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-800">Drag & drop or click to upload</p>
              <p className="mt-2 text-sm text-gray-400">MP4 or WEBM (max ~200MB)</p>
              {selectedFile && <p className="text-xs text-gray-500 mt-1">Selected: {selectedFile.name}</p>}
            </div>
            <Input ref={analysisFileInputRef} type="file" accept="video/*" onChange={handleAnalysisFileChange} className="hidden" />
            {analysisError && <p className="text-red-600 text-sm">{analysisError}</p>}
            <CardFooter className="p-0 mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={!selectedFile}>
                Analyze with YOLOv11
              </Button>
            </CardFooter>
          </form>
        );
      case 2:
        return (
          <div className="flex flex-col items-center space-y-4 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            <p className="text-sm text-gray-700">Our fine-tuned YOLOv11 CNN is analyzing the video for road damage...</p>
            <p className="text-xs text-gray-400">Please wait, this may take a moment.</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-700">Analysis complete! Here’s your processed video:</p>
            {outputUrl && <video src={outputUrl} controls className="border rounded w-full" />}
            {analysisError && <p className="text-red-600 text-sm">{analysisError}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const sasBackendUrl = "http://localhost:4000/api/get-sas-token";
  const blobEndpoint = "https://paveaiblob.blob.core.windows.net/";
  const containerName = "videos";
  const fetchSASToken = async (): Promise<string> => {
    try {
      const response = await fetch(sasBackendUrl);
      if (!response.ok) throw new Error("Failed to fetch SAS token");
      const data = await response.json();
      return data.sasToken;
    } catch (error) {
      console.error("Error fetching SAS token:", error);
      throw error;
    }
  };
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setVideoSrc(null);
    try {
      setUploadStatus("Uploading...");
      const sasToken = await fetchSASToken();
      const separator = sasToken.startsWith("?") ? "" : "?";
      const blobServiceClient = new BlobServiceClient(`${blobEndpoint}${separator}${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadData(file, { blobHTTPHeaders: { blobContentType: file.type } });
      setUploadStatus("Upload successful!");
      const newUrl = `${blobEndpoint}${containerName}/${file.name}${separator}${sasToken}`;
      setVideoSrc(newUrl);
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Check console for details.");
    }
  };
  const handleDownload = async () => {
    if (!downloadFileName) {
      alert("Please enter the file name to download.");
      return;
    }
    setVideoSrc(null);
    try {
      setDownloadStatus("Downloading...");
      const sasToken = await fetchSASToken();
      const separator = sasToken.startsWith("?") ? "" : "?";
      const blobServiceClient = new BlobServiceClient(`${blobEndpoint}${separator}${sasToken}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlobClient(downloadFileName);
      const response = await blobClient.download(0);
      const blob = await response.blobBody;
      if (blob) {
        const url = URL.createObjectURL(blob);
        setVideoSrc(url);
        const link = document.createElement("a");
        link.href = url;
        link.download = downloadFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadStatus("Download and playback successful!");
        setDownloadFileName("");
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus("Download failed. Check console for details.");
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
      <div className="md:w-1/2 p-4 space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">AI Road Damage Analysis</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Upload your drive footage to analyze road damage using our YOLOv11 model.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent>{renderStepContent()}</CardContent>
        </Card>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Upload & Download MP4</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload MP4 File</h2>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border p-2 mb-2" />
              <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
              <p className="mt-2">{uploadStatus}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Download MP4 File</h2>
              <input type="text" placeholder="Enter file name to download" value={downloadFileName} onChange={(e) => setDownloadFileName(e.target.value)} className="w-full border p-2 mb-2" />
              <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">Download</button>
              <p className="mt-2">{downloadStatus}</p>
              {videoSrc && (
                <video controls width="640" height="360" className="mt-4">
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// src/App.js
import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import './App.css';

function App() {
  // State variables
  const [blobServiceClient, setBlobServiceClient] = useState(null);
  const [uploadsContainerClient, setUploadsContainerClient] = useState(null);
  const [processedContainerClient, setProcessedContainerClient] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [downloadStatus, setDownloadStatus] = useState('');
  const [videoSrc, setVideoSrc] = useState('');

  // Azure Blob Storage Endpoint
  const blobEndpoint = `https://${
    process.env.REACT_APP_AZURE_STORAGE_ACCOUNT_NAME ||
    process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME ||
    'paveaiblob'
  }.blob.core.windows.net`;

  // Container names
  const uploadsContainerName =
    process.env.REACT_APP_AZURE_STORAGE_UPLOADS_CONTAINER_NAME ||
    process.env.NEXT_PUBLIC_AZURE_STORAGE_UPLOADS_CONTAINER_NAME ||
    'uploads';
  const processedContainerName =
    process.env.REACT_APP_AZURE_STORAGE_PROCESSED_CONTAINER_NAME ||
    process.env.NEXT_PUBLIC_AZURE_STORAGE_PROCESSED_CONTAINER_NAME ||
    'processed';

  // Backend URL to get the SAS token
  // Make sure this points to the Express server running on port 4000
  const backendUrl = 'http://localhost:4000/api/get-sas-token';

  // Initialize BlobServiceClient with SAS token
  useEffect(() => {
    const initializeBlobService = async () => {
      try {
        // Fetch SAS token from backend
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch SAS token.');
        }
        const data = await response.json();
        const sasToken = data.sasToken;

        // Initialize BlobServiceClient with SAS token
        const blobService = new BlobServiceClient(`${blobEndpoint}?${sasToken}`);
        setBlobServiceClient(blobService);

        // Container clients
        const uploadsContainer = blobService.getContainerClient(uploadsContainerName);
        setUploadsContainerClient(uploadsContainer);

        const processedContainer = blobService.getContainerClient(processedContainerName);
        setProcessedContainerClient(processedContainer);

        console.log('BlobServiceClient initialized.');
      } catch (error) {
        console.error('Error initializing BlobServiceClient:', error);
        alert('Failed to initialize blob service. Check console for details.');
      }
    };

    initializeBlobService();
  }, [backendUrl, blobEndpoint, uploadsContainerName, processedContainerName]);

  // Handle file selection for upload
  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  // Upload file to "uploads" container
  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Please select an MP4 file to upload.');
      return;
    }
    if (!uploadsContainerClient) {
      alert('Uploads container is not ready yet.');
      return;
    }

    try {
      setUploadStatus('Uploading...');
      const blobName = encodeURIComponent(uploadFile.name);
      const blockBlobClient = uploadsContainerClient.getBlockBlobClient(blobName);

      // Set upload options with content type
      const uploadOptions = {
        blobHTTPHeaders: { blobContentType: 'video/mp4' },
      };

      await blockBlobClient.uploadData(uploadFile, uploadOptions);
      setUploadStatus('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Check console for details.');
    }
  };

  // Download file from "processed" container
  const handleDownload = async () => {
    if (!downloadFileName) {
      alert('Please enter the file name to download.');
      return;
    }
    if (!processedContainerClient) {
      alert('Processed container is not ready yet.');
      return;
    }

    try {
      setDownloadStatus('Downloading...');
      const blobName = encodeURIComponent(downloadFileName);
      const blobClient = processedContainerClient.getBlobClient(blobName);

      const downloadResponse = await blobClient.download();
      const blob = await downloadResponse.blobBody;
      const url = URL.createObjectURL(blob);
      setVideoSrc(url);
      setDownloadStatus('Download and playback successful!');
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus('Download failed. Check console for details.');
    }
  };

  return (
    <div className="App">
      <h1>Azure Blob Storage Upload and Download</h1>

      {/* Upload Section */}
      <div className="section">
        <h2>Upload MP4 File (to "uploads" container)</h2>
        <input type="file" accept=".mp4" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>{uploadStatus}</p>
      </div>

      {/* Download Section */}
      <div className="section">
        <h2>Download MP4 File (from "processed" container)</h2>
        <input
          type="text"
          placeholder="Enter file name to download (e.g., video.mp4)"
          value={downloadFileName}
          onChange={(e) => setDownloadFileName(e.target.value)}
        />
        <button onClick={handleDownload}>Download</button>
        <p>{downloadStatus}</p>
        {videoSrc && (
          <video controls width="640" height="360">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}

export default App;

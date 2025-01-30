// src/App.js
import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import './App.css';

function App() {
  // State variables
  const [blobServiceClient, setBlobServiceClient] = useState(null);
  const [containerClient, setContainerClient] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [downloadStatus, setDownloadStatus] = useState('');
  const [videoSrc, setVideoSrc] = useState('');

  // Backend server URL
  const backendUrl = 'http://localhost:4000/api/get-sas-token';

  // Azure Blob Storage Endpoint and Container Name
  const blobEndpoint = 'https://paveaiblob.blob.core.windows.net/';
  const containerName = 'videos'; // Replace with your container name

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

        // Get ContainerClient
        const container = blobService.getContainerClient(containerName);
        setContainerClient(container);

        console.log('BlobServiceClient initialized.');
      } catch (error) {
        console.error('Error initializing BlobServiceClient:', error);
        alert('Failed to initialize blob service. Check console for details.');
      }
    };

    initializeBlobService();
  }, [backendUrl, blobEndpoint, containerName]);

  // Handle File Selection for Upload
  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

  // Handle Upload Button Click
  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Please select an MP4 file to upload.');
      return;
    }

    try {
      setUploadStatus('Uploading...');
      const blobName = encodeURIComponent(uploadFile.name);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Set upload options with appropriate content type
      const uploadOptions = {
        blobHTTPHeaders: { blobContentType: 'video/mp4' },
      };

      // Upload the file
      const uploadResponse = await blockBlobClient.uploadData(uploadFile, uploadOptions);
      console.log('Upload successful:', uploadResponse.requestId);
      setUploadStatus('Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload failed. Check console for details.');
    }
  };

  // Handle Download Button Click
  const handleDownload = async () => {
    if (!downloadFileName) {
      alert('Please enter the file name to download.');
      return;
    }

    try {
      setDownloadStatus('Downloading...');
      const blobName = encodeURIComponent(downloadFileName);
      const blobClient = containerClient.getBlobClient(blobName);

      // Download the blob
      const downloadResponse = await blobClient.download();
      const blob = await downloadResponse.blobBody;

      // Create a URL for the downloaded blob
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
        <h2>Upload MP4 File</h2>
        <input type="file" accept=".mp4" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <p>{uploadStatus}</p>
      </div>

      {/* Download Section */}
      <div className="section">
        <h2>Download MP4 File</h2>
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
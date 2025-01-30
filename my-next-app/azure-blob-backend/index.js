// azure-blob-backend/index.js
const express = require('express');
const cors = require('cors');
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Enable CORS for all origins (for development)
// In production, restrict this to your frontend's domain
app.use(cors());

// Initialize Blob Service Client
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

// Endpoint to generate SAS token
app.get('/api/get-sas-token', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure the container exists
    const exists = await containerClient.exists();
    if (!exists) {
      return res.status(404).json({ error: 'Container does not exist.' });
    }

    // Define SAS token permissions and expiry
    const sasOptions = {
      containerName,
      permissions: BlobSASPermissions.parse("racwd"), // Read, Add, Create, Write, Delete
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour from now
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

    res.json({ sasToken });
  } catch (error) {
    console.error('Error generating SAS token:', error);
    res.status(500).json({ error: 'Failed to generate SAS token.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
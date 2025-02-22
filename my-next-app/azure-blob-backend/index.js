// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  SASProtocol,
} = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 4000;

// Enable basic CORS so that your frontends (React, Next.js, etc.) can call this API
app.use(cors());

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!account || !accountKey) {
  console.error('Missing Azure Storage account configuration in .env');
  process.exit(1);
}

// Create a shared key credential used to sign the SAS token
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

// GET /api/get-sas-token
// Returns a short-lived SAS token (1 hour by default)
app.get('/api/get-sas-token', async (req, res) => {
  try {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setHours(now.getHours() + 1); // Token valid for 1 hour

    // Permissions: read, write, delete, list, add, create, update, process
    const permissions = AccountSASPermissions.parse('rwdlacup');
    const services = 'b'; // Blob service
    const resourceTypes = 'sco'; // service, container, object

    const sasToken = generateAccountSASQueryParameters(
      {
        expiresOn: expiry,
        permissions,
        services,
        resourceTypes,
        protocol: SASProtocol.HttpsAndHttp,
        startsOn: now,
      },
      sharedKeyCredential
    ).toString();

    res.json({ sasToken });
  } catch (error) {
    console.error('Error generating SAS token:', error);
    res.status(500).json({ error: 'Failed to generate SAS token.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

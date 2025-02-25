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

app.use(cors());

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!account || !accountKey) {
  console.error('Missing Azure Storage account configuration in .env');
  process.exit(1);
}

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

app.get('/api/get-sas-token', async (req, res) => {
  try {
    const now = new Date();
    // Set start time 15 minutes ago to avoid clock skew issues
    const startsOn = new Date(now.getTime() - 15 * 60 * 1000);
    const expiresOn = new Date(now.getTime() + 60 * 60 * 1000); // Valid for 1 hour

    // Permissions: read, write, delete, list, add, create, update, process
    const permissions = AccountSASPermissions.parse('rwdlacup');
    const services = 'b'; // Blob service
    const resourceTypes = 'sco'; // Service, container, object

    const sasToken = generateAccountSASQueryParameters(
      {
        startsOn,
        expiresOn,
        permissions,
        services,
        resourceTypes,
        protocol: SASProtocol.HttpsAndHttp,
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

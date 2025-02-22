// src/app/api/get-sas-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  StorageSharedKeyCredential,
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";

// Make sure you have these in your .env:
// AZURE_STORAGE_ACCOUNT_NAME=paveaiblob
// AZURE_STORAGE_ACCOUNT_KEY=your_secret_key

export async function GET(req: NextRequest) {
  try {
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    if (!account || !accountKey) {
      return NextResponse.json({ error: "Azure storage config missing" }, { status: 500 });
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const now = new Date();
    const expires = new Date(now);
    // Let token be valid for 1 hour
    expires.setHours(expires.getHours() + 1);

    const sasToken = generateAccountSASQueryParameters(
      {
        expiresOn: expires,
        // read, write, delete, list, add, create, update, process
        permissions: AccountSASPermissions.parse("rwdlacup"),
        services: "b",        // Blob
        resourceTypes: "sco", // Service, container, object
        protocol: SASProtocol.HttpsAndHttp,
        startsOn: now,
      },
      sharedKeyCredential
    ).toString();

    return NextResponse.json({ sasToken });
  } catch (err: any) {
    console.error("Error generating SAS token:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

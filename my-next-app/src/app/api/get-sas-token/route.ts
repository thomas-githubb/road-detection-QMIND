import { NextRequest, NextResponse } from "next/server";
import {
  StorageSharedKeyCredential,
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";

export async function GET(req: NextRequest) {
  try {
    const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    if (!account || !accountKey) {
      return NextResponse.json({ error: "Azure storage config missing" }, { status: 500 });
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const now = new Date();
    // Set the token to start 15 minutes in the past to handle clock skew
    const startsOn = new Date(now.getTime() - 15 * 60 * 1000);
    const expiresOn = new Date(now.getTime() + 60 * 60 * 1000);

    const sasToken = generateAccountSASQueryParameters(
      {
        startsOn,
        expiresOn,
        permissions: AccountSASPermissions.parse("rwdlacup"),
        services: "b",
        resourceTypes: "sco",
        protocol: SASProtocol.HttpsAndHttp,
      },
      sharedKeyCredential
    ).toString();

    return NextResponse.json({ sasToken });
  } catch (err: any) {
    console.error("Error generating SAS token:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

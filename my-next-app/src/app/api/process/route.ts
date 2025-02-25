import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { nanoid } from "nanoid";

export const POST = async (req: NextRequest) => {
  try {
    // 1. Retrieve the file from the request
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Save the uploaded file to disk
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const uniqueId = nanoid();
    const inputFilePath = join(uploadsDir, `${uniqueId}-${file.name}`);
    await fs.writeFile(inputFilePath, Buffer.from(await file.arrayBuffer()));

    // 3. Run the Python script to process the video
    const processedDir = join(process.cwd(), "public", "processed");
    await fs.mkdir(processedDir, { recursive: true });
    const outputFileName = `${uniqueId}-output.mp4`;
    const outputFilePath = join(processedDir, outputFileName);
    const pythonScriptPath = join(process.cwd(), "process_video.py");

    await new Promise<void>((resolve, reject) => {
      const py = spawn("python", [pythonScriptPath, inputFilePath, outputFilePath]);
      py.stdout.on("data", (data) => console.log(`PYTHON STDOUT: ${data}`));
      py.stderr.on("data", (data) => console.error(`PYTHON STDERR: ${data}`));
      py.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Python script exited with code ${code}`));
      });
    });

    // 4. Return the public URL for the processed video
    const outputUrl = `/processed/${outputFileName}`;
    return NextResponse.json({ outputUrl });
  } catch (error) {
    console.error("Error in /api/process:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};

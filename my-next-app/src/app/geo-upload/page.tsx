import React from "react";

// Either import the wrapper...
import ClientMapWrapper from "@/components/ClientMapWrapper";

// ... OR import the map directly
// import SimpleMapbox from "@/components/mapboxmap";

export default function MapsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold mb-6">Maps</h1>
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-2">Map</h2>
        <div className="border rounded-lg shadow-md overflow-hidden">
          {/* Use whichever you prefer */}
          <ClientMapWrapper />
          {/* <SimpleMapbox /> */}
        </div>
      </div>
    </div>
  );
}

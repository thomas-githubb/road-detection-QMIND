"use client"; // This directive ensures that this component is a client component

import dynamic from "next/dynamic";

// Dynamically import MapboxMap with SSR disabled
const MapboxMap = dynamic(() => import("./MapboxMap"), { ssr: false });

const ClientMapWrapper = () => {
  return <MapboxMap />;
};

export default ClientMapWrapper;

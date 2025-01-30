"use client";

import React, { useRef, useState } from "react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SimpleGoogleMap() {
  // Reference to the Google Map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  // Markers for Start (green) and End (red) points
  const [startMarker, setStartMarker] = useState<google.maps.Marker | null>(
    null
  );
  const [endMarker, setEndMarker] = useState<google.maps.Marker | null>(null);

  // References for Directions Service and Renderer
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  // Input references for Autocomplete
  const startInputRef = useRef<HTMLInputElement | null>(null);
  const endInputRef = useRef<HTMLInputElement | null>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Initialize the Google Map once the script loads.
   */
  function initMap() {
    if (!(window as any).google) return; // Ensure Google Maps script is loaded
    if (mapRef.current) return; // Prevent re-initialization

    const mapElement = document.getElementById("map");
    if (!mapElement) {
      console.error("Map container not found");
      return;
    }

    // Initialize the map
    const map = new google.maps.Map(mapElement as HTMLElement, {
      center: { lat: 39.8283, lng: -98.5795 }, // Center of the US
      zoom: 4,
    });
    mapRef.current = map;

    // Initialize Directions Service and Renderer
    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({ map });
    directionsRendererRef.current.setOptions({ suppressMarkers: true }); // Suppress default markers

    // Setup Autocomplete for Start Address
    if (startInputRef.current) {
      const startAutocomplete = new google.maps.places.Autocomplete(
        startInputRef.current,
        {
          types: ["geocode"], // Restrict to geographical locations
        }
      );

      startAutocomplete.addListener("place_changed", () => {
        const place = startAutocomplete.getPlace();
        if (place && place.geometry) {
          handlePlaceResult(place, "start");
        }
      });
    }

    // Setup Autocomplete for End Address
    if (endInputRef.current) {
      const endAutocomplete = new google.maps.places.Autocomplete(
        endInputRef.current,
        {
          types: ["geocode"],
        }
      );

      endAutocomplete.addListener("place_changed", () => {
        const place = endAutocomplete.getPlace();
        if (place && place.geometry) {
          handlePlaceResult(place, "end");
        }
      });
    }
  }

  /**
   * Handle the selected place from Autocomplete and place/move the marker.
   * @param place The place result from Autocomplete.
   * @param type "start" or "end" to determine which marker to place.
   */
  function handlePlaceResult(
    place: google.maps.places.PlaceResult,
    type: "start" | "end"
  ) {
    if (!mapRef.current) return; // Guard against null
    const loc = place.geometry?.location;
    if (!loc) {
      setError("Selected place has no location.");
      return;
    }

    if (type === "start") {
      if (!startMarker) {
        const marker = new google.maps.Marker({
          position: loc,
          map: mapRef.current,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        });
        setStartMarker(marker);
      } else {
        startMarker.setPosition(loc);
      }
      mapRef.current.panTo(loc);
    } else {
      if (!endMarker) {
        const marker = new google.maps.Marker({
          position: loc,
          map: mapRef.current,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });
        setEndMarker(marker);
      } else {
        endMarker.setPosition(loc);
      }
      mapRef.current.panTo(loc);
    }
  }

  /**
   * Handle the GeoJSON file upload, parse, and display on the map.
   * @param e The file input change event.
   */
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!mapRef.current) {
      setError("Map is not initialized yet.");
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const geojson = JSON.parse(reader.result as string);

        // Validate top-level GeoJSON structure
        if (geojson.type !== "FeatureCollection") {
          throw new Error("Invalid GeoJSON. Must be FeatureCollection.");
        }

        // Clear existing data on the map
        mapRef.current.data.forEach((feature) =>
          mapRef.current.data.remove(feature)
        );

        // Add new GeoJSON data to the map
        mapRef.current.data.addGeoJson(geojson);

        // Initialize bounds to fit the new GeoJSON
        const bounds = new google.maps.LatLngBounds();

        mapRef.current.data.forEach((feature) => {
          const geometry = feature.getGeometry();
          if (!geometry) {
            console.warn("Skipping feature with null geometry.");
            return;
          }
          processGeometry(geometry, bounds);
        });

        // Only fit bounds if they are valid (i.e., not empty)
        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds);
        }

        setError(""); // Clear any previous errors
      } catch (err: any) {
        console.error("GeoJSON Upload Error:", err);
        setError(
          "Invalid GeoJSON file. Please ensure it is a valid FeatureCollection."
        );
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      console.error("File reading error");
      setError("Error reading the file.");
      setLoading(false);
    };

    reader.readAsText(file);
  }

  /**
   * Process the geometry to extend the map bounds accordingly.
   * @param geometry The geometry object from GeoJSON.
   * @param bounds The LatLngBounds object to extend.
   */
  function processGeometry(
    geometry: google.maps.Data.Geometry,
    bounds: google.maps.LatLngBounds
  ) {
    const type = geometry.getType();

    switch (type) {
      case "Point": {
        const point = geometry as google.maps.Data.Point;
        bounds.extend(point.get());
        break;
      }
      case "MultiPoint": {
        const multiPoint = geometry as google.maps.Data.MultiPoint;
        multiPoint.getArray().forEach((pt) => bounds.extend(pt));
        break;
      }
      case "LineString": {
        const lineString = geometry as google.maps.Data.LineString;
        lineString.getArray().forEach((coord) => bounds.extend(coord));
        break;
      }
      case "Polygon": {
        const polygon = geometry as google.maps.Data.Polygon;
        polygon.getArray().forEach((path) => {
          path.getArray().forEach((coord) => bounds.extend(coord));
        });
        break;
      }
      case "MultiPolygon": {
        const multiPolygon = geometry as google.maps.Data.MultiPolygon;
        multiPolygon.getArray().forEach((polygon) => {
          polygon.getArray().forEach((path) => {
            path.getArray().forEach((coord) => bounds.extend(coord));
          });
        });
        break;
      }
      default: {
        console.warn("Skipping unsupported geometry type:", type);
      }
    }
  }

  /**
   * Create a driving route between the start and end markers.
   */
  function handleRoute() {
    if (!mapRef.current) {
      setError("Map is not initialized yet.");
      return;
    }
    if (!startMarker || !endMarker) {
      setError("Please set both Start and End addresses.");
      return;
    }
    if (!directionsServiceRef.current || !directionsRendererRef.current) {
      setError("Directions service is not available.");
      return;
    }

    setLoading(true);
    directionsServiceRef.current.route(
      {
        origin: startMarker.getPosition() as google.maps.LatLng,
        destination: endMarker.getPosition() as google.maps.LatLng,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setLoading(false);
        if (status === google.maps.DirectionsStatus.OK && result) {
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result);
          } else {
            setError("Directions Renderer is not available.");
          }
          setError("");
        } else {
          console.error("Directions API Error:", status, result);
          setError(
            "Unable to create route. Please check the addresses or your API quota."
          );
        }
      }
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* 1) Load Google Maps Script with Places Library */}
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDDUu1gbVwj8pIbcPvusPSAb0cjyUN9l1s&libraries=places"
        onLoad={initMap}
      />

      {/* 2) Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 text-white">
          Loading...
        </div>
      )}

      {/* 3) Error Message */}
      {error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-red-200 text-red-700 p-2 rounded">
          {error}
        </div>
      )}

      {/* 4) GeoJSON Upload UI */}
      <div className="absolute top-4 left-4 z-40 p-2 bg-white/80 rounded shadow">
        <Label htmlFor="geojson-file">Upload GeoJSON</Label>
        <Input
          id="geojson-file"
          type="file"
          accept=".geojson,application/geo+json"
          onChange={handleFileUpload}
        />
      </div>

      {/* 5) Start & End Address Inputs */}
      <div className="absolute top-4 right-4 z-40 w-80 p-2 bg-white/80 rounded shadow space-y-2">
        <div>
          <Label htmlFor="start-input">Start Address</Label>
          <Input
            id="start-input"
            ref={startInputRef}
            placeholder="Enter starting address"
          />
        </div>
        <div>
          <Label htmlFor="end-input">End Address</Label>
          <Input
            id="end-input"
            ref={endInputRef}
            placeholder="Enter destination address"
          />
        </div>
        {/* Apply 'text-black' to make the button text color black */}
        <Button className="text-black" onClick={handleRoute}>
          Create Route
        </Button>
      </div>

      {/* 6) Map Container */}
      <div id="map" className="w-full h-full" />
    </div>
  );
}

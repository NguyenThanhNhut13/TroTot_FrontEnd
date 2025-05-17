import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

interface RoomMapProps {
  latitude: number;
  longitude: number;
  roomTitle?: string;
  roomAddress?: string;
  onPositionChange?: (lat: number, lng: number, address?: string) => void;
}

const RoomMap: React.FC<RoomMapProps> = ({
  latitude,
  longitude,
  roomTitle = "Phòng trọ",
  roomAddress = "",
  onPositionChange,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  }>({ lat: latitude, lng: longitude });
  const [selectedAddress, setSelectedAddress] = useState<string>(
    roomAddress || ""
  );

  // Fetch address from coordinates using Nominatim
  const fetchAddress = async (coords: {
    lat: number;
    lng: number;
  }): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "vi", // Get results in Vietnamese
            "User-Agent": "TroTot App", // Required by Nominatim usage policy
          },
        }
      );
      const data = await response.json();
      return data.display_name || "Không xác định";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Không thể xác định địa chỉ";
    }
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center: LatLngTuple = [latitude, longitude];

    const map = L.map(mapContainerRef.current).setView(center, 15);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const marker = L.marker(center, { draggable: true })
      .addTo(map)
      .bindPopup(`<b>${roomTitle}</b><br>${roomAddress || ""}`)
      .openPopup();

    markerRef.current = marker;

    marker.on("moveend", async () => {
      const newCoords = marker.getLatLng();
      setSelectedPosition({ lat: newCoords.lat, lng: newCoords.lng });

      const newAddress = await fetchAddress(newCoords);
      setSelectedAddress(newAddress);

      if (onPositionChange) {
        onPositionChange(newCoords.lat, newCoords.lng, newAddress);
      }
    });

    map.on("moveend", async () => {
      const newCenter = map.getCenter();
      const newCoords = { lat: newCenter.lat, lng: newCenter.lng };
      marker.setLatLng(newCoords);
      setSelectedPosition(newCoords);

      const newAddress = await fetchAddress(newCoords);
      setSelectedAddress(newAddress);

      if (onPositionChange) {
        onPositionChange(newCoords.lat, newCoords.lng, newAddress);
      }
    });

    // Cleanup function to destroy map instance
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, roomTitle, roomAddress, onPositionChange]);

  // Update marker position if props change
  useEffect(() => {
    if (
      mapRef.current &&
      markerRef.current &&
      (latitude !== selectedPosition.lat || longitude !== selectedPosition.lng)
    ) {
      const newPos: LatLngTuple = [latitude, longitude];
      markerRef.current.setLatLng(newPos);
      mapRef.current.setView(newPos, mapRef.current.getZoom());
      setSelectedPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, selectedPosition]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      />
      <div className="text-muted mt-2 small">
        {selectedAddress && (
          <p>
            <strong>Địa chỉ:</strong> {selectedAddress}
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomMap;

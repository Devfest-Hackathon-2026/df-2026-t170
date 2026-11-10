"use client";

/**
 * Google Maps JavaScript API を使って市区町村ポリゴンを描画するコンポーネント。
 * NOTE: MVP では Google Maps API キーが未設定のためモック表示。
 *       NEXT_PUBLIC_GOOGLE_MAPS_API_KEY が設定されたら実描画に切り替わる。
 */

import { useEffect, useRef } from "react";

// Google Maps JS SDK のグローバル型宣言（@types/google.maps 未インストールのため暫定）
declare global {
  interface Window {
    google?: {
      maps: {
        Map: new (
          el: HTMLElement,
          opts: object,
        ) => { setCenter: (c: object) => void };
        Polygon: new (opts: object) => void;
      };
    };
  }
}

type LatLng = { lat: number; lng: number };

type Props = {
  paths: LatLng[];
  municipalityName: string;
};

export default function MunicipalityMap({ paths, municipalityName }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current || paths.length === 0) return;

    // Google Maps JS SDK の動的ロード
    const scriptId = "google-maps-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !window.google) return;
      const center = paths[0];
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });
      new window.google.maps.Polygon({
        paths,
        strokeColor: "#059669",
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: "#059669",
        fillOpacity: 0.25,
        map,
      });
    }
  }, [apiKey, paths]);

  if (!apiKey) {
    // APIキー未設定時のフォールバック表示
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-emerald-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl"
        role="img"
        aria-label={`${municipalityName}の地図（準備中）`}
      >
        <span className="text-4xl" aria-hidden>
          🗺️
        </span>
        <p className="text-sm">地図を表示するには</p>
        <p className="text-xs opacity-70">Google Maps API キーが必要です</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl"
      role="img"
      aria-label={`${municipalityName}の地図`}
    />
  );
}

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { RouteOptimizationResult, OptimizedRouteApiResponse } from '../types';

interface RouteMapProps {
  routeResult?: RouteOptimizationResult;
  routeData?: OptimizedRouteApiResponse;
}

export const RouteMap: React.FC<RouteMapProps> = ({ routeResult, routeData }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Normalize stops and start location whether received as routeData or routeResult
  const startLoc = routeData?.start_location
    ? {
        lat: routeData.start_location.latitude,
        lng: routeData.start_location.longitude,
        address: routeData.start_location.address || 'Farmer Farm / Aggregation Depot'
      }
    : routeResult?.depotLocation
    ? {
        lat: routeResult.depotLocation.lat,
        lng: routeResult.depotLocation.lng,
        address: routeResult.depotLocation.address || 'Depot Hub'
      }
    : {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Central Aggregation Hub'
      };

  const stops = routeData?.route
    ? routeData.route.map((st) => ({
        sequence: st.sequence,
        orderId: st.order_id,
        lat: st.latitude,
        lng: st.longitude,
        buyerName: st.buyer_name || `Buyer #${st.sequence}`,
        address: st.address || 'Delivery Location',
        quantity: st.quantity,
        estimatedArrival: st.estimated_arrival_time
      }))
    : routeResult?.stops
    ? routeResult.stops.map((st) => ({
        sequence: st.sequenceOrder,
        orderId: st.orderId,
        lat: st.lat,
        lng: st.lng,
        buyerName: st.buyerName,
        address: st.address,
        quantity: st.quantityKg,
        estimatedArrival: st.estimatedArrival
      }))
    : [];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map once
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([startLoc.lat, startLoc.lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    // 1. Starting Location Marker (🏠 Start)
    const startIcon = L.divIcon({
      className: 'custom-start-pin',
      html: `
        <div style="
          background: #064E3B;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        ">🏠</div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const startMarker = L.marker([startLoc.lat, startLoc.lng], {
      icon: startIcon
    }).bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
        <strong style="color: #064E3B; font-size: 13px;">🏠 Starting Location</strong><br/>
        <span>${startLoc.address}</span><br/>
        <small style="color: #64748B;">Farmer Farm / Aggregation Hub</small>
      </div>
    `);
    layers.addLayer(startMarker);

    // 2. Stop Markers with clear circled numbers ①, ②, ③, ④
    const circledNumbers = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮'];
    const latLngs: [number, number][] = [[startLoc.lat, startLoc.lng]];

    stops.forEach((stop) => {
      latLngs.push([stop.lat, stop.lng]);

      const circleBadge = circledNumbers[stop.sequence] || `${stop.sequence}`;
      const stopIcon = L.divIcon({
        className: 'custom-stop-pin',
        html: `
          <div style="
            background: #059669;
            color: white;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 2.5px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 15px;
          ">${circleBadge}</div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const stopMarker = L.marker([stop.lat, stop.lng], { icon: stopIcon }).bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; min-width: 140px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="background: #ECFDF5; color: #047857; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
              Stop #${stop.sequence}
            </span>
            <span style="color: #64748B; font-size: 10px;">#${stop.orderId}</span>
          </div>
          <h4 style="margin: 2px 0; font-weight: 800; font-size: 13px;">📍 ${stop.buyerName}</h4>
          <p style="margin: 0; color: #475569; font-size: 11px;">${stop.address}</p>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #E2E8F0; font-size: 11px;">
            <strong>Quantity:</strong> ${stop.quantity} kg<br/>
            ${stop.estimatedArrival ? `<strong>Est. Arrival:</strong> ${stop.estimatedArrival}` : ''}
          </div>
        </div>
      `);
      layers.addLayer(stopMarker);
    });

    // Loop back to start location
    latLngs.push([startLoc.lat, startLoc.lng]);

    // 3. Polyline route line connecting Start -> Stop 1 -> Stop 2 -> ... -> Start
    const routeLine = L.polyline(latLngs, {
      color: '#059669',
      weight: 4.5,
      opacity: 0.9,
      dashArray: '3, 6',
      lineJoin: 'round'
    });
    layers.addLayer(routeLine);

    // Fit bounds to show all markers
    try {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    } catch (e) {
      // safe fallback
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => clearTimeout(timer);
  }, [startLoc.lat, startLoc.lng, stops.length]);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border-2 border-emerald-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-2xl border border-stone-200 shadow-md text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-950 flex items-center justify-center text-[10px] text-white font-black">
            🏠
          </span>
          <span className="text-stone-800 font-bold">Start (Farmer Farm / Hub)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-black">
            ①
          </span>
          <span className="text-stone-800 font-bold">Numbered Delivery Stop</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="w-6 h-1 bg-emerald-600 rounded"></span>
          <span className="text-stone-500 text-[10px] font-semibold">Planned Delivery Route</span>
        </div>
      </div>
    </div>
  );
};

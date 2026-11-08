import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PIN_TYPES, TOWN_CENTER } from '@/lib/constants';
import type { MapPin } from '@/features/map/types';

interface MapCanvasProps {
  pins: MapPin[];
  placing: boolean;
  onMapClick: (lat: number, lng: number) => void;
  onPinClick: (pin: MapPin) => void;
}

export default function MapCanvas({ pins, placing, onMapClick, onPinClick }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const mapClickRef = useRef(onMapClick);
  const pinClickRef = useRef(onPinClick);

  useEffect(() => {
    mapClickRef.current = onMapClick;
    pinClickRef.current = onPinClick;
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [TOWN_CENTER.lat, TOWN_CENTER.lng],
      zoom: 14,
      zoomControl: false,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    map.on('click', (event: L.LeafletMouseEvent) => mapClickRef.current(event.latlng.lat, event.latlng.lng));
    mapRef.current = map;
    const timer = window.setTimeout(() => map.invalidateSize(), 150);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) containerRef.current.style.cursor = placing ? 'crosshair' : '';
  }, [placing]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    pins.forEach((pin) => {
      const icon = L.divIcon({
        className: 'focsani-pin',
        html: `<span style="background:${PIN_TYPES[pin.type].color}"></span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 34],
      });
      L.marker([pin.lat, pin.lng], { icon, title: pin.title })
        .on('click', () => pinClickRef.current(pin))
        .addTo(layer);
    });
  }, [pins]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Harta Focșaniului" />;
}

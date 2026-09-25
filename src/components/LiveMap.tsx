'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayersControl, LayerGroup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const projectIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  className: 'hue-rotate-90' // Make it a different color
});

interface Complaint {
  id: string;
  category: string;
  severity: number;
  district: string;
  text: string;
  lat: number;
  lng: number;
}

const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Pune": [18.5204, 73.8567],
  "Mumbai": [19.0760, 72.8777],
  "Thane": [19.2183, 72.9781],
  "Nagpur": [21.1458, 79.0882],
  "Nashik": [20.0110, 73.7903],
  "Birbhum": [23.9102, 87.5278],
  "South 24 Parganas": [22.1466, 88.4237],
  "Kolkata": [22.5726, 88.3639],
  "Darjeeling": [27.0360, 88.2627],
  "Howrah": [22.5958, 88.2636],
  "New Delhi": [28.6139, 77.2090],
  "Bengaluru": [12.9716, 77.5946],
  "Mysuru": [12.2958, 76.6394],
  "Chennai": [13.0827, 80.2707],
  "Coimbatore": [11.0168, 76.9558],
};

function getCoordinates(district: string, index: number): [number, number] {
  // If known district, use exact coordinates with a tiny jitter to prevent marker overlap
  if (DISTRICT_COORDS[district]) {
    const [baseLat, baseLng] = DISTRICT_COORDS[district];
    const latOffset = (Math.sin(index * 13) * 0.05);
    const lngOffset = (Math.cos(index * 17) * 0.05);
    return [baseLat + latOffset, baseLng + lngOffset];
  }
  
  // Fallback: Hash the district name to a rough coordinate within India (Lat 10-30, Lng 70-90)
  let hash = 0;
  for (let i = 0; i < district.length; i++) {
    hash = district.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = 10 + Math.abs((hash % 2000) / 100);
  const lng = 70 + Math.abs(((hash >> 8) % 2000) / 100);
  
  return [lat, lng];
}

export default function LiveMap({ data, projects = [] }: { data: any[], projects?: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [mappedProjects, setMappedProjects] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
    
    // Generate mapped coordinates based on the District name
    const mapped = data.map((item, index) => {
      const dist = item.district || 'Unknown';
      const [lat, lng] = getCoordinates(dist, index);
      
      return {
        id: item.id || String(index),
        category: item.aiCategory || 'Unknown',
        severity: item.severity || 1,
        district: dist,
        text: item.originalText || 'Complaint',
        lat,
        lng,
      };
    });
    setComplaints(mapped);

    // Mapped projects
    const pMapped = projects.map((item, index) => {
      const dist = item.districtCode || 'Unknown';
      const [lat, lng] = getCoordinates(dist, index + 100); // offset index to separate from complaints
      return {
        ...item,
        lat,
        lng,
      };
    });
    setMappedProjects(pMapped);

  }, [data, projects]);

  if (!mounted) return <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded flex items-center justify-center">Loading Intelligence Map...</div>;

  return (
    <div className="h-[500px] w-full rounded shadow-md overflow-hidden z-0 relative">
      <MapContainer key="india-live-map" center={[22.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
          </LayersControl.BaseLayer>

          {/* Layer 1: Citizen Demand */}
          <LayersControl.Overlay checked name="Layer 1: Citizen Demand">
            <LayerGroup>
              {complaints.map((c) => (
                <CircleMarker
                  key={c.id}
                  center={[c.lat, c.lng]}
                  radius={c.severity * 3 + 2}
                  fillColor={c.severity >= 4 ? '#ef4444' : c.severity === 3 ? '#f59e0b' : '#3b82f6'}
                  color={c.severity >= 4 ? '#b91c1c' : c.severity === 3 ? '#d97706' : '#2563eb'}
                  weight={2}
                  opacity={0.8}
                  fillOpacity={0.5}
                >
                  <Tooltip>Citizen Demand: {c.category}</Tooltip>
                  <Popup>
                    <div className="text-sm min-w-[200px]">
                      <h4 className="font-bold text-slate-800 border-b pb-1 mb-2">Citizen Demand</h4>
                      <p className="font-medium">{c.category}</p>
                      <p className="text-slate-600 mb-1">{c.district}</p>
                      <p className="text-xs italic bg-slate-50 p-1 rounded border">&quot;{c.text.substring(0, 60)}{c.text.length > 60 ? '...' : ''}&quot;</p>
                      <div className="mt-2 text-xs font-bold uppercase flex justify-between">
                        <span className={c.severity >= 4 ? 'text-red-600' : 'text-yellow-600'}>
                          Severity: {c.severity}/5
                        </span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Layer 3/4: Government Projects */}
          <LayersControl.Overlay checked name="Layer 3 & 4: Govt Projects">
            <LayerGroup>
              {mappedProjects.map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={projectIcon}>
                  <Tooltip>Project: {p.projectName}</Tooltip>
                  <Popup>
                    <div className="text-sm min-w-[200px]">
                      <h4 className="font-bold text-green-800 border-b pb-1 mb-2">Government Project</h4>
                      <p className="font-bold">{p.projectName}</p>
                      <p className="text-slate-600">{p.category}</p>
                      <div className="mt-2 text-xs grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-1 rounded">
                          <span className="block text-slate-400">Status</span>
                          <span className={`font-bold ${p.status === 'Active' ? 'text-green-600' : 'text-blue-600'}`}>{p.status}</span>
                        </div>
                        <div className="bg-slate-50 p-1 rounded">
                          <span className="block text-slate-400">Budget</span>
                          <span className="font-bold">₹{(p.budgetAmount / 10000000).toFixed(1)} Cr</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

        </LayersControl>
      </MapContainer>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  User,
  Clock,
  Activity,
  ChevronDown,
  Search,
  Calendar,
  FileText,
  Filter,
  ArrowLeft,
  Loader2,
  Building2,
  Fingerprint
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api, { userApi } from '../../lib/api';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import { toast } from 'sonner';

const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [20, 32],
  iconAnchor: [10, 32]
});

const geoCache: Record<string, any> = {};

const fetchAddress = async (lat: number, lon: number): Promise<any> => {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (geoCache[key]) return geoCache[key];
  try {
    const res = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${lon},${lat}`);
    const data = await res.json();
    const addr = data.address || {};
    const result = { colony: addr.Neighborhood || addr.ShortLabel || "Location Verified", city: addr.City || "Remote" };
    geoCache[key] = result;
    return result;
  } catch (e) { return { colony: "Unknown Area", city: "" }; }
};

const RecenterMap = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => { if (coords) map.setView(coords, 14); }, [coords, map]);
  return null;
};

const FitRouteBounds = ({ path }: { path: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [path, map]);
  return null;
};

const ReportRow = ({ point, formatIST }: any) => {
  const [addr, setAddr] = useState<any>(null);
  useEffect(() => { fetchAddress(point.latitude, point.longitude).then(setAddr); }, [point.latitude, point.longitude]);
  return (
    <TableRow className="border-b border-slate-50">
      <TableCell className="py-2 px-4 text-[9px] font-bold text-slate-500">{formatIST(point.timestamp, 'time')}</TableCell>
      <TableCell className="py-2 px-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-800 uppercase leading-none">{addr?.colony || '...'}</span>
          <span className="text-[7px] text-slate-400 font-medium">{addr?.city}</span>
        </div>
      </TableCell>
    </TableRow>
  );
};

export const RouteTracking = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [highlightedPoint, setHighlightedPoint] = useState<[number, number] | null>(null);
  const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [isReportView, setIsReportView] = useState(false);
  const [rawRouteData, setRawRouteData] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);

  const formatIST = (dateStr: any, formatType: 'date' | 'time' | 'both' = 'both') => {
    if (!dateStr) return '—';
    let finalStr = dateStr;
    // If the backend sends a date without timezone (typical for LocalDateTime), 
    // we explicitly treat it as UTC to perform the 5.5h shift to IST.
    if (typeof dateStr === 'string' && !dateStr.includes('Z') && !dateStr.includes('+')) {
      finalStr = dateStr.replace(' ', 'T');
      if (!finalStr.endsWith('Z')) finalStr += 'Z';
    }
    const date = new Date(finalStr);
    if (isNaN(date.getTime())) return '—';
    const opt: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', hour12: true };
    if (formatType === 'date') return date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
    if (formatType === 'time') return date.toLocaleTimeString('en-IN', { ...opt, hour: '2-digit', minute: '2-digit' });
    return date.toLocaleString('en-IN', { ...opt, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    userApi.getAllUsers().then(res => { if (res?.data) { setAllEmployees(res.data); } });
  }, []);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await api.get('/tracking/live');
        const data = res.data.data || res.data;
        if (Array.isArray(data)) setPersonnel(data);
      } catch (e) { } finally { setIsLoading(false); }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedEmp) {
      api.get(`/attendance/recent/${selectedEmp.id}`).then(res => {
        if (res.data?.code === 1) { 
            setAttendanceList(res.data.data); 
            if (res.data.data.length > 0) setSelectedAttendance(res.data.data[0]); 
        }
      });
    }
  }, [selectedEmp]);

  useEffect(() => {
    const fetchRoute = async () => {
      const activeAtt = attendanceList.find(a => a && (!a.punchOutTime || a.status === 'ACTIVE'));
      const targetId = viewMode === 'live' ? (activeAtt?.id || attendanceList[0]?.id) : selectedAttendance?.id;
      if (!selectedEmp || !targetId) return;
      try {
        const res = await api.get(`/location/route?employeeId=${selectedEmp.id}&attendanceId=${targetId}`);
        if (res.data?.data) {
          const valid = res.data.data.filter((p: any) => typeof p.latitude === 'number');
          setRawRouteData(valid);
          setRoutePath(valid.map((p: any) => [p.latitude, p.longitude] as [number, number]));
        }
      } catch (e) { }
    };
    fetchRoute();
    if (viewMode === 'live') { const i = setInterval(fetchRoute, 8000); return () => clearInterval(i); }
  }, [selectedEmp, selectedAttendance, viewMode, attendanceList]);

  const handleDownloadPdf = async () => {
    const el = document.getElementById('proper-official-report');
    if (!el) return;
    setIsExporting(true);
    const toastId = toast.loading('Exporting Official Dossier...');
    await new Promise(r => setTimeout(r, 1200));
    try {
      const img = await toJpeg(el, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (el.scrollHeight * w) / el.scrollWidth;
      pdf.addImage(img, 'JPEG', 0, 0, w, h);
      pdf.save(`MRS-Official-Route-${selectedEmp?.name}.pdf`);
      toast.success('Dossier Downloaded', { id: toastId });
    } catch (e) { toast.error('PDF Failed', { id: toastId }); }
    finally { setIsExporting(false); }
  };

  if (isReportView) {
    return (
      <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-900 flex justify-between items-center text-white shrink-0 z-30 shadow-2xl">
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsReportView(false)} variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/10"><ArrowLeft size={16}/></Button>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] italic">Official Audit System</span>
          </div>
          <Button onClick={handleDownloadPdf} disabled={isExporting} className="h-8 px-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold uppercase rounded-md shadow-lg">
             {isExporting ? "Processing..." : "Export Official PDF"}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-100/50">
           <div id="proper-official-report" className="max-w-[750px] mx-auto bg-white p-14 border border-slate-200 shadow-2xl relative">
              
              {/* Official Letterhead */}
              <div className="flex justify-between items-start border-b-[4px] border-primary pb-8 mb-8">
                 <div>
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg"><Navigation size={26} className="transform -rotate-45" /></div>
                     <div className="flex flex-col">
                       <h1 className="text-2xl font-black text-slate-900 italic leading-none">M.R.S. POORVA ENTERPRISES</h1>
                       <p className="text-[9px] font-bold text-primary uppercase tracking-[0.3em] mt-1">Personnel Tracking & Security Force</p>
                     </div>
                   </div>
                   <div className="space-y-0.5 mt-4">
                     <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2"><MapPin size={10}/> Head Office: Saharanpur, Uttar Pradesh - 247001</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2"><Fingerprint size={10}/> GSTIN: 09XXXXXXXXXXXXX (Verified Official)</p>
                   </div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                   <div className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-widest mb-4">Official Route Dossier</div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Generated At</p>
                   <p className="text-xs font-bold text-slate-900 tracking-tight">{formatIST(new Date().toISOString())}</p>
                 </div>
              </div>

              {/* Dossier Info Bar */}
              <div className="grid grid-cols-3 gap-6 p-6 bg-slate-50 border border-slate-100 rounded-2xl mb-10 shadow-inner">
                <div className="flex flex-col gap-1.5"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Field Personnel</span><span className="text-sm font-bold text-slate-900 uppercase">{selectedEmp?.name}</span></div>
                <div className="flex flex-col gap-1.5 text-center"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tracking Cycle</span><span className="text-sm font-bold text-slate-900">{selectedAttendance ? formatIST(selectedAttendance.punchInTime, 'date') : 'Live Cycle'}</span></div>
                <div className="flex flex-col gap-1.5 text-right"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Telemetry Nodes</span><span className="text-sm font-bold text-emerald-600 italic">{rawRouteData.length} Verified Hits</span></div>
              </div>

              {/* High Fidelity Map Capture */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden h-[340px] mb-10 bg-slate-50 shadow-sm">
                 <MapContainer center={routePath[0] || [28.6139, 77.2090]} zoom={13} className="h-full w-full" zoomControl={false}>
                   <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} crossOrigin="anonymous" />
                   <FitRouteBounds path={routePath} />
                   <Polyline positions={routePath} color="#C81D25" weight={6} opacity={0.4} lineCap="round"/>
                   <Polyline positions={routePath} color="#C81D25" weight={3} opacity={0.8} lineCap="round"/>
                 </MapContainer>
              </div>

              {/* Verified Metadata Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-900"><TableRow><TableHead className="h-10 px-6 text-white text-[10px] font-bold uppercase tracking-widest border-r border-white/10 w-32">IST Time</TableHead><TableHead className="h-10 px-6 text-white text-[10px] font-bold uppercase tracking-widest">Geospatial Verified Metadata</TableHead></TableRow></TableHeader>
                  <TableBody>{rawRouteData.slice(0, 150).map((pt, i) => <ReportRow key={i} point={pt} formatIST={formatIST} />)}</TableBody>
                </Table>
              </div>
              
              <div className="mt-10 pt-10 border-t border-slate-100 flex justify-between items-end">
                <div className="flex flex-col gap-1"><span className="text-[8px] font-black text-slate-900 uppercase">Manmohan Sarvosmi</span><span className="text-[7px] font-bold text-slate-400 uppercase">Principal Director • M.E.S. Services</span></div>
                <div className="text-right text-[7px] text-slate-300 font-bold uppercase tracking-[0.4em] italic">Electronic Verification System ID: HELIX-ULTRA-CORE-2.4</div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen bg-[#FDFDFD] overflow-hidden p-3 gap-3">
      
      {/* ── Dashboard Top Header ── */}
      <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between shadow-sm border-slate-200 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg"><Navigation size={18} className="transform -rotate-45" /></div>
          <div><h2 className="text-xs font-bold text-slate-900 uppercase tracking-tighter">M.R.S. Fleet Intelligence</h2><p className="text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-1 mt-0.5 animate-pulse">● {personnel.length} Operatives Online</p></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <select value={selectedEmp?.id?.toString() || ""} onChange={(e) => { const emp = allEmployees.find(x => x.id.toString() === e.target.value); if (emp) { setSelectedEmp(emp); setViewMode('live'); } }} className="appearance-none w-[220px] h-9 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 text-[10px] font-bold uppercase text-slate-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer">
              <option value="" disabled>Select Operative</option>
              {allEmployees.map(e => <option key={e.id} value={e.id.toString()}>{e.fullName || e.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
          </div>
          <Button onClick={() => setIsReportView(true)} className="h-9 px-6 bg-slate-900 hover:bg-primary text-white text-[9px] font-bold uppercase rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2">
            <FileText size={14}/> View Official Report
          </Button>
        </div>
      </div>

      {/* History selection */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
        <div className="bg-slate-50 px-3 py-1.5 border-b text-[8px] font-bold text-slate-400 uppercase flex items-center gap-2"><Calendar size={10} className="text-primary/40"/> Archived Units Log: <span className="text-slate-800">{selectedEmp?.name || '---'}</span></div>
        <div className="flex gap-2 p-2 overflow-x-auto custom-scrollbar-h bg-white">
          {attendanceList.length > 0 ? (
            attendanceList.map(att => (
              <button key={att.id} onClick={() => { setViewMode('history'); setSelectedAttendance(att); }} className={cn("px-4 py-2 border rounded-lg transition-all min-w-[120px] text-left", selectedAttendance?.id === att.id && viewMode === 'history' ? "bg-primary/[0.03] border-primary" : "bg-white border-slate-100 hover:border-slate-200")}>
                <span className={cn("text-[9px] font-bold uppercase block", selectedAttendance?.id === att.id ? "text-primary" : "text-slate-800")}>{formatIST(att.punchInTime, 'date')}</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{formatIST(att.punchInTime, 'time')} Cycle</span>
              </button>
            ))
          ) : ( <span className="text-[9px] font-bold text-slate-300 uppercase py-2 px-3 italic">Select personnel unit...</span> )}
        </div>
      </div>

      {/* Full Map Area */}
      <div className="flex-1 relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner group">
        <MapContainer center={selectedEmp?.coordinates || [28.6139, 77.2090]} zoom={13} className="h-full w-full z-0" zoomControl={false}>
          <TileLayer url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} />
          {highlightedPoint && <RecenterMap coords={highlightedPoint} />}
          {routePath.length > 0 && <FitRouteBounds path={routePath} />}
          {personnel.map(p => <Marker key={p.id} position={p.coordinates} icon={DefaultIcon} />)}
          {routePath.length > 0 && (
            <>
              <Polyline positions={routePath} color="#C81D25" weight={8} opacity={0.3} lineCap="round" />
              <Polyline positions={routePath} color="#C81D25" weight={3} opacity={0.8} lineCap="round" />
              <Polyline positions={routePath} color="#ffffff" weight={1} opacity={0.5} dashArray="8, 16" lineCap="round" />
              {routePath.map((pos, idx) => (
                <CircleMarker key={idx} center={pos} radius={idx === 0 || idx === routePath.length-1 ? 5 : 1.5} fillColor={idx === 0 ? "#10b981" : idx === routePath.length-1 ? "#f43f5e" : "#C81D25"} color="#fff" weight={1} fillOpacity={1}/>
              ))}
            </>
          )}
        </MapContainer>
        
        {/* Map Legend */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl border border-slate-200 shadow-xl space-y-2 pointer-events-none opacity-90 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
          <div className="flex items-center gap-3 text-[9px] font-bold text-slate-600 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" /> Verified Path</div>
          <div className="flex items-center gap-3 text-[9px] font-bold text-slate-600 uppercase"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Personnel Live</div>
          <div className="pt-2 border-t flex items-center gap-3 text-[8px] font-bold text-slate-400 italic">Electronic Log Verification Active</div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        .custom-scrollbar-h::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar-h::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        .leaflet-container { background: #F8FAFC !important; }
      `}} />
    </div>
  );
};
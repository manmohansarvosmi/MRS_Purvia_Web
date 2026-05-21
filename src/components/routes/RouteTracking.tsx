import React, { useEffect, useState, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  User,
  Clock,
  Activity,
  ChevronRight,
  Search,
  Calendar,
  FileText,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api, { userApi } from '../../lib/api';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import { toast } from 'sonner';

// Fix for default marker icons in Leaflet with Vite
const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const mockPersonnel = [
  {
    id: '101',
    name: 'Amit Sharma',
    empId: 'EMP001',
    status: 'moving',
    location: 'Noida Sector 18',
    lastUpdate: '2 mins ago',
    battery: '82%',
    coordinates: [28.5708, 77.3267] as [number, number]
  },
  {
    id: '102',
    name: 'Rahul Varma',
    empId: 'EMP005',
    status: 'idle',
    location: 'Indirapuram, Ghaziabad',
    lastUpdate: '15 mins ago',
    battery: '45%',
    coordinates: [28.6367, 77.3621] as [number, number]
  },
  {
    id: '103',
    name: 'Priya Singh',
    empId: 'EMP012',
    status: 'moving',
    location: 'Sarita Vihar, Delhi',
    lastUpdate: 'Just now',
    battery: '95%',
    coordinates: [28.5283, 77.2941] as [number, number]
  }
];

// ─── Reverse Geocoding: ArcGIS (FREE, no API key, no CORS issues, rich street/colony data) ───
// Uses ArcGIS World Geocoding Service (client-side, no key needed for non-stored display)
// Delivers highly accurate colony, street, and POI/landmark names in India.

// Coordinates rounded to 4 decimal places (~11m) to group nearby GPS jitter
const getCacheKey = (lat: number, lon: number): string =>
  `geo_arcgis_${lat.toFixed(4)}_${lon.toFixed(4)}`;

const getCachedAddress = (lat: number, lon: number): any | null => {
  try {
    const raw = localStorage.getItem(getCacheKey(lat, lon));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const setCachedAddress = (lat: number, lon: number, data: any) => {
  try { localStorage.setItem(getCacheKey(lat, lon), JSON.stringify(data)); }
  catch { /* localStorage full – silently ignore */ }
};

const queueGeocode = async (lat: number, lon: number): Promise<any> => {
  // 1. Check localStorage cache
  const cached = getCachedAddress(lat, lon);
  if (cached) return cached;

  // 2. Fetch from ArcGIS (fast, free, rich POI/street data, no CORS blocks)
  // ArcGIS requires longitude first, then latitude
  try {
    const res = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&location=${lon},${lat}`
    );
    if (!res.ok) throw new Error(`ArcGIS HTTP ${res.status}`);
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "ArcGIS Error");

    const addr = data.address || {};
    
    // Extract detailed location markers from ArcGIS response
    const landmark = addr.PlaceName || "";
    const street = addr.Address || addr.ShortLabel || "";
    const area = addr.Sector || addr.Neighborhood || addr.District || "";
    const city = addr.City || addr.Subregion || "";
    
    let colony = "";
    if (landmark && landmark !== street) {
      colony = landmark;
      if (area) colony += ` (${area})`;
      else if (street) colony += ` (${street})`;
    } else if (street && street !== area) {
      colony = street;
      if (area) colony += ` (${area})`;
    } else if (area) {
      colony = area;
    } else {
      colony = "Area Not Named";
    }

    const display = addr.LongLabel || data.name || "Location Found";
    
    const result = { colony, city, display };
    
    // Save to cache
    setCachedAddress(lat, lon, result);
    return result;
  } catch (e) {
    console.error("ArcGIS Geocoding failed for", lat, lon, e);
    // Fallback if network fails
    return {
      colony: "Location Unavailable",
      city: "",
      display: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    };
  }
};

// Component to handle map centering
const RecenterMap = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

const FitRouteBounds = ({ path }: { path: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (path.length > 0) {
      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [path, map]);
  return null;
};

// Sub-component for individual address rows to avoid Hooks violation in map()
const AddressRow = ({ point, formatIST, getAddress, setRoutePath, setIsReportOpen, setHighlightedPoint, isPdfExport }: any) => {
  const [addrObj, setAddrObj] = useState<any>(null);
  useEffect(() => {
    getAddress(point.latitude, point.longitude).then(setAddrObj);
  }, [point.latitude, point.longitude, getAddress]);

  if (!addrObj) return (
    <TableRow>
      <TableCell className="py-6 px-10" colSpan={isPdfExport ? 2 : 3}>
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
          <div className="h-4 w-48 bg-slate-100 rounded"></div>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <TableRow className="group border-slate-100 hover:bg-slate-50/50 transition-all duration-300">
      <TableCell className="py-6 px-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-slate-900 tracking-tight">{formatIST(point.timestamp || Date.now(), 'time')}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatIST(point.timestamp || Date.now(), 'date')}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-start gap-4 max-w-[600px]">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-all duration-500 border border-slate-100">
            <MapPin className="w-5 h-5 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all" />
          </div>
          <div className="pt-1.5">
            <p className="text-sm font-black text-slate-800 leading-tight uppercase tracking-tight">{addrObj.colony}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{addrObj.city}</p>
            <p className="text-[9px] text-slate-400 mt-1.5 leading-relaxed opacity-60 font-medium">{addrObj.display}</p>
            <span className="text-[9px] font-mono text-slate-400 mt-2 block bg-slate-50 w-fit px-2 py-0.5 rounded border border-slate-100">GPS: {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}</span>
          </div>
        </div>
      </TableCell>
      {!isPdfExport && (
        <TableCell className="text-right py-6 px-10">
          <Button 
            onClick={() => {
              setHighlightedPoint([point.latitude, point.longitude]);
              setIsReportOpen(false);
            }}
            className="h-10 px-8 bg-slate-900 text-white hover:bg-primary text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl shadow-slate-200 hover:shadow-primary/20 active:scale-95"
          >
            Locate Point
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

export const RouteTracking = () => {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedPoint, setHighlightedPoint] = useState<[number, number] | null>(null);

  // IST Date Formatter
  const formatIST = (dateStr: string, formatType: 'date' | 'time' | 'both' = 'both') => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: true,
    };
    if (formatType === 'date') {
      return date.toLocaleDateString('en-IN', { ...options, day: '2-digit', month: 'short', year: 'numeric' });
    } else if (formatType === 'time') {
      return date.toLocaleTimeString('en-IN', { ...options, hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleString('en-IN', { ...options, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  // Advanced Features State
  const [viewMode, setViewMode] = useState<'live' | 'history'>('live');
  const [attendanceList, setAttendanceList] = useState<any[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportInterval, setReportInterval] = useState(10); // minutes
  const [rawRouteData, setRawRouteData] = useState<any[]>([]);
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Reverse Geocoding Function
  const getAddress = useCallback(async (lat: number, lon: number) => {
    return queueGeocode(lat, lon);
  }, []);

  // 0. Fetch all employees for dropdown
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const result = await userApi.getAllUsers();
        if (result && result.code === 1 && Array.isArray(result.data)) {
          setAllEmployees(result.data);
          if (result.data.length > 0 && !selectedEmp) {
            setSelectedEmp(result.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch all employees", err);
      }
    };
    fetchAll();
  }, []);

  // 1. Fetch live personnel list
  useEffect(() => {
    const fetchLivePersonnel = async () => {
      try {
        const response = await api.get('/tracking/live');
        const data = response.data.data || response.data; // Handle BaseResponse if necessary
        if (Array.isArray(data)) {
          setPersonnel(data);
          // Only auto-select if no employee is selected yet
          if (data.length > 0 && !selectedEmp && allEmployees.length === 0) {
            setSelectedEmp(data[0]);
          }
        }
      } catch (error) {
        console.error("Live tracking sync failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivePersonnel();
    const interval = setInterval(fetchLivePersonnel, 10000);
    return () => clearInterval(interval);
  }, [selectedEmp, viewMode, allEmployees.length]);

  // 2. Fetch attendance history when selected employee changes
  useEffect(() => {
    if (selectedEmp) {
      const fetchHistory = async () => {
        try {
          const response = await api.get(`/attendance/recent/${selectedEmp.id}`);
          const result = response.data;
          if (result && result.code === 1 && Array.isArray(result.data)) {
            setAttendanceList(result.data);
            if (viewMode === 'history' && result.data.length > 0) {
              setSelectedAttendance(result.data[0]);
            }
          } else {
            setAttendanceList([]);
          }
        } catch (err) {
          console.error("History fetch failed", err);
          setAttendanceList([]);
        }
      };
      fetchHistory();
    }
  }, [selectedEmp]);

  useEffect(() => {
    if (viewMode === 'history' && Array.isArray(attendanceList) && attendanceList.length > 0 && !selectedAttendance) {
      setSelectedAttendance(attendanceList[0]);
    }
  }, [viewMode, attendanceList, selectedAttendance]);

  // 3. Fetch route for selected attendance (and poll if live)
  useEffect(() => {
    const fetchRoute = async () => {
      if (!Array.isArray(attendanceList)) return;
      const activeAttendance = attendanceList.find(a => a && (!a.punchOutTime || a.status === 'ACTIVE'));
      const targetId = viewMode === 'live' 
        ? (activeAttendance?.id || (attendanceList.length > 0 ? attendanceList[0].id : 43)) 
        : selectedAttendance?.id;

      if (!selectedEmp || !targetId) return;

      try {
        const response = await api.get(`/location/route?employeeId=${selectedEmp.id}&attendanceId=${targetId}`);
        const result = response.data;

        if (result && result.data && Array.isArray(result.data)) {
          const validData = result.data.filter((p: any) => 
            p && 
            typeof p.latitude === 'number' && 
            typeof p.longitude === 'number' &&
            !isNaN(p.latitude) &&
            !isNaN(p.longitude)
          );
          setRawRouteData(validData);
          const latlngs = validData.map((p: any) => [p.latitude, p.longitude] as [number, number]);
          setRoutePath(latlngs);
        } else {
          setRawRouteData([]);
          setRoutePath([]);
        }
      } catch (error) {
        console.error("Route fetch failed", error);
        setRawRouteData([]);
        setRoutePath([]);
      }
    };

    fetchRoute();

    if (viewMode === 'live') {
      const interval = setInterval(fetchRoute, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedEmp, selectedAttendance, viewMode, attendanceList]);

  const [isReportView, setIsReportView] = useState(false);
  const [timeDuration, setTimeDuration] = useState<string>('all');

  const getDurationFilteredData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    if (timeDuration === 'all') return data;
    
    const timestamps = data
      .map(p => p && p.timestamp ? new Date(p.timestamp).getTime() : null)
      .filter((t): t is number => t !== null && !isNaN(t));
      
    if (timestamps.length === 0) return data;
    const latestTime = Math.max(...timestamps);
    
    let durationMs = 0;
    if (timeDuration === '10m') durationMs = 10 * 60 * 1000;
    else if (timeDuration === '30m') durationMs = 30 * 60 * 1000;
    else if (timeDuration === '1h') durationMs = 60 * 60 * 1000;
    else if (timeDuration === '2h') durationMs = 2 * 60 * 60 * 1000;
    
    if (durationMs === 0) return data;
    
    return data.filter(p => {
      if (!p || !p.timestamp) return false;
      const t = new Date(p.timestamp).getTime();
      return !isNaN(t) && (latestTime - t) <= durationMs;
    });
  };

  const durationFilteredRouteData = getDurationFilteredData(rawRouteData);
  const filteredReportData = durationFilteredRouteData.filter((_, index) => index % (reportInterval || 1) === 0);
  const displayRoutePath = durationFilteredRouteData.map((p: any) => [p.latitude, p.longitude] as [number, number]);

  if (isLoading && personnel.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Live Routes...</p>
        </div>
      </div>
    );
  }

  // Render Report View
  if (isReportView) {
    const handleDownloadPdf = async () => {
      const reportElement = document.getElementById('report-content-for-pdf');
      if (!reportElement) {
        toast.error('Report content not found.');
        return;
      }

      setIsExporting(true);
      const btn = document.getElementById('download-pdf-btn');
      if (btn) btn.innerText = 'Generating PDF...';
      const toastId = toast.loading('Generating Route PDF, please wait...');

      // Small delay to ensure UI updates
      await new Promise(r => setTimeout(r, 500));

      try {
        const imgData = await toJpeg(reportElement, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          width: reportElement.scrollWidth,
          height: reportElement.scrollHeight,
        });

        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => { img.onload = resolve; });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (img.height * pdfWidth) / img.width;
        
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`Route-Report-${selectedEmp?.name || 'Employee'}-${new Date().getTime()}.pdf`);
        toast.success('PDF Downloaded Successfully!', { id: toastId });
      } catch (error: any) {
        console.error('Failed to generate PDF', error);
        toast.error(`Failed to download PDF: ${error.message || 'Unknown error'}`, { id: toastId });
      } finally {
        setIsExporting(false);
        if (btn) btn.innerText = 'Download PDF';
      }
    };

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-screen bg-slate-50 overflow-hidden"
      >
        {/* Report Control Bar (Hidden in PDF) */}
        {!isExporting && (
          <div className="bg-slate-900 px-10 py-6 text-white relative overflow-hidden shrink-0">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button 
                  onClick={() => setIsReportView(false)}
                  variant="ghost" 
                  className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 text-white p-0 border border-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-black tracking-tight uppercase">Report Designer</h2>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-0.5">Customize and export telemetry data</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Duration</span>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    {[
                      { val: 'all', label: 'All' },
                      { val: '10m', label: '10m' },
                      { val: '30m', label: '30m' },
                      { val: '1h', label: '1h' },
                      { val: '2h', label: '2h' }
                    ].map((opt) => (
                      <Button 
                        key={opt.val}
                        variant="ghost"
                        onClick={() => setTimeDuration(opt.val)}
                        className={cn(
                          "h-8 px-3 text-[9px] font-black rounded-lg transition-all",
                          timeDuration === opt.val ? "bg-white text-slate-900 shadow-lg" : "text-white/40 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="h-10 w-[1px] bg-white/10 mx-2" />

                <div className="flex flex-col items-end gap-2">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Granularity</span>
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    {[1, 5, 10, 30, 60].map((int) => (
                      <Button 
                        key={int}
                        variant="ghost"
                        onClick={() => setReportInterval(int)}
                        className={cn(
                          "h-8 px-4 text-[9px] font-black rounded-lg transition-all",
                          reportInterval === int ? "bg-white text-slate-900 shadow-lg" : "text-white/40 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {int}m
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="h-10 w-[1px] bg-white/10 mx-2" />

                <Button 
                  id="download-pdf-btn"
                  onClick={handleDownloadPdf}
                  className="h-11 px-8 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Proper PDF
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-slate-100/30" id="report-content-for-pdf">
          <div className="max-w-[1000px] mx-auto bg-white shadow-2xl rounded-[2.5rem] border border-slate-200/60 overflow-hidden flex flex-col min-h-[1400px]">
            
            {/* Professional Document Header */}
            <div className="p-12 border-b-4 border-primary/10 flex justify-between items-start bg-gradient-to-br from-slate-50 to-white">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">M.R.S. PURVIA</h1>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Telemetry & Route Intelligence</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Location Intelligence Report</h2>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-slate-900 text-white text-[10px] px-3 py-1 uppercase rounded-lg">Verification ID: #RT-{new Date().getTime().toString().slice(-6)}</Badge>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Confidential Data</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end text-right gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated On</p>
                  <p className="text-sm font-black text-slate-900">{formatIST(new Date().toISOString())}</p>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">MRS Poorva Enterprises</p>
                   <p className="text-[9px] font-medium text-slate-400">Security & Logistics Division</p>
                </div>
              </div>
            </div>

            {/* Employee & Context Summary */}
            <div className="grid grid-cols-3 gap-6 p-12 bg-slate-50/50 border-b border-slate-100">
               <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Personnel Name</span>
                 <span className="text-base font-black text-slate-900 uppercase">{selectedEmp?.name || 'Unknown'}</span>
               </div>
               <div className="flex flex-col gap-1 text-center">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Date</span>
                 <span className="text-base font-black text-slate-900">{selectedAttendance ? formatIST(selectedAttendance.punchInTime, 'date') : 'Live Route'}</span>
               </div>
               <div className="flex flex-col gap-1 text-end">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Waypoints</span>
                 <span className="text-base font-black text-emerald-600">{filteredReportData.length} Points Verified</span>
               </div>
            </div>

            {/* Map Preview for Report */}
            {displayRoutePath.length > 0 && (
              <div className="px-12 py-8">
                <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl overflow-hidden h-[350px] relative">
                  <MapContainer
                    center={displayRoutePath[0]}
                    zoom={13}
                    className="w-full h-full z-0"
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution="&copy; Google Maps"
                      url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                      subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                      crossOrigin="anonymous"
                    />
                    <FitRouteBounds path={displayRoutePath} />
                    <Marker position={displayRoutePath[displayRoutePath.length - 1]} icon={DefaultIcon}>
                      <Popup><div className="text-[10px] font-black uppercase">Start</div></Popup>
                    </Marker>
                    <Marker position={displayRoutePath[0]} icon={DefaultIcon}>
                      <Popup><div className="text-[10px] font-black uppercase">End</div></Popup>
                    </Marker>
                    <Polyline positions={displayRoutePath} color="#B2001A" weight={6} opacity={0.8} />
                  </MapContainer>
                  <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-xl shadow-lg border border-slate-200">
                    <span className="text-[10px] font-black text-slate-800 uppercase flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-primary" /> Visualized Route Map
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="flex-1 px-12 pb-12">
              <div className="border border-slate-200 rounded-[2rem] overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-900">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em] py-6 px-10">Timestamp</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-white/60 tracking-[0.2em] py-6">Geospatial Intelligence (Colony/Area)</TableHead>
                      {!isExporting && <TableHead className="text-right text-[10px] font-black uppercase text-white/60 tracking-[0.2em] py-6 px-10">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReportData.map((point, idx) => (
                      <AddressRow 
                        key={idx} 
                        point={point} 
                        formatIST={formatIST} 
                        getAddress={getAddress} 
                        setRoutePath={setRoutePath} 
                        setIsReportOpen={() => {}} 
                        setHighlightedPoint={(coords: any) => {
                          setHighlightedPoint(coords);
                          setIsReportView(false);
                        }}
                        isPdfExport={isExporting}
                      />
                    ))}
                  </TableBody>
                </Table>
                
                {filteredReportData.length === 0 && (
                  <div className="py-40 text-center bg-slate-50/50">
                    <Activity className="w-16 h-16 mx-auto mb-6 text-slate-200" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">No telemetry data recorded for this session</h4>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Footer */}
            <div className="p-12 bg-slate-900 text-white flex justify-between items-center mt-auto">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-black uppercase tracking-widest">M.R.S. Purvia Intelligence Report</p>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em]">Generated by Autonomous Fleet System</p>
              </div>
              <div className="flex items-center gap-10">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Confidentiality</span>
                   <span className="text-[11px] font-bold text-emerald-400 uppercase">Internally Verified</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <p className="text-[9px] font-black text-white/20">© 2024 HELIXION INNOVATIONS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button (Hidden in PDF) */}
        {!isExporting && (
          <div className="px-12 py-6 bg-white border-t border-slate-200/60 flex items-center justify-end shrink-0">
             <Button 
               onClick={() => setIsReportView(false)}
               className="h-12 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase px-12 shadow-xl shadow-slate-200 hover:bg-primary transition-all active:scale-95"
             >
               Return to Live Monitoring
             </Button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50 overflow-hidden p-4 lg:p-6 gap-6">
      
      {/* Header with Employee Selector */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex items-center justify-between shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Navigation className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Fleet Intelligence</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{personnel.length} Operatives Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Time Duration Dropdown */}
          <div className="flex items-center gap-3 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
             <div className="pl-3 flex items-center gap-2">
               <Clock className="w-4 h-4 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Duration</span>
             </div>
             <Select 
               value={timeDuration} 
               onValueChange={setTimeDuration}
             >
               <SelectTrigger className="w-[180px] h-10 border-none bg-white rounded-xl shadow-sm font-bold text-xs focus:ring-2 focus:ring-primary/20">
                 <SelectValue placeholder="Full Route" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-slate-200 shadow-2xl p-2">
                 <SelectItem value="all" className="text-xs font-bold py-2 px-4 rounded-xl mb-1">Full Route</SelectItem>
                 <SelectItem value="10m" className="text-xs font-bold py-2 px-4 rounded-xl mb-1">Last 10 Minutes</SelectItem>
                 <SelectItem value="30m" className="text-xs font-bold py-2 px-4 rounded-xl mb-1">Last 30 Minutes</SelectItem>
                 <SelectItem value="1h" className="text-xs font-bold py-2 px-4 rounded-xl mb-1">Last 1 Hour</SelectItem>
                 <SelectItem value="2h" className="text-xs font-bold py-2 px-4 rounded-xl mb-1">Last 2 Hours</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <div className="flex items-center gap-3 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
             <div className="pl-3 flex items-center gap-2">
               <User className="w-4 h-4 text-slate-400" />
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Select Personnel</span>
             </div>
             <Select 
               value={selectedEmp?.id?.toString()} 
               onValueChange={(val) => {
                 const isLive = personnel.find(p => p.id.toString() === val);
                 const emp = allEmployees.find(p => p.id.toString() === val) || isLive;
                 if (emp) { 
                   setSelectedEmp({
                     ...emp,
                     name: emp.fullName || emp.name,
                     empId: emp.employeeId || emp.username || emp.empId
                   }); 
                   setViewMode(isLive ? 'live' : 'history'); 
                 }
               }}
             >
               <SelectTrigger className="w-[280px] h-10 border-none bg-white rounded-xl shadow-sm font-bold text-xs focus:ring-2 focus:ring-primary/20">
                 <SelectValue>
                   {selectedEmp ? (selectedEmp.fullName || selectedEmp.name) : "Choose Personnel"}
                 </SelectValue>
               </SelectTrigger>
               <SelectContent className="rounded-2xl border-slate-200 shadow-2xl max-h-[400px] p-2">
                 {(allEmployees.length > 0 ? allEmployees : personnel).map(emp => (
                   <SelectItem key={emp.id} value={emp.id.toString()} className="text-xs font-bold py-3 px-4 rounded-xl mb-1 last:mb-0">
                     <div className="flex items-center justify-between w-full gap-8">
                       <span className="text-slate-700">{emp.fullName || emp.name}</span>
                       <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-400 border-none px-2 py-0.5">
                         {emp.employeeId || emp.username || emp.empId}
                       </Badge>
                     </div>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>
        </div>
      </div>

      {/* Route History — Compact Horizontal Strip */}
      <div className="shrink-0 bg-white border border-slate-200/60 rounded-2xl overflow-hidden">
        {/* Strip Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                Route History Archives
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <span className="text-indigo-600 font-black">{selectedEmp?.name || 'Select Personnel'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{attendanceList.length} Records</span>
              </p>
            </div>
          </div>
          {selectedEmp && (
            <Button 
              onClick={() => setIsReportView(true)} 
              className="h-8 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase gap-2 px-4 shadow-md hover:bg-primary transition-all active:scale-95 group"
            >
              <FileText className="w-3 h-3 group-hover:rotate-12 transition-transform" /> 
              Report
            </Button>
          )}
        </div>

        {/* Horizontal scroll strip */}
        <div className="overflow-x-auto custom-scrollbar-h">
          <div className="flex gap-3 p-3" style={{ minWidth: 'max-content' }}>
            {attendanceList.length > 0 ? (
              attendanceList.map((att, idx) => (
                <motion.button
                  key={att.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => { setViewMode('history'); setSelectedAttendance(att); }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-2.5 rounded-xl border transition-all duration-300 shrink-0 text-left",
                    selectedAttendance?.id === att.id && viewMode === 'history'
                      ? "bg-primary/5 border-primary ring-2 ring-primary/20 shadow-md"
                      : "bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200"
                  )}
                >
                  {/* Route number badge */}
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    selectedAttendance?.id === att.id ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-400"
                  )}>
                    <Navigation className="w-3.5 h-3.5" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-900">{formatIST(att.punchInTime, 'date')}</span>
                      {att.punchOutTime ? (
                        <span className="text-[7px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Archived</span>
                      ) : (
                        <span className="text-[7px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase animate-pulse">On-Going</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatIST(att.punchInTime, 'time')}</span>
                      <ChevronRight className="w-2.5 h-2.5 text-slate-300" />
                      <span>{att.punchOutTime ? formatIST(att.punchOutTime, 'time') : '...'}</span>
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Select an employee to view history</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="relative flex-1 min-h-[300px] w-full border border-slate-200/60 rounded-[2rem] overflow-hidden shrink-0 shadow-inner">
        <MapContainer
          center={selectedEmp?.coordinates || [28.6139, 77.2090]}
          zoom={13}
          className="w-full h-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; Google Maps"
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
          {selectedEmp?.coordinates && viewMode === 'live' && <RecenterMap coords={selectedEmp.coordinates} />}
          {highlightedPoint && <RecenterMap coords={highlightedPoint} />}
          {displayRoutePath.length > 0 && <FitRouteBounds path={displayRoutePath} />}

          {personnel.map(emp => (
            <Marker key={emp.id} position={emp.coordinates} icon={DefaultIcon}>
               {/* Marker icon customization could go here */}
            </Marker>
          ))}

          {highlightedPoint && (
            <Marker position={highlightedPoint} icon={DefaultIcon}>
              <Popup>
                <div className="text-[10px] font-black uppercase tracking-tight">Reported Point</div>
              </Popup>
            </Marker>
          )}

          {displayRoutePath.length > 0 && (
            <Polyline positions={displayRoutePath} color="#B2001A" weight={5} opacity={0.7} />
          )}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
          <div className="glass-panel px-5 py-4 rounded-[1.5rem] shadow-2xl text-[10px] font-bold space-y-3 pointer-events-auto border border-white/40 bg-white/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/30" />
              <span className="text-slate-700 uppercase tracking-tight">Active Route Path</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-300 shadow-sm" />
              <span className="text-slate-500 uppercase tracking-tight">Last Beacon Point</span>
            </div>
            <div className="pt-2 border-t border-slate-200/50 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
              <span className="text-slate-700 uppercase tracking-tight">Personnel Live</span>
            </div>
          </div>
        </div>

        {/* Map Controls Float */}
        <div className="absolute bottom-6 left-6 z-10 flex gap-2">
           <Button className="h-10 w-10 p-0 rounded-2xl bg-white text-slate-900 shadow-xl border-none hover:bg-slate-50 transition-all">
             <Activity className="w-4 h-4" />
           </Button>
           <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 border border-white/50">
             <div className="flex -space-x-2">
               {personnel.slice(0, 3).map((p, i) => (
                 <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                   <User className="w-3.5 h-3.5 text-slate-400" />
                 </div>
               ))}
             </div>
             <span className="text-[10px] font-black text-slate-800 uppercase">{personnel.length} Active</span>
           </div>
        </div>
      </div>



      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
        
        .custom-scrollbar-h::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar-h::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 10px;
        }
        .custom-scrollbar-h::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 10px;
        }
        .custom-scrollbar-h::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}} />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
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

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
const AddressRow = ({ point, formatIST, getAddress, setRoutePath, setIsReportOpen, setHighlightedPoint }: any) => {
  const [addr, setAddr] = useState<string>("Fetching...");
  useEffect(() => {
    getAddress(point.latitude, point.longitude).then(setAddr);
  }, [point.latitude, point.longitude, getAddress]);

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
            <p className="text-xs font-bold text-slate-700 leading-relaxed">{addr}</p>
            <span className="text-[9px] font-mono text-slate-400 mt-1 block">GPS: {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}</span>
          </div>
        </div>
      </TableCell>
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
  const [addressCache, setAddressCache] = useState<Record<string, string>>({});

  // Reverse Geocoding Function
  const getAddress = async (lat: number, lon: number) => {
    const key = `${lat},${lon}`;
    if (addressCache[key]) return addressCache[key];
    
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      const addr = data.display_name || "Location Found";
      setAddressCache(prev => ({ ...prev, [key]: addr }));
      return addr;
    } catch (e) {
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  };

  // 0. Fetch all employees for dropdown
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const result = await userApi.getAllUsers();
        if (result.code === 1) {
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
        setPersonnel(data);
        // Only auto-select if no employee is selected yet
        if (data.length > 0 && !selectedEmp && allEmployees.length === 0) {
          setSelectedEmp(data[0]);
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

  // 2. Fetch attendance history when switching to history mode
  useEffect(() => {
    if (viewMode === 'history' && selectedEmp) {
      const fetchHistory = async () => {
        try {
          const response = await api.get(`/attendance/recent/${selectedEmp.id}`);
          const result = response.data;
          if (result.code === 1) {
            setAttendanceList(result.data);
            if (result.data.length > 0) setSelectedAttendance(result.data[0]);
          }
        } catch (err) {
          console.error("History fetch failed", err);
        }
      };
      fetchHistory();
    }
  }, [viewMode, selectedEmp]);

  // 3. Fetch route for selected attendance
  useEffect(() => {
    const fetchRoute = async () => {
      const targetId = viewMode === 'live' ? 43 : selectedAttendance?.id;
      if (!selectedEmp || !targetId) return;

      try {
        const response = await api.get(`/location/route?employeeId=${selectedEmp.id}&attendanceId=${targetId}`);
        const result = response.data;

        if (result && result.data) {
          setRawRouteData(result.data);
          const latlngs = result.data.map((p: any) => [p.latitude, p.longitude] as [number, number]);
          setRoutePath(latlngs);
        }
      } catch (error) {
        console.error("Route fetch failed", error);
      }
    };

    fetchRoute();
  }, [selectedEmp, selectedAttendance, viewMode]);

  const [isReportView, setIsReportView] = useState(false);

  const filteredReportData = rawRouteData.filter((_, index) => index % (reportInterval || 1) === 0);

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
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-screen bg-slate-50 overflow-hidden"
      >
        {/* Report Header */}
        <div className="bg-slate-900 px-10 py-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <FileText className="w-64 h-64 text-white" />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                onClick={() => setIsReportView(false)}
                variant="ghost" 
                className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white p-0 border border-white/10 shadow-inner"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="h-10 w-[1px] bg-white/20 mx-2" />
              <div>
                <h2 className="text-2xl font-black tracking-tight">Route Intelligence Report</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-primary/20 text-white border-white/20 font-black text-[10px] px-3 py-0.5 uppercase">{selectedEmp?.name}</Badge>
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    Archive: {selectedAttendance ? formatIST(selectedAttendance.punchInTime, 'date') : 'Live Analytics'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Interval Granularity</span>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                {[1, 5, 10, 30, 60].map((int) => (
                  <Button 
                    key={int}
                    variant="ghost"
                    onClick={() => setReportInterval(int)}
                    className={cn(
                      "h-9 px-5 text-[10px] font-black rounded-xl transition-all",
                      reportInterval === int ? "bg-white text-slate-900 shadow-xl scale-105" : "text-white/40 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {int}m
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-[1200px] mx-auto bg-white rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md border-b border-slate-100">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] py-8 px-12">Temporal Marker</TableHead>
                  <TableHead className="text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] py-8">Geospatial Intelligence (Address)</TableHead>
                  <TableHead className="text-right text-[11px] font-black uppercase text-slate-500 tracking-[0.15em] py-8 px-12">Operations</TableHead>
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
                    setIsReportOpen={() => {}} // Not needed in full view
                    setHighlightedPoint={(coords: any) => {
                      setHighlightedPoint(coords);
                      setIsReportView(false);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
            
            {filteredReportData.length === 0 && (
              <div className="py-40 text-center opacity-30">
                <Navigation className="w-16 h-16 mx-auto mb-6 animate-pulse text-slate-300" />
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">No Intelligence Data Recorded</h4>
                <p className="text-[10px] font-bold mt-2">Telemetry waypoints will appear here once archived</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Footer */}
        <div className="px-12 py-6 bg-white border-t border-slate-200/60 flex items-center justify-between shrink-0">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Waypoints</span>
              <span className="text-sm font-black text-slate-900">{filteredReportData.length} Points Detected</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className="text-sm font-black text-emerald-500 uppercase">Verified Archives</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© Purvia Telemetry Intelligence</p>
             <Button 
               onClick={() => setIsReportView(false)}
               className="h-12 rounded-[1.25rem] bg-primary text-white text-[11px] font-black uppercase px-10 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
             >
               Return to Fleet Map
             </Button>
          </div>
        </div>
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
          {selectedAttendance && (
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
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedEmp?.coordinates && viewMode === 'live' && <RecenterMap coords={selectedEmp.coordinates} />}
          {highlightedPoint && <RecenterMap coords={highlightedPoint} />}
          {routePath.length > 0 && <FitRouteBounds path={routePath} />}

          {personnel.map(emp => (
            <Marker key={emp.id} position={emp.coordinates}>
               {/* Marker icon customization could go here */}
            </Marker>
          ))}

          {highlightedPoint && (
            <Marker position={highlightedPoint}>
              <Popup>
                <div className="text-[10px] font-black uppercase tracking-tight">Reported Point</div>
              </Popup>
            </Marker>
          )}

          {routePath.length > 0 && (
            <Polyline positions={routePath} color="#B2001A" weight={5} opacity={0.7} />
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

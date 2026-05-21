import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  Edit2,
  Trash2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/src/lib/utils";
import { Employee } from '../../types';
import { toast } from 'sonner';
import { userApi } from '../../lib/api';
import { AddEmployee } from './AddEmployee';
import { EmployeeDetailsView } from './EmployeeDetailsView';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';

export const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewingEmpId, setViewingEmpId] = useState<number | null>(null);
  const [editingEmpId, setEditingEmpId] = useState<number | null>(null);
  
  // Route Modal States
  const [selectedRouteEmp, setSelectedRouteEmp] = useState<any>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const result = await userApi.getAllUsers();
      if (result && result.data) {
        const mappedData = result.data.map((user: any) => ({
          id: user.id,
          name: user.fullName || user.name || 'N/A',
          empId: user.username || `EMP-${user.id}`,
          designation: user.designation || 'Staff',
          email: user.email || 'N/A',
          phone: user.mobileNumber || user.phoneNumber || 'N/A',
          status: user.status?.toLowerCase() || 'active',
          joiningDate: user.joiningDate || user.createdAt || new Date().toISOString(),
          salaryType: 'monthly',
          baseRate: user.salary || 0,
          role: user.role || 'employee',
          attendanceId: user.attendanceId || 0
        }));
        setEmployees(mappedData);
      }
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoute = async (emp: any) => {
    setSelectedRouteEmp(emp);
    setIsRouteLoading(true);
    setRoutePath([]);
    try {
      const token = localStorage.getItem('userToken');
      const attendanceId = 9;
      // Updated to use RequestParams as per backend change
      const response = await fetch(`/api/location/route?employeeId=${emp.id}&attendanceId=${attendanceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result && result.data && Array.isArray(result.data)) {
        const latlngs = result.data.map((p: any) => [p.latitude, p.longitude] as [number, number]);
        setRoutePath(latlngs);
      }
    } catch (error) {
      toast.error('Could not fetch route');
    } finally {
      setIsRouteLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (isAdding || editingEmpId) {
    return <AddEmployee 
      onBack={() => { setIsAdding(false); setEditingEmpId(null); }} 
      onSuccess={() => { setIsAdding(false); setEditingEmpId(null); fetchEmployees(); }} 
      employeeId={editingEmpId}
    />;
  }

  if (viewingEmpId) {
    return <EmployeeDetailsView employeeId={viewingEmpId} onBack={() => setViewingEmpId(null)} />;
  }

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.empId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 custom-scrollbar">
      {/* Header controls... (omitted for brevity but kept in file) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search employees by name or ID..." 
            className="pl-10 h-12 bg-white border-slate-200 shadow-sm rounded-xl focus-visible:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchEmployees} className="h-12 w-12 rounded-xl border-slate-200 bg-white shadow-sm hover:text-primary transition-all">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          <Button onClick={() => setIsAdding(true)} className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg transition-all active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 bg-white overflow-hidden relative">
        {isLoading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center"><div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-200">
                <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Employee Name</TableHead>
                <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Contact</TableHead>
                <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Status</TableHead>
                <TableHead className="h-12 px-6 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Join Date</TableHead>
                <TableHead className="h-12 px-6 text-right text-[11px] font-bold uppercase text-slate-500 tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} className="group hover:bg-slate-50/80 border-b border-slate-50 transition-all">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm leading-none mb-1">{emp.name}</p>
                        <p className="text-[10px] font-medium text-slate-500">ID: <span className="text-primary font-bold">{emp.empId}</span> • {emp.designation}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1 text-[11px] font-medium text-slate-500">
                      <div className="flex items-center gap-2 group-hover:text-slate-900 transition-colors"><Mail className="w-3 h-3 text-slate-300" /> {emp.email}</div>
                      <div className="flex items-center gap-2 group-hover:text-slate-900 transition-colors"><Phone className="w-3 h-3 text-slate-300" /> {emp.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", emp.status === 'active' ? "bg-emerald-500" : "bg-slate-300")} />
                      <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 text-[8px] font-black uppercase italic border transition-all", emp.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100')}>{emp.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4"><p className="text-[10px] font-bold text-slate-400 italic">[{new Date(emp.joiningDate).toLocaleDateString()}]</p></TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 transition-opacity">
                      <Button onClick={() => setViewingEmpId(Number(emp.id))} title="View Details" variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-primary shadow-sm"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button onClick={() => setEditingEmpId(Number(emp.id))} title="Edit Employee" variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-primary shadow-sm"><Edit2 className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:text-red-500 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Route History Modal */}
      <Dialog open={!!selectedRouteEmp} onOpenChange={() => setSelectedRouteEmp(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <div className="h-[500px] w-full relative">
            {isRouteLoading ? (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Route Data...</p>
              </div>
            ) : (
              <MapContainer 
                center={routePath.length > 0 ? routePath[0] : [28.6139, 77.2090]} 
                zoom={14} 
                className="h-full w-full z-10"
              >
                <TileLayer 
                  attribution="&copy; Google Maps"
                  url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
                {routePath.length > 0 && (
                  <>
                    <Polyline positions={routePath} color="#B2001A" weight={5} opacity={0.7} />
                    <Marker position={routePath[0]} />
                    <Marker position={routePath[routePath.length - 1]} />
                  </>
                )}
              </MapContainer>
            )}
            
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <div className="bg-white/90 backdrop-blur px-5 py-4 rounded-2xl shadow-xl border border-white pointer-events-auto">
                <h2 className="text-sm font-bold text-slate-900 leading-none mb-1">{selectedRouteEmp?.name}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Route History • {selectedRouteEmp?.empId}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};



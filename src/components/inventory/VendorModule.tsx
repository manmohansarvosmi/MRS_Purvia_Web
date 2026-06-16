import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, Mail, Phone, MapPin, MoreVertical, Loader2, Save, X, Building2, Trash2, Edit2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { vendorApi } from '@/src/lib/api';
import { toast } from 'sonner';

export const VendorModule = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    phoneNumber: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await vendorApi.getAllVendors();
      if (res.status === 1) setVendors(res.data);
    } catch {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor: any) => {
    setEditingId(vendor.id);
    setFormData({
      vendorName: vendor.vendorName || '',
      contactPerson: vendor.contactPerson || '',
      phoneNumber: vendor.phoneNumber || '',
      email: vendor.email || '',
      address: vendor.address || '',
      gstNumber: vendor.gstNumber || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      const res = await vendorApi.deleteVendor(id);
      if (res.status === 1) {
        toast.success("Vendor deleted successfully");
        fetchVendors();
      }
    } catch {
      toast.error("Failed to delete vendor");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      let res;
      if (editingId) {
        res = await vendorApi.updateVendor(editingId, formData);
      } else {
        res = await vendorApi.saveVendor(formData);
      }

      if (res.status === 1) {
        toast.success(editingId ? "Vendor updated successfully" : "Vendor added successfully");
        closeModal();
        fetchVendors();
      }
    } catch {
      toast.error("Failed to save vendor");
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ vendorName: '', contactPerson: '', phoneNumber: '', email: '', address: '', gstNumber: '' });
  };

  const filteredVendors = vendors.filter(v => 
    v.vendorName?.toLowerCase().includes(search.toLowerCase()) || 
    v.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
    v.phoneNumber?.includes(search)
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white animate-fade-in font-['Poppins']">
      
      {/* ── Page Header ── */}
      <div className="h-[42px] px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-[5px] flex items-center justify-center shadow-lg">
             <Users size={14} className="text-white" />
          </div>
          <div>
             <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">Vendor Master</h2>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Industrial Supply Chain Partners</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="relative group">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="SEARCH VENDOR..." 
                className="h-7 pl-9 pr-4 bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-800 placeholder:text-slate-300 rounded-[5px] outline-none w-64 focus:bg-white focus:border-slate-300 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <button onClick={() => setShowModal(true)} className="h-7 px-4 bg-[#C8102E] text-white text-[9px] font-black uppercase tracking-widest rounded-[5px] flex items-center gap-2 hover:bg-[#B00E26] transition-all shadow-lg shadow-red-900/10">
              <Plus size={12} strokeWidth={3} /> Add New Vendor
           </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-auto custom-scrollbar p-1">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-10 text-center">#</th>
              <th>Vendor Details</th>
              <th>Commercial Reference</th>
              <th>Contact Node</th>
              <th>Logistics Address</th>
              <th className="w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Loader2 size={24} className="animate-spin" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">Synchronizing Vendor Database...</p>
                  </div>
                </td>
              </tr>
            ) : filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-10">
                    <Users size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Active Vendors Found</p>
                  </div>
                </td>
              </tr>
            ) : filteredVendors.map((v, idx) => (
              <tr key={v.id} className="group">
                <td className="text-center font-mono text-[9px] text-slate-400">{idx + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[5px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-[#C8102E] group-hover:bg-[#C8102E]/5 transition-all outline outline-1 outline-slate-100">
                      <Building2 size={14} />
                    </div>
                    <div>
                      <p className="text-[10.5px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{v.vendorName}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Person: {v.contactPerson || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9.5px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-[3px] border border-slate-200 inline-block w-fit font-mono">
                      {v.gstNumber || 'NO-GST'}
                    </span>
                    <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Verified Vendor</span>
                  </div>
                </td>
                <td>
                  <div className="space-y-1 text-[9px] font-bold text-slate-600">
                    <div className="flex items-center gap-2"><Phone size={10} className="text-slate-300" /> {v.phoneNumber || 'NO PHONE'}</div>
                    <div className="flex items-center gap-2 max-w-[150px] truncate"><Mail size={10} className="text-slate-300" /> {v.email || 'NO EMAIL'}</div>
                  </div>
                </td>
                <td>
                  <div className="flex items-start gap-2 max-w-[200px]">
                    <MapPin size={10} className="text-slate-300 mt-0.5 shrink-0" />
                    <span className="text-[9px] font-bold text-slate-500 line-clamp-2 leading-relaxed uppercase">{v.address || 'NO ADDRESS SPECIFIED'}</span>
                  </div>
                </td>
                <td>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(v)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className="h-[32px] px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none">
          VENDOR REGISTRY — {filteredVendors.length} ACTIVE ENTITIES
        </p>
        <div className="flex items-center gap-4">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[7.5px] font-black text-emerald-600 uppercase tracking-widest leading-none">Database Sync 100% OK</span>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-[400px] rounded-[5px] shadow-2xl border border-white/20 overflow-hidden transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="h-[42px] px-4 bg-slate-900 flex items-center justify-between border-b border-white/10">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#C8102E] rounded-[2px] flex items-center justify-center">
                    {editingId ? <Edit2 size={11} className="text-white" strokeWidth={3} /> : <Plus size={11} className="text-white" strokeWidth={3} />}
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                    {editingId ? 'Edit Vendor Details' : 'New Vendor Entry'}
                  </h3>
               </div>
               <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                 <X size={16} />
               </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                    <label className="erp-label">Vendor Entity Name</label>
                    <input 
                      required
                      className="erp-input h-8 px-2 font-bold focus:border-[#C8102E] transition-all"
                      value={formData.vendorName}
                      onChange={e => setFormData({...formData, vendorName: e.target.value})}
                      placeholder="ENTER LEGAL NAME..."
                    />
                 </div>
                 <div>
                    <label className="erp-label">Contact Person</label>
                    <input 
                      className="erp-input h-8 px-2 font-bold"
                      value={formData.contactPerson}
                      onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="NAME..."
                    />
                 </div>
                 <div>
                    <label className="erp-label">GST Number</label>
                    <input 
                      className="erp-input h-8 px-2 font-bold uppercase"
                      value={formData.gstNumber}
                      onChange={e => setFormData({...formData, gstNumber: e.target.value})}
                      placeholder="00XXXXX0000X0Z0"
                    />
                 </div>
                 <div>
                    <label className="erp-label">Phone Node</label>
                    <input 
                      className="erp-input h-8 px-2 font-bold"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="+91..."
                    />
                 </div>
                 <div>
                    <label className="erp-label">Email Node</label>
                    <input 
                      type="email"
                      className="erp-input h-8 px-2 font-bold"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="INFO@VENDOR.COM"
                    />
                 </div>
                 <div className="col-span-2">
                    <label className="erp-label">Service/Logistics Address</label>
                    <textarea 
                      className="erp-input h-16 p-2 font-bold resize-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="ENTER FULL ADDRESS..."
                    />
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                 <button type="button" onClick={closeModal} className="flex-1 h-9 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-[5px] hover:bg-slate-200 transition-all">Cancel</button>
                 <button 
                   type="submit" 
                   disabled={isSaving}
                   className="flex-1 h-9 bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-widest rounded-[5px] flex items-center justify-center gap-2 hover:bg-[#B00E26] transition-all shadow-lg shadow-red-900/20"
                 >
                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Commit Entry</>}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

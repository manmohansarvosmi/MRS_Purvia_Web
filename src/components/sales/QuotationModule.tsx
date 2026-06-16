import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileText,
  ArrowRight,
  Download,
  Clock,
  Loader2,
  Package,
  Building2,
  Share2,
  Mail,
  MessageCircle,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/lib/utils';
import { salesApi } from '@/src/lib/api';
import api from '@/src/lib/api';
import { EstimateForm } from './EstimateForm';

interface QuotationModuleProps {
  onConvertToInvoice?: (estimate: any) => void;
  onCreateNew?: () => void;
}

// ── Toast Notification ────────────────────────────────────────────────────────
const Toast: React.FC<{ message: string; type: 'success' | 'warn' | 'error'; onDone: () => void }> = ({
  message, type, onDone,
}) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-[11px] font-bold',
        'animate-[slideUp_0.2s_ease]',
        type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
        type === 'warn'    ? 'bg-amber-50 text-amber-800 border-amber-200' :
                             'bg-red-50 text-red-700 border-red-200'
      )}
      style={{ animation: 'slideUp 0.2s ease' }}
    >
      {type === 'success' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
      {message}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Share Popover ─────────────────────────────────────────────────────────────
interface SharePopoverProps {
  q: any;
  onClose: () => void;
  onShare: (platform: 'email' | 'gmail' | 'whatsapp') => void;
  sharing: boolean;
}

// Minimal brand icons (16×16)
const EmailIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
    <rect width="16" height="16" rx="3" fill="#64748b"/>
    <path d="M3 5.5l5 3.5 5-3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
    <rect x="3" y="5" width="10" height="7" rx="1" stroke="white" strokeWidth="1.2" fill="none"/>
  </svg>
);
const GmailIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
    <rect width="16" height="16" rx="3" fill="#EA4335"/>
    <path d="M3 5.5L8 9l5-3.5V12H3V5.5Z" fill="white" opacity="0.9"/>
    <path d="M3 5.5L8 9l5-3.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
    <rect width="16" height="16" rx="3" fill="#25D366"/>
    <path d="M8 2.5A5.5 5.5 0 002.5 8a5.47 5.47 0 00.83 2.9L2.5 13.5l2.7-.77A5.5 5.5 0 108 2.5z" fill="white" opacity="0.95"/>
    <path d="M6.2 5.5c-.15 0-.4.05-.6.28C5.4 6 4.7 6.7 4.7 8s.95 2.4 1.08 2.56c.14.18 1.87 2.94 4.58 4 .3.12 1.07.35 1.27-.22.18-.58.18-1.08.13-1.18-.06-.1-.23-.17-.48-.3s-1.47-.72-1.7-.8c-.22-.08-.38-.12-.55.12-.17.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-.24-.73.12-1.24-.65-1.38-.88-.15-.24-.02-.38.1-.5.11-.11.25-.29.36-.43.12-.14.16-.24.24-.4.08-.17.04-.31-.02-.43-.07-.12-.55-1.33-.76-1.82z" fill="#25D366"/>
  </svg>
);

const SharePopover: React.FC<SharePopoverProps> = ({ q, onClose, onShare, sharing }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const platforms = [
    { id: 'email'    as const, label: 'Email',    Icon: EmailIcon    },
    { id: 'gmail'    as const, label: 'Gmail',    Icon: GmailIcon    },
    { id: 'whatsapp' as const, label: 'WhatsApp', Icon: WhatsAppIcon },
  ];

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 bg-white rounded-lg border border-slate-200 overflow-hidden"
      style={{ minWidth: 148, boxShadow: '0 4px 14px rgba(0,0,0,0.09)', animation: 'spFade 0.1s ease' }}
    >
      {/* header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Share PDF</span>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors ml-3">
          <X size={10} />
        </button>
      </div>

      {/* rows */}
      {platforms.map((p, i) => (
        <button
          key={p.id}
          disabled={sharing}
          onClick={() => onShare(p.id)}
          className={cn(
            'w-full flex items-center gap-2 px-2.5 py-[7px] text-left hover:bg-slate-50 transition-colors',
            i < platforms.length - 1 && 'border-b border-slate-100/70',
            sharing && 'opacity-40 cursor-not-allowed'
          )}
        >
          {sharing
            ? <Loader2 size={12} className="text-slate-400 animate-spin shrink-0" />
            : <p.Icon />}
          <span className="text-[10px] font-semibold text-slate-700">{p.label}</span>
        </button>
      ))}

      <style>{`
        @keyframes spFade {
          from { opacity:0; transform:translateY(-3px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const QuotationModule: React.FC<QuotationModuleProps> = ({ onConvertToInvoice, onCreateNew }) => {
  const [isAdding, setIsAdding]         = useState(false);
  const [quotations, setQuotations]     = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [shareOpenId, setShareOpenId]   = useState<number | null>(null);
  const [sharingId, setSharingId]       = useState<number | null>(null);
  const [toast, setToast]               = useState<{ message: string; type: 'success' | 'warn' | 'error' } | null>(null);

  useEffect(() => { fetchQuotations(); }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await salesApi.getAllEstimates();
      if (response.status === 1) setQuotations(response.data);
    } catch (e) {
      console.error('Error fetching quotations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (q: any) => {
    try {
      setDownloadingId(q.id);
      await salesApi.downloadEstimatePdf(
        q.id,
        q.estimateNumber || `EST-${q.id.toString().padStart(4, '0')}`
      );
    } catch (e) {
      console.error('PDF download failed:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  /**
   * Fetch the real PDF blob → try Web Share API (attaches actual file).
   * Fallback: download PDF locally + open platform compose window.
   */
  const handleShare = async (q: any, platform: 'email' | 'gmail' | 'whatsapp') => {
    const estimateLabel = q.estimateNumber || `EST-${q.id.toString().padStart(4, '0')}`;
    const fileName      = `Estimate_${estimateLabel}.pdf`;
    const token         = localStorage.getItem('userToken');

    setSharingId(q.id);
    setShareOpenId(null);

    try {
      // ① Fetch actual PDF blob from backend
      const response = await api.get(`/pdf/estimate/${q.id}`, {
        responseType: 'blob',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const blob    = new Blob([response.data], { type: 'application/pdf' });
      const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

      // ② Try Web Share API with file (works on mobile + modern Chrome desktop)
      const canShareFile =
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [pdfFile] });

      if (canShareFile) {
        await navigator.share({
          files: [pdfFile],
          title: `Estimate ${estimateLabel}`,
          text: `Dear ${q.customerName},\n\nPlease find your estimate ${estimateLabel} for ₹${(q.totalAmount || 0).toLocaleString()} attached.\n\nThank you for your business!`,
        });
        setToast({ message: 'PDF shared successfully!', type: 'success' });
        return;
      }

      // ③ Fallback — download PDF + open platform compose window
      // Download the file first
      const blobUrl = window.URL.createObjectURL(blob);
      const a       = document.createElement('a');
      a.href        = blobUrl;
      a.download    = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      // Build message text for platform
      const subject = `Estimate ${estimateLabel} — ${q.customerName}`;
      const bodyText =
        `Dear ${q.customerName},\n\nPlease find your estimate ${estimateLabel} attached.\n\nTotal Amount: ₹${(q.totalAmount || 0).toLocaleString()}\n\nThank you for your business!`;

      let platformUrl = '';
      if (platform === 'email') {
        platformUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      } else if (platform === 'gmail') {
        platformUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      } else {
        // WhatsApp
        const waText = `Hi ${q.customerName}, your estimate *${estimateLabel}* for ₹${(q.totalAmount || 0).toLocaleString()} is ready.\n\nPlease check the PDF downloaded to your device.`;
        platformUrl  = `https://wa.me/?text=${encodeURIComponent(waText)}`;
      }

      window.open(platformUrl, '_blank');
      setToast({ message: 'PDF downloaded — please attach it manually to the compose window.', type: 'warn' });

    } catch (err: any) {
      if (err?.name === 'AbortError') {
        // User cancelled native share sheet — not an error
        return;
      }
      console.error('Share failed:', err);
      setToast({ message: 'Failed to fetch PDF. Please try again.', type: 'error' });
    } finally {
      setSharingId(null);
    }
  };

  if (isAdding) {
    return <EstimateForm onCancel={() => { setIsAdding(false); fetchQuotations(); }} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}

      {/* ── Page Header ── */}
      <div className="page-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-primary/10 rounded-lg w-8 h-8 shadow-sm">
            <FileText size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Proposals &amp; Estimations</h2>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">Active Quotation Ledger</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="search-bar w-64">
            <Search className="text-slate-400" size={12} />
            <input
              type="text"
              placeholder="Search ID, customer or status..."
              className="bg-transparent border-none outline-none text-[10.5px] w-full font-medium"
            />
          </div>
          <button className="btn-secondary h-8 px-4 text-[9.5px] rounded-[5px]">
            <Filter size={11} /> Filters
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="btn-primary h-8 px-5 text-[9.5px] rounded-[5px] shadow-lg shadow-primary/20"
          >
            <Plus size={14} /> Create Quotation
          </button>
        </div>
      </div>

      {/* ── Summary Matrix ── */}
      <div className="flex items-center gap-10 px-6 py-3 shrink-0 bg-slate-50/50 border-b border-slate-200">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Live Pipeline</p>
          <p className="text-[14px] font-black text-slate-900">
            {quotations.length} <span className="text-[9px] text-slate-400 font-bold uppercase">Estimates</span>
          </p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Conversion Potential</p>
          <p className="text-[14px] font-black text-slate-900">
            ₹{quotations.reduce((acc, q) => acc + (q.totalAmount || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Sync Active</span>
        </div>
      </div>

      {/* ── Table Grid ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="w-[160px]">Quotation ID</th>
              <th>Customer/Client Matrix</th>
              <th className="w-[120px]">Assets Case</th>
              <th className="w-[160px] text-right">Aggregate Sum</th>
              <th className="w-[140px]">Validity Edge</th>
              <th className="w-[120px] text-center">Status</th>
              <th className="w-[130px] text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Calibrating Records...</span>
                  </div>
                </td>
              </tr>
            ) : quotations.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <FileText size={32} />
                    <p className="text-[11px] font-black uppercase tracking-widest">No active proposals found</p>
                  </div>
                </td>
              </tr>
            ) : quotations.map((q) => (
              <tr key={q.id} className="group">
                <td className="font-mono text-[10px] font-black text-primary italic">
                  {q.estimateNumber || `EST-${q.id.toString().padStart(4, '0')}`}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Building2 size={12} />
                    </div>
                    <div>
                      <p className="text-[10.5px] font-black text-slate-900 uppercase tracking-tight">{q.customerName}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.05em] mt-0.5">Primary Commercial Entity</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <Package size={11} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-600">Standard SKUs</span>
                  </div>
                </td>
                <td className="text-right">
                  <span className="text-[12px] font-black text-slate-900 italic tracking-tighter">
                    ₹{q.totalAmount?.toLocaleString()}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px]">
                    <Clock size={11} className="text-slate-300" />
                    {q.expiryDate ? format(new Date(q.expiryDate), 'dd MMM y') : 'Open Ended'}
                  </div>
                </td>
                <td className="text-center">
                  <span className={cn(
                    'badge inline-flex items-center justify-center px-2 py-0.5 text-[8px] font-black uppercase tracking-widest min-w-[80px] rounded-[3px]',
                    q.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    q.status === 'PENDING' || q.status === 'DRAFT' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-red-50 text-red-600 border border-red-100'
                  )}>{q.status}</span>
                </td>

                {/* ── Actions ── */}
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">

                    {/* Download PDF */}
                    <button
                      onClick={() => handleDownloadPdf(q)}
                      disabled={downloadingId === q.id || sharingId === q.id}
                      title="Download PDF"
                      className="w-7 h-7 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-[5px] hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {downloadingId === q.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Download size={12} strokeWidth={2.5} />}
                    </button>

                    {/* Share — opens popover */}
                    <div className="relative">
                      <button
                        onClick={() => setShareOpenId(shareOpenId === q.id ? null : q.id)}
                        disabled={sharingId === q.id}
                        title="Share Estimate"
                        className={cn(
                          'w-7 h-7 flex items-center justify-center rounded-[5px] transition-all shadow-sm',
                          sharingId === q.id
                            ? 'bg-violet-600 text-white cursor-wait'
                            : shareOpenId === q.id
                              ? 'bg-violet-600 text-white'
                              : 'bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white'
                        )}
                      >
                        {sharingId === q.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Share2 size={12} strokeWidth={2.5} />}
                      </button>

                      {shareOpenId === q.id && (
                        <SharePopover
                          q={q}
                          onClose={() => setShareOpenId(null)}
                          onShare={(platform) => handleShare(q, platform)}
                          sharing={sharingId === q.id}
                        />
                      )}
                    </div>

                    {/* Convert to Invoice */}
                    {q.status === 'PENDING' && onConvertToInvoice && (
                      <button
                        onClick={() => onConvertToInvoice(q)}
                        title="Convert to Invoice"
                        className="w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-[5px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <ArrowRight size={12} strokeWidth={3} />
                      </button>
                    )}

                    {/* More */}
                    <button className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical size={14} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer Pagination ── */}
      <div className="h-[42px] px-6 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Records Registry — 1-{quotations.length} of {quotations.length} Active Nodes
        </p>
        <div className="flex items-center gap-1.5">
          {['Previous', '1', 'Next'].map(p => (
            <button
              key={p}
              className={cn(
                'h-6 px-3 text-[9px] font-black uppercase tracking-tighter rounded-[5px] transition-all',
                p === '1' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              )}
            >{p}</button>
          ))}
        </div>
      </div>

    </div>
  );
};

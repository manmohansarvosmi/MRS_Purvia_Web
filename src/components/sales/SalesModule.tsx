import React from 'react';
import { GSTInvoiceForm, EstimateSource } from './GSTInvoiceForm';
import { CRMModule } from '../crm/CRMModule';
import { QuotationModule } from './QuotationModule';
import { SalesHistory } from './SalesHistory';
import { POSModule } from './POSModule';
import { cn } from '@/src/lib/utils';
import {
  FileText,
  Users,
  History,
  Zap,
  Receipt,
} from 'lucide-react';
import { motion } from 'motion/react';

export const SalesModule = ({ initialSubTab = 'pos' }: { initialSubTab?: string }) => {
  const [subTab, setSubTab] = React.useState(initialSubTab);
  const [isQuotationCreation, setIsQuotationCreation] = React.useState(false);
  // When an estimate is converted → store its data, open billing tab
  const [pendingEstimate, setPendingEstimate] = React.useState<EstimateSource | null>(null);

  React.useEffect(() => {
    setSubTab(initialSubTab);
    setIsQuotationCreation(false);
  }, [initialSubTab]);

  // Called from QuotationModule "Convert to Invoice" button
  const handleConvertToInvoice = (estimate: EstimateSource) => {
    setPendingEstimate(estimate);
    setIsQuotationCreation(false);
    setSubTab('billing');
  };

  // Clear pending estimate when user manually switches away from billing
  const handleTabChange = (tab: string) => {
    if (tab !== 'billing') setPendingEstimate(null);
    setIsQuotationCreation(false);
    setSubTab(tab);
  };

  const renderContent = () => {
    if (isQuotationCreation) {
      return (
        <GSTInvoiceForm 
          isQuotation={true} 
          onSuccess={() => { setIsQuotationCreation(false); setSubTab('quotations'); }} 
        />
      );
    }

    switch (subTab) {
      case 'pos':
        return <POSModule />;
      case 'billing':
        return <GSTInvoiceForm fromEstimate={pendingEstimate ?? undefined} onSuccess={() => { setPendingEstimate(null); setSubTab('sales-logs'); }} />;
      case 'customers':
        return <CRMModule />;
      case 'quotations':
        return <QuotationModule onConvertToInvoice={handleConvertToInvoice} onCreateNew={() => setIsQuotationCreation(true)} />;
      case 'sales-logs':
        return <SalesHistory />;
      default:
        return <POSModule />;
    }
  };

  const tabs = [
    { id: 'pos',        label: 'Retail POS',   icon: Zap      },
    { id: 'billing',    label: 'Tax Invoicing', icon: FileText },
    { id: 'customers',  label: 'Customers',    icon: Users    },
    { id: 'quotations', label: 'Estimates',    icon: Receipt  },
    { id: 'sales-logs', label: 'Sales Logs',   icon: History  },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
      <div className="px-8 bg-white border-b border-slate-100 flex items-center gap-10 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] py-5 transition-all relative group",
              subTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon className={cn(
              "w-4 h-4 transition-colors",
              subTab === tab.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500"
            )} />
            {tab.label}
            {/* badge when billing has prefilled estimate */}
            {tab.id === 'billing' && pendingEstimate && (
              <span className="ml-1 bg-primary text-white text-[7px] font-black px-1.5 py-0.5 uppercase tracking-widest">
                FROM EST
              </span>
            )}
            {subTab === tab.id && (
              <motion.div
                layoutId="active-sales-subtab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(178,0,26,0.3)]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

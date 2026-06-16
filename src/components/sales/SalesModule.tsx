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
      <div className="h-[42px] px-6 bg-white border-b border-slate-200 flex items-center gap-6 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(tab => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "h-full flex items-center gap-2.5 px-1 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-wider transition-all relative group",
                isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "flex items-center justify-center p-1 rounded-md transition-all duration-300",
                isActive ? "bg-primary/5 shadow-[0_0_0_1px_rgba(200,16,46,0.1)]" : "group-hover:bg-slate-50"
              )}>
                <tab.icon className={cn(
                  "w-3.5 h-3.5 transition-colors", 
                  isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-500"
                )} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className="relative">
                {tab.label}
                {tab.id === 'billing' && pendingEstimate && (
                  <span className="absolute -top-3 -right-6 bg-primary text-white text-[6px] font-black px-1 rounded-sm shadow-sm">EST</span>
                )}
              </span>

              {isActive && (
                <motion.div 
                  layoutId="active-sales-tab-indicator" 
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(200,16,46,0.3)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

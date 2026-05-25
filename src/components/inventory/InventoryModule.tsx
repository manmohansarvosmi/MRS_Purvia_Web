import React from 'react';
import { ProductMaster } from './ProductMaster';
import { InventoryLogs } from './InventoryLogs';
import { WarehouseUnits } from './WarehouseUnits';
import { StockAdjustment } from './StockAdjustment';
import { PurchaseModule } from './PurchaseModule';
import { cn } from '@/lib/utils';
import { 
  Box, 
  History, 
  Warehouse, 
  Settings2,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'motion/react';

export const InventoryModule = ({ initialSubTab = 'items' }: { initialSubTab?: string }) => {
  const [subTab, setSubTab] = React.useState(initialSubTab);

  React.useEffect(() => {
    setSubTab(initialSubTab);
  }, [initialSubTab]);

  const renderInventoryContent = () => {
    switch (subTab) {
      case 'items':
        return <ProductMaster />;
      case 'purchases':
        return <PurchaseModule />;
      case 'movement':
        return <InventoryLogs />;
      case 'warehouses':
        return <WarehouseUnits />;
      case 'adjustments':
        return <StockAdjustment />;
      default:
        return <ProductMaster />;
    }
  };

  const tabs = [
    { id: 'items', label: 'Stock Master', icon: Box },
    { id: 'purchases', label: 'Purchases / PO', icon: ShoppingCart },
    { id: 'movement', label: 'Movement Logs', icon: History },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { id: 'adjustments', label: 'Adjustments', icon: Settings2 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100/40">
      {/* Module Header Bar */}
      <div className="px-8 bg-white border-b border-slate-200 flex items-center gap-6 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-widest py-3 target-tab transition-all relative group",
              subTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon className={cn(
              "w-4 h-4 transition-colors", 
              subTab === tab.id ? "text-primary" : "text-slate-300 group-hover:text-slate-500"
            )} />
            {tab.label}
            {subTab === tab.id && (
              <motion.div 
                layoutId="active-inv-tab" 
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(178,0,26,0.3)]" 
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderInventoryContent()}
      </div>
    </div>
  );
};

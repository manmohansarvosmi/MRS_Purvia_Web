import React from 'react';
import { ProductMaster } from './ProductMaster';
import { InventoryLogs } from './InventoryLogs';
import { WarehouseUnits } from './WarehouseUnits';
import { StockAdjustment } from './StockAdjustment';
import { PurchaseModule } from './PurchaseModule';
import { cn } from '@/src/lib/utils';
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
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F8FAFC' }}>
      <div className="h-[42px] px-6 bg-white border-b border-slate-200 flex items-center gap-6 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(tab => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
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
              </span>

              {isActive && (
                <motion.div 
                  layoutId="active-tab-indicator" 
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary rounded-t-full shadow-[0_-1px_4px_rgba(200,16,46,0.3)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderInventoryContent()}
      </div>
    </div>
  );
};

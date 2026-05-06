import React from 'react';
import { ProductList } from './ProductList';
import { SalesInvoices } from './SalesInvoices';
import { ReturnsLogs } from './ReturnsLogs';

export const InventoryModule = ({ activeTab }: { activeTab: string }) => {
  switch (activeTab) {
    case 'inventory':
      return <ProductList />;
    case 'sales':
      return <SalesInvoices />;
    case 'returns':
      return <ReturnsLogs />;
    default:
      return <ProductList />;
  }
};

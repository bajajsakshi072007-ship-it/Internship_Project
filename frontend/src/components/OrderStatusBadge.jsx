import React from 'react';
import { Clock, RefreshCw, Truck, CheckCircle2, XCircle } from 'lucide-react';

export default function OrderStatusBadge({ status }) {
  const configs = {
    Pending: {
      label: 'Pending Confirmation',
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Clock
    },
    Processing: {
      label: 'Crafting & Packing',
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: RefreshCw
    },
    Shipped: {
      label: 'Dispatched / In Transit',
      bg: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Truck
    },
    Delivered: {
      label: 'Delivered',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2
    },
    Cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: XCircle
    }
  };

  const conf = configs[status] || configs.Pending;
  const IconComponent = conf.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${conf.bg}`}>
      <IconComponent className="w-3.5 h-3.5" />
      {conf.label}
    </span>
  );
}

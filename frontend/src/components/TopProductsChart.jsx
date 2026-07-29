import React from 'react';
import { Award, ShoppingBag } from 'lucide-react';

export default function TopProductsChart({ products = [] }) {
  // Default top products dataset if empty
  const defaultTopProducts = [
    { name: 'Handcrafted Terracotta Clay Vessel', sales: 18, revenue: 11700 },
    { name: 'Authentic Chanderi Silk Saree', sales: 12, revenue: 40800 },
    { name: 'Madhubani Hand-Painted Wall Art', sales: 9, revenue: 16200 },
    { name: 'Tribal Dhokra Brass Elephant', sales: 7, revenue: 8400 }
  ];

  const displayList = products.length > 0 ? products : defaultTopProducts;
  const maxRevenue = Math.max(...displayList.map((p) => p.revenue), 1000);

  return (
    <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <span className="p-2 bg-amber-100 rounded-xl text-terracotta-600">
          <Award className="w-4 h-4" />
        </span>
        <div>
          <h3 className="font-serif font-bold text-stone-900 text-lg">Top-Selling Crafts</h3>
          <p className="text-xs text-stone-500 mt-0.5">Best performing items by revenue</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {displayList.map((item, idx) => {
          const percent = Math.min(100, Math.round((item.revenue / maxRevenue) * 100));
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <div className="flex items-center gap-2 truncate max-w-[70%]">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    idx === 0 ? 'bg-amber-400 text-stone-900' :
                    idx === 1 ? 'bg-stone-300 text-stone-900' :
                    idx === 2 ? 'bg-amber-700 text-white' :
                    'bg-amber-100 text-stone-700'
                  }`}>
                    #{idx + 1}
                  </span>
                  <span className="truncate">{item.name || item.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-terracotta-600 font-extrabold block">₹{item.revenue?.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-stone-400 font-medium">{item.sales} units sold</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-amber-50 h-2.5 rounded-full overflow-hidden border border-amber-200/60">
                <div
                  className="bg-gradient-to-r from-amber-400 to-terracotta-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

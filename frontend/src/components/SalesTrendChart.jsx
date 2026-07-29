import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export default function SalesTrendChart({ data = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Default monthly trend dataset if empty
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 2100 },
    { month: 'Mar', revenue: 1800 },
    { month: 'Apr', revenue: 3400 },
    { month: 'May', revenue: 2900 },
    { month: 'Jun', revenue: 4850 }
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000);
  const width = 500;
  const height = 180;
  const padding = 35;

  const getX = (index) => padding + (index * (width - 2 * padding)) / (chartData.length - 1 || 1);
  const getY = (value) => height - padding - (value / maxRevenue) * (height - 2 * padding);

  // Construct SVG smooth line path
  const points = chartData.map((d, i) => `${getX(i)},${getY(d.revenue)}`).join(' ');
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="bg-white border border-amber-200 p-6 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 rounded-xl text-terracotta-600">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Sales Revenue Trend</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">Monthly earnings timeline (₹ INR)</p>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>Last 6 Months</span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c85a32" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#c85a32" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - 2 * padding);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f3e8d7"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#revenueGradient)" />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="#c85a32"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data points */}
          {chartData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.revenue);
            const isHovered = hoveredPoint === i;

            return (
              <g key={i} className="cursor-pointer">
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 4}
                  fill="#ffffff"
                  stroke="#c85a32"
                  strokeWidth="3"
                  className="transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                
                {/* X Axis Label */}
                <text
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-stone-500 select-none"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint !== null && (
          <div
            className="absolute p-2 bg-stone-900 text-white text-[11px] font-bold rounded-xl shadow-lg -translate-x-1/2 pointer-events-none transition-all z-10"
            style={{
              left: `${(getX(hoveredPoint) / width) * 100}%`,
              top: `${(getY(chartData[hoveredPoint].revenue) / height) * 100 - 35}%`
            }}
          >
            <div>{chartData[hoveredPoint].month}</div>
            <div className="text-amber-400">₹{chartData[hoveredPoint].revenue.toLocaleString('en-IN')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react'

/**
 * StatsCard — Dashboard KPI card
 */
const StatsCard = ({ title, value, icon, color = 'primary', subtitle, trend }) => {
  const colorMap = {
    primary:  { bg: 'bg-primary-50',   icon: 'bg-primary-100 text-primary-600',   text: 'text-primary-600' },
    success:  { bg: 'bg-green-50',     icon: 'bg-green-100 text-green-600',        text: 'text-green-600' },
    warning:  { bg: 'bg-yellow-50',    icon: 'bg-yellow-100 text-yellow-600',      text: 'text-yellow-600' },
    danger:   { bg: 'bg-red-50',       icon: 'bg-red-100 text-red-600',            text: 'text-red-600' },
    info:     { bg: 'bg-blue-50',      icon: 'bg-blue-100 text-blue-600',          text: 'text-blue-600' },
    accent:   { bg: 'bg-accent-50',    icon: 'bg-accent-100 text-accent-600',      text: 'text-accent-600' },
  }

  const colors = colorMap[color] || colorMap.primary

  return (
    <div className={`card p-5 ${colors.bg} border-0`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${colors.text}`}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}% from last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard

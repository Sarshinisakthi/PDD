import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: 'normal' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
  gradient: string;
  iconBg: string;
}

const statusConfig = {
  normal: { badge: 'vital-badge-normal', label: 'Normal', dot: 'bg-green-500' },
  warning: { badge: 'vital-badge-warning', label: 'Warning', dot: 'bg-yellow-500' },
  danger:  { badge: 'vital-badge-danger',  label: 'Critical', dot: 'bg-red-500' },
};

const VitalCard: React.FC<VitalCardProps> = ({ title, value, unit, icon: Icon, status, trend, gradient, iconBg }) => {
  const cfg = statusConfig[status];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up'
    ? 'text-red-500'
    : trend === 'down'
    ? 'text-blue-500'
    : 'text-slate-400';

  return (
    <div className="glass-card p-6 animate-slide-up group hover:scale-[1.02] transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
            {cfg.label}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </span>
          <span className="text-sm font-medium text-slate-400">{unit}</span>
        </div>
      </div>

      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={14} />
          <span>{trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'Stable'} from last reading</span>
        </div>
      )}
    </div>
  );
};

export default VitalCard;

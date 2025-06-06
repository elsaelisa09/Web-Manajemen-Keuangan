
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InteractiveSummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: number;
  color: string;
  emoji?: string;
  subtitle?: string;
  progress?: number;
  maxAmount?: number;
}

const InteractiveSummaryCard: React.FC<InteractiveSummaryCardProps> = ({ 
  title, 
  amount, 
  icon: Icon, 
  trend, 
  color, 
  emoji,
  subtitle,
  progress,
  maxAmount
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getProgressPercentage = () => {
    if (progress !== undefined && maxAmount) {
      return Math.min((progress / maxAmount) * 100, 100);
    }
    return 0;
  };

  return (
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-fade-in group cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-purple-300">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-bl-full opacity-50"></div>
        
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {title}
              </p>
              {emoji && <span className="text-lg animate-bounce">{emoji}</span>}
            </div>
            
            <div className="space-y-2">
              <p className="text-3xl font-black leading-none transition-colors duration-300" style={{ color }}>
                {formatCurrency(amount)}
              </p>
              
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
            
            {progress !== undefined && maxAmount && (
              <div className="space-y-2">
                <Progress value={getProgressPercentage()} className="h-2" />
                <p className="text-xs text-gray-500 font-medium">
                  {formatCurrency(progress)} dari {formatCurrency(maxAmount)}
                </p>
              </div>
            )}
            
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend > 0 ? '↗️ +' : '↘️ '}{Math.abs(trend)}%
                </span>
                <span className="text-xs text-gray-500">vs bulan lalu</span>
              </div>
            )}
          </div>
          
          <div 
            className="flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-125" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveSummaryCard;

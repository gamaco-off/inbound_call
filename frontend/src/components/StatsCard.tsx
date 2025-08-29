import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  color 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary-600 border-primary-200';
      case 'success':
        return 'bg-success-50 text-success-600 border-success-200';
      case 'warning':
        return 'bg-warning-50 text-warning-600 border-warning-200';
      case 'error':
        return 'bg-error-50 text-error-600 border-error-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
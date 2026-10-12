import React from 'react';
import Card from './Card';

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number; // Positive or negative change
  trendLabel?: string;
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle,
  icon,
  trend,
  trendLabel
}) => {
  const hasTrend = trend !== undefined;
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {hasTrend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <span>{trendLabel || (trend > 0 ? `${trend}% increase` : `${Math.abs(trend)}% decrease`)}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
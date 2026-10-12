import React from 'react';
import Card from './Card';
import Badge from './Badge';

type KpiCardProps = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
};

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  change,
  changeType = 'positive',
  icon,
  trend
}) => {
  const trendIcon = trend === 'up' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1 flex items-baseline">
            <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
            {change && (
              <span className={`ml-2 flex items-center text-sm ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendIcon}
                <span className="ml-1">{change}</span>
              </span>
            )}
          </div>
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

export default KpiCard;
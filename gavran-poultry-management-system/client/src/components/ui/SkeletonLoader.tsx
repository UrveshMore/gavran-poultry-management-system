import React from 'react';

type SkeletonLoaderProps = {
  className?: string;
  height?: string;
  width?: string;
  borderRadius?: string;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full', 
  borderRadius = 'rounded-lg' 
}) => {
  return (
    <div className={`animate-pulse bg-gray-200 ${height} ${width} ${borderRadius} ${className}`}></div>
  );
};

export default SkeletonLoader;
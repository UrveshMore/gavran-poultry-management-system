import React from 'react';
import Button from './Button';

type EmptyStateProps = {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
};

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description,
  buttonText,
  onButtonClick,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      
      {description && (
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
      )}
      
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick}>{buttonText}</Button>
      )}
    </div>
  );
};

export default EmptyState;
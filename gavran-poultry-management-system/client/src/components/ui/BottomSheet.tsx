import React, { useEffect } from 'react';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  title,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* This element is to trick the browser into centering the modal contents */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-t-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md">
          {/* Handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
          )}
          
          <div className="p-6 max-h-96 overflow-y-auto">
            {children}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={onClose}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
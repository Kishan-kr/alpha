import React from 'react';
import { Check } from 'lucide-react';
import { ORDER_TIMELINE_STAGES } from '../../constants/orderTimeline';

export default function OrderStatusTimeline({ currentStatus }) {
  const currentIndex = ORDER_TIMELINE_STAGES.findIndex(s => s.key === currentStatus);

  return (
    <div className="flex items-start justify-between w-full relative">
      {ORDER_TIMELINE_STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        const showLeftLine = index !== 0;
        const showRightLine = index !== ORDER_TIMELINE_STAGES.length - 1;

        return (
          <div key={stage.key} className="relative flex flex-col items-center flex-1">
            {/* Left line (except first) */}
            {showLeftLine && (
              <div className={`absolute left-0 top-2.5 h-0.5 w-1/2 z-0
                ${isCompleted || isCurrent ? 'bg-pigment-green' : 'bg-gray-700'}`} />
            )}

            {/* Right line (except last) */}
            {showRightLine && (
              <div className={`absolute right-0 top-2.5 h-0.5 w-1/2 z-0
                ${index <= currentIndex ? 'bg-pigment-green' : 'bg-gray-700'}`} />
            )}

            {/* Circle with icon or dot */}
            <div className={`relative z-10 w-6 h-6 flex items-center justify-center rounded-full
              ${isCompleted || isCurrent ? 'bg-pigment-green text-black' :
                'border-2 border-gray-600 text-gray-600 bg-black'}`}>
              {isCompleted || isCurrent ? <Check size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
            </div>

            {/* Label */}
            <span className={`mt-2 text-xs text-center 
              ${isCompleted || isCurrent ? 'text-pigment-green' : 'text-gray-500'}`}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
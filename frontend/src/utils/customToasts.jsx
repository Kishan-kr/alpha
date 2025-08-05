// utils/toastBagMessage.js
import toast from "react-hot-toast";
import { CircleX, X } from "lucide-react"; // or your icon system
import React from "react";

export const showBagSuccessToast = (msg, position = 'top-right') => {
  toast.custom((t) => (
    <span className='relative bg-dark text-light px-2 py-2 ps-3 text-xs font-light flex gap-x-4 items-center'>
      {msg}
      <button className='cursor-pointer p-1' onClick={() => toast.dismiss(t.id)}>
        <X strokeWidth={1} className='w-5 h-5' />
      </button>
    </span>
  ), {
    icon: null,
    position: position,
    style: { padding: '4px 0' },
    duration: 3000,
  });
};

export const showBagErrorToast = (msg, position = 'top-right') => {
  toast.custom((t) => (
    <span className='relative bg-dark text-red-200 text-xs px-2 py-2 ps-3 font-light flex gap-x-4 items-center'>
      {msg}
      <button className='cursor-pointer p-1' onClick={() => toast.dismiss(t.id)}>
        <X strokeWidth={1} className='w-5 h-5' />
      </button>
    </span>
  ), {
    icon: null,
    position: position,
    duration: 4000,
  });
};

export const showErrorToastWithIcon = (msg, position = 'top-center') => {
  toast.custom((t) => (
    <div className="relative bg-dark flex gap-x-3 items-center px-3 py-3">
      <CircleX strokeWidth={1} className='w-6 h-6 min-w-6 text-red-400' />
      <span className='max-w-2xl text-light text-xs font-light flex gap-x-4 items-center'>
        {msg}
        <button className='cursor-pointer p-1' onClick={() => toast.dismiss(t.id)}>
          <X strokeWidth={1} className='w-5 h-5' />
        </button>
      </span>
    </div>
  ), {
    icon: null,
    position: position,
    duration: 4000,
  });
};

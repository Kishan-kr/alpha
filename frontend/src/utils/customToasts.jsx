// utils/toastBagMessage.js
import toast from "react-hot-toast";
import { X } from "lucide-react"; // or your icon system
import React from "react";

export const showBagSuccessToast = (msg) => {
  toast.custom((t) => (
    <span className='relative bg-dark text-light px-2 py-2 ps-3 text-xs font-light flex gap-x-4 items-center'>
      {msg}
      <button className='cursor-pointer p-1' onClick={() => toast.dismiss(t.id)}>
        <X strokeWidth={1} className='w-5 h-5' />
      </button>
    </span>
  ), {
    icon: null,
    position: 'top-right',
    style: { padding: '4px 0' },
    duration: 3000,
  });
};

export const showBagErrorToast = (msg) => {
  toast.custom((t) => (
    <span className='relative bg-dark text-red-200 text-xs px-2 py-2 ps-3 font-light flex gap-x-4 items-center'>
      {msg}
      <button className='cursor-pointer p-1' onClick={() => toast.dismiss(t.id)}>
        <X strokeWidth={1} className='w-5 h-5' />
      </button>
    </span>
  ), {
    icon: null,
    position: 'top-right',
    duration: 4000,
  });
};
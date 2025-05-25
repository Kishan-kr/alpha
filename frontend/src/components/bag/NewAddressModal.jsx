import React from 'react';
import AddressForm from './AddressForm';
import { X } from 'lucide-react';

const NewAddressModal = ({ isOpen, onClose, onSave, formData, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overscroll-y-auto bg-black/60 flex items-center justify-center z-50">
      <div className="bg-dark p-6 my-8 rounded-lg w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-subtext text-xl hover:text-light cursor-pointer"
        >
          <X className='w-6 h-6'/>
        </button>
        <h2 className="text-white mb-4 text-lg font-semibold">Add New Address</h2>
        <AddressForm
          formData={formData}
          onChange={onChange}
          onSubmit={onSave}
          buttonText="Save and Continue"
        />
      </div>
    </div>
  );
};

export default NewAddressModal;
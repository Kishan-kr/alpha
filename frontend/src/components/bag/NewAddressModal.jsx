import React from 'react';
import AddressForm from './AddressForm';
import { X } from 'lucide-react';

const NewAddressModal = ({ isOpen, onClose, onSave, formData, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface/90 backdrop-blur-[2px] flex justify-center overflow-y-auto sm:py-16">
      <div className="relative bg-light p-6 rounded-lg w-full h-max max-w-3xl shadow-2xl shadow-dark">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-subtext text-xl hover:text-dark cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-dark mb-4 text-lg font-semibold">Add New Address</h2>
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
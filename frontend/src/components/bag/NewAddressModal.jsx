import React from 'react';
import AddressForm from './AddressForm';
import { X } from 'lucide-react';

const NewAddressModal = ({ isOpen, onClose, onSave, formData, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-light/80 flex items-center justify-center">
      <div className="bg-light p-6 sm:p-10 w-full max-w-3xl relative border border-hover-tint">
        {/* Close */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-subtext hover:text-dark enabled:cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
        <h2 className="text-lg uppercase text-dark tracking-wide font-light mb-2">Add New Address</h2>
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
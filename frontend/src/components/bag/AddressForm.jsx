import React from 'react';

const AddressForm = ({ formData, onChange, onSubmit, buttonText = "Save and Continue" }) => {
  return (
    <form className="rounded-md py-3 w-full max-w-3xl space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className='w-full'>
          <label className="block text-subtext mb-1 text-sm">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            required
            className="bg-surface text-white px-4 py-2 rounded w-full"
          />
        </div>

        {/* phone */}
        <div className='w-full'>
          <label className="block text-subtext mb-1 text-sm">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            required
            className="bg-surface text-white px-4 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* address line  */}
      <div className='w-full'>
        <label className="block text-subtext mb-1 text-sm">Address Line (e.g., house no, street)</label>
        <input
          type="text"
          name="addressLine"
          value={formData.addressLine}
          onChange={onChange}
          required
          className="bg-surface text-white px-4 py-2 rounded w-full"
        />
      </div>

      {/* Landmark  */}
      <div className='w-full'>
        <label className="block text-subtext text-sm">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={onChange}
          className="bg-surface text-white px-4 py-2 rounded w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Pincode  */}
        <div className='w-full'>
          <label className="block text-subtext mb-1 text-sm">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={onChange}
            required
            className="bg-surface text-white px-4 py-2 rounded w-full"
          />
        </div>

        {/* City */}
        <div className='w-full'>
          <label className="block text-subtext mb-1 text-sm">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            required
            className="bg-surface text-white px-4 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* State */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className='w-full'>
          <label className="block text-subtext mb-1 text-sm">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={onChange}
            required
            className="bg-surface text-white px-4 py-2 rounded w-full"
          />
        </div>

        {/* Country */}
        <div className='w-full'>
          <label className="block text-subtext mb-1 text-sm">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country || "India"}
            onChange={onChange}
            required
            className="bg-surface text-white px-4 py-2 rounded w-full"
          />
        </div>
      </div>

      <button type="submit" className="w-full sm:w-fit bg-white text-black font-medium py-2 px-4 mt-4 rounded hover:bg-gray-200 enabled:cursor-pointer">
        {buttonText}
      </button>
    </form>
  );
};

export default AddressForm;
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// dummy data of user 
const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  addresses: [
    {
      addressLine: '123 MG Road',
      landmark: 'Near Gandhi Maidan',
      city: 'North Delhi',
      state: 'Delhi',
      pincode: '110006',
      country: 'India',
    },
  ],
}

export default function UserProfile() {
  const [userData, setUserData] = useState(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const showModal = searchParams.get('mod') === 'true';

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...userData.addresses];
    updatedAddresses[index][field] = value;
    setUserData(prev => ({ ...prev, addresses: updatedAddresses }));
  };

  const handleAddAddress = () => {
    setUserData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          addressLine: '',
          landmark: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        },
      ],
    }));
  };

  const handleRemoveAddress = (index) => {
    if (userData.addresses.length === 1) return;
    const updatedAddresses = userData.addresses.filter((_, i) => i !== index);
    setUserData(prev => ({ ...prev, addresses: updatedAddresses }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(userData);
  };

  const handleEmailClick = () => {
    setSearchParams({ mod: 'true' });
  };

  const updateEmail = (newEmail) => {
    setUserData({ ...userData, email: newEmail });
  };

  const closeModal = () => {
    searchParams.delete('mod');
    setSearchParams(searchParams);
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl mx-auto px-4 py-20 md:px-8 md:py-24 text-light">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-subtext mb-1">First Name</label>
          <input
            value={userData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full p-2 bg-surface border border-border rounded-md"
          />
        </div>
        <div>
          <label className="block text-subtext mb-1">Last Name</label>
          <input
            value={userData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full p-2 bg-surface border border-border rounded-md"
          />
        </div>
        <div>
          <label className="block text-subtext mb-1">Email</label>
          <input
            type="email"
            defaultValue={userData.email}
            onClick={handleEmailClick}
            // onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-2 bg-surface border border-border rounded-md"
          />
          <p className="text-xs text-subtext mt-1">* Email change will require OTP verification</p>
        </div>
        <div>
          <label className="block text-subtext mb-1">Phone</label>
          <input
            value={userData.phone}
            disabled
            className="w-full p-2 bg-accent border border-border rounded-md text-subtext"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button
          onClick={handleAddAddress}
          type='button'
          disabled={userData?.addresses?.length >= 3}
          className="flex items-center gap-2 text-sm bg-accent hover:bg-hover-tint text-light px-3 py-1 rounded disabled:bg-hover-tint disabled:text-subtext enabled:cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      <div className="space-y-6">
        {userData.addresses.map((addr, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-4 relative">
            {userData?.addresses?.length > 1 && (
              <button
                onClick={() => handleRemoveAddress(index)}
                type='button'
                className="absolute top-2 right-2 text-subtext hover:text-light enabled:cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-subtext text-sm">Address Line</label>
                <textarea
                  required

                  value={addr.addressLine}
                  onChange={(e) => handleAddressChange(index, 'addressLine', e.target.value)}
                  className="w-full p-2 bg-dark border border-border rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-subtext text-sm">Landmark</label>
                <input
                  value={addr.landmark}
                  onChange={(e) => handleAddressChange(index, 'landmark', e.target.value)}
                  className="w-full p-2 bg-dark border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block text-subtext text-sm">City</label>
                <input
                  required
                  value={addr.city}
                  onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                  className="w-full p-2 bg-dark border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block text-subtext text-sm">State</label>
                <input
                  required
                  value={addr.state}
                  onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                  className="w-full p-2 bg-dark border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block text-subtext text-sm">Pincode</label>
                <input
                  required
                  value={addr.pincode}
                  onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                  className="w-full p-2 bg-dark border border-border rounded-md"
                />
              </div>
              <div>
                <label className="block text-subtext text-sm">Country</label>
                <select
                  required
                  value={addr.country}
                  onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                  className="w-full p-2 bg-dark border border-border rounded-md"
                >
                  <option value="India">India</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          type='submit'
          className="bg-light  text-dark px-6 py-2 rounded font-semibold hover:bg-light/80  transition cursor-pointer uppercase"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOADING } from '../../constants/appConstants';
import { ArrowLeft, LoaderCircle, Plus } from 'lucide-react';
import { updateAllAddresses } from '../../store/actions/userAction';
import { showErrorToastWithIcon } from '../../utils/customToasts';
import toast from 'react-hot-toast';

export default function EditAddress() {
  const navigate = useNavigate();
  const { userInfo, status, updateStatus } = useSelector((state) => state.user);

  // Local copy of addresses to allow editing before saving
  const [addresses, setAddresses] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo?.addresses?.length > 0) {
      setAddresses(userInfo.addresses);
    } else {
      // At least one empty address form
      setAddresses([
        {
          fullName: '',
          phone: '',
          line1: '',
          line2: '',
          landmark: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India',
          isDefault: true, // First address can be default
        },
      ]);
    }
  }, [userInfo]);

  const handleAddressChange = (index, field, value) => {
    setAddresses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        fullName: '',
        phone: '',
        line1: '',
        line2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false,
      },
    ]);
  };

  const handleRemoveAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetDefault = (index) => {
    setAddresses((prev) =>
      prev.map((addr, i) => ({
        ...addr,
        isDefault: i === index,
      }))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateAllAddresses(addresses));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Your addresses has been updated successfully');
      navigate(-1);
    } else {
      const errPayload = result.payload || 'Failed to update the addresses';

      if (errPayload && typeof errPayload === 'object' && !Array.isArray(errPayload)) {
        // Multiple field errors → show each in a separate toast
        Object.values(errPayload).forEach(msg => {
          showErrorToastWithIcon(msg);
        });
      } else {
        // Single error message
        showErrorToastWithIcon(errPayload);
      }
    }
  };

  const isLoading = status === LOADING;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24 mt-8">
        <LoaderCircle className="animate-spin w-6 h-6 text-subtext" />
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-20 md:pt-28 md:px-8 md:py-24 text-dark">
      {/* Top bar with Back button */}
      <div className="flex items-center justify-start sm:justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-light uppercase text-dark"
        >
          <ArrowLeft strokeWidth={1} size={16} className='inline' />
          <span className='md:inline hidden '>Back</span>
        </button>
        <h1 className="text-lg ms-1 sm:ms-0 uppercase font-gfs-didot text-dark">
          Edit Addresses
        </h1>
        <button
          type="button"
          onClick={handleAddAddress}
          disabled={addresses.length >= 3}
          className="ms-auto sm:ms-0 flex items-center gap-2 text-xs uppercase border border-hover-tint enabled:hover:bg-surface text-dark px-3 py-1 disabled:text-hover-tint enabled:cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="bg-light border border-hover-tint p-6 relative shadow-sm"
          >
            {/* Remove button */}
            {addresses.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAddress(index)}
                className="absolute top-3 right-3 text-subtext hover:text-dark"
              >
                ✕
              </button>
            )}

            {/* Address form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name (Optional) */}
              <div>
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Full Name <span className="text-subtext lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={addr.fullName || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'fullName', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint focus:outline-none focus:outline-2 focus:outline-blue-500"
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Contact Number <span className="text-subtext lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={addr.phone || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'phone', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                  maxLength={10}
                />
              </div>

              {/* Address Line */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Address Line 1
                </label>
                <textarea
                  required
                  value={addr.line1}
                  onChange={(e) =>
                    handleAddressChange(index, 'line1', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                />
              </div>

              {/* Address Line 2 (optional) */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Address Line 2 <span className="text-subtext lowercase">(optional)</span>
                </label>
                <textarea
                  required
                  value={addr.line2}
                  onChange={(e) =>
                    handleAddressChange(index, 'line2', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                />
              </div>

              {/* Landmark */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Landmark <span className="text-subtext lowercase">(optional)</span>
                </label>
                <input
                  value={addr.landmark}
                  onChange={(e) =>
                    handleAddressChange(index, 'landmark', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  City
                </label>
                <input
                  required
                  value={addr.city}
                  onChange={(e) =>
                    handleAddressChange(index, 'city', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  State
                </label>
                <input
                  required
                  value={addr.state}
                  onChange={(e) =>
                    handleAddressChange(index, 'state', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Pincode
                </label>
                <input
                  required
                  value={addr.pincode}
                  maxLength={6}
                  onChange={(e) =>
                    handleAddressChange(index, 'pincode', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs uppercase text-subtext mb-1.5">
                  Country
                </label>
                <select
                  required
                  value={addr.country}
                  onChange={(e) =>
                    handleAddressChange(index, 'country', e.target.value)
                  }
                  className="w-full py-3 px-3 bg-light border border-hover-tint"
                >
                  <option value="India">India</option>
                </select>
              </div>
            </div>

            {/* Default address toggle */}
            <div className="mt-6">
              <label className="inline-flex items-center gap-2 text-sm text-dark">
                <input
                  type="checkbox"
                  checked={addr.isDefault || false}
                  onChange={() => handleSetDefault(index)}
                  className="accent-dark"
                />
                Set as Default Address
              </label>
            </div>
          </div>
        ))}

        {/* Save button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={updateStatus === LOADING}
            className="text-sm uppercase flex items-center justify-center px-6 py-2 bg-dark text-light cursor-pointer"
          >
            {updateStatus === LOADING ? <span className='animate-spin'><LoaderCircle className='w-5 h-5' /></span> : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
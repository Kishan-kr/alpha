import React from 'react';

const SavedAddresses = ({ addresses, selectedId, onSelect, handleNewAddress }) => {
  const nearby = (landmark) => {
    if (!landmark) return ''

    let firstWord = landmark.split(' ')[0].toLowerCase();
    if (['near', 'nearby'].includes(firstWord)) {
      return landmark;
    }
    return `Near ${landmark}`;
  }

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-dark">Saved Addresses</h3>
      <label htmlFor="" className='text-subtext text-sm block mb-6 -mt-1'>Select one of the saved addresses</label>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          onClick={() => onSelect(addr.id)}
          className={`relative cursor-pointer px-5 py-4 rounded-lg border transition-all duration-200 shadow-sm ${selectedId === addr.id
              ? 'bg-green-900/30 border-green-600 ring-1 ring-green-500'
              : 'bg-light border-light/10 hover:border-light/20 hover:bg-dark/5'
            }`}
        >
          {/* Top Row: Address + Default */}
          <div className="flex justify-between items-start mb-2">
            <div className="text-dark font-semibold text-sm">
              {addr.addressLine}, {nearby(addr.landmark)}
            </div>
            {addr.isDefault && (
              <span className="text-xs font-semibold text-light bg-[#5DB7DE] px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>

          {/* Second Row: City/State/Pincode/Country */}
          <div className="text-sm text-dark/80 flex flex-wrap gap-x-2 gap-y-1">
            <div>{addr.city}, {addr.state} - {addr.pincode}</div>
            <div className="bg-dark/10 text-dark px-2 py-0.5 rounded">{addr.country}</div>
          </div>
        </div>
      ))}

      <div>
        <p className='text-center text-sm text-subtext mt-4'>OR</p>
      </div>
      <button onClick={handleNewAddress} className='w-full cursor-pointer px-4 py-4 mt-4 rounded-md text-sm text-dark text-center border-2 border-dashed border-border hover:border-light/20 hover:bg-dark/5'>
        Deliver to new address
      </button>
    </div>
  );
};

export default SavedAddresses;
import React from 'react';

const SavedAddresses = ({ addresses, selectedId, onSelect, handleNewAddress }) => {
  const nearby = (landmark) => {
    if(!landmark) return ''

    let firstWord = landmark.split(' ')[0].toLowerCase();
    if(['near', 'nearby'].includes(firstWord)) {
      return landmark;
    }
    return `near ${landmark}`;
  }

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-white">Saved Addresses</h3>
      <label htmlFor="" className='text-subtext text-sm block mb-6 -mt-1'>Select one of the saved addresses</label>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={`relative cursor-pointer px-4 py-3 rounded-md text-sm text-white border ${
            selectedId === addr.id ? 'bg-green-950/50 border-green-700' : 'bg-surface border-light/10'
          }`}
          onClick={() => onSelect(addr.id)}
        >
          <div>{addr.addressLine}, {nearby(addr.landmark)}</div>
          <div>{`${addr.city}, ${addr.state} - ${addr.pincode}`}</div>
          <div>{addr.country}</div>

          {/* label to show default mark  */}
          {addr.isDefault && (<span className='absolute top-1 right-1 text-xs text-dark bg-[#5DB7DE] rounded p-1 py-px'>Default</span>)}
        </div>
      ))}

      <div>
      <p className='text-center text-subtext mt-4'>OR</p>
      </div>
      <button onClick={handleNewAddress} className='w-full cursor-pointer px-4 py-4 mt-4 rounded-md text-sm text-white text-center border-2 border-dashed border-border'>
        Deliver to new address
      </button>
    </div>
  );
};

export default SavedAddresses;
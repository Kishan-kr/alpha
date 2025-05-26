import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddressForm from './AddressForm';
import SavedAddresses from './SavedAddresses';
import NewAddressModal from './NewAddressModal';
import BackButton from './BackButton';

const DeliverySection = ({ handleNext, handleBack }) => {
  const user = useSelector((state) => state.user); // Assuming `userSlice`
  const { isLoggedIn } = user;
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || null);
  const [showModal, setShowModal] = useState(false);

  const defaultForm = {
    fullName: user?.firstName + " " + user?.lastName || '',
    phone: user?.phone || '',
    line: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (showModal)
      document.body.classList.add('overflow-y-hidden')

    return () => {
      document.body.classList.remove('overflow-y-hidden')
    }
  }, [showModal])


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();

    // API call to save the address 

    // add the new address to existing saved array 
    const newAddress = {
      ...formData,
      id: Date.now().toString(),
    };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowModal(false);
    setFormData(defaultForm);

    // go to next step [payment]
    handleNext()
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const address = isLoggedIn
      ? addresses.find((addr) => addr.id === selectedAddressId)
      : formData;
    console.log('Final Selected Address:', address);
    // You can dispatch or save it further
    handleNext()
  };

  return (
    <div className="p-4 mt-2 sm:mt-0 md:p-10 flex justify-center">
      <div className="w-full max-w-3xl bg-dark sm:p-6 p-4 rounded-lg border border-border">
        <div className='flex gap-x-2'>
          <BackButton handleClick={handleBack} className='-mt-px' />
          <h2 className="text-white text-2xl mb-4">Delivery Address</h2>
        </div>

        {!isLoggedIn ? (
          <AddressForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleFinalSubmit}
          />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <input
                type="text"
                value={defaultForm.fullName}
                disabled
                className="bg-surface text-white px-4 py-2 rounded w-full"
              />
              {/* phone */}
              <div className='flex items-center bg-surface text-white px-4 rounded w-full focus-within:ring'>
                <span>+91</span>
                <input
                  type="text"
                  name="phone"
                  value={defaultForm.phone}
                  disabled
                  required
                  className="bg-surface ps-1 pe-3 py-3 h-full rounded outline-none w-full"
                />
              </div>
            </div>

            <fieldset className=''>

              <SavedAddresses
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                handleNewAddress={() => setShowModal(true)}
              />
            </fieldset>

            <button
              onClick={handleFinalSubmit}
              className="w-full sm:w-fit bg-white text-black font-medium mt-8 py-2 px-4 rounded hover:bg-gray-200 enabled:cursor-pointer"
            >
              Save and Continue
            </button>
          </>
        )}

        <NewAddressModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddAddress}
          formData={formData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default DeliverySection;
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Address = ({handleNext}) => {
  const user = useSelector((state) => state.user);
  const [showNewForm, setShowNewForm] = useState(user.isLoggedIn ? false : true);
  const [selectedAddress, setSelectedAddress] = useState(null);


  return (
    <form action="">
      <div>address form here</div>
      <button onClick={handleNext} className='text-light font-medium rounded border'>Save and Continue</button>
    </form>
  );
};

export default Address;
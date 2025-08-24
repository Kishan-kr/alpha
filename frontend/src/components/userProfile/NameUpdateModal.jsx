import React, { useEffect, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { showErrorToastWithIcon } from '../../utils/customToasts';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/actions/userAction';
import toast from 'react-hot-toast';
import { LOADING } from '../../constants/appConstants';

export default function NameUpdateModal({ firstName: initialFirstName, lastName: initialLastName, onClose }) {
  const [firstName, setFirstName] = useState(initialFirstName || '');
  const [lastName, setLastName] = useState(initialLastName || '');
  const { updateStatus } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "h-screen");

    return () => {
      document.body.classList.remove("overflow-hidden", "h-screen");
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      showErrorToastWithIcon('First name is required.');
      return;
    }
    // api call to update name 
    const result = await dispatch(updateUser({ firstName: firstName.trim(), lastName: lastName.trim() }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Your name has been updated successfully');
      onClose();
    } else {
      const errMsg = result.payload || 'Failed to update the name';
      showErrorToastWithIcon(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-light/80 flex items-center justify-center">
      <form onSubmit={handleSave} className="bg-light p-6 sm:p-10 w-full max-w-lg relative border border-hover-tint animate-fade-in">

        {/* Close Button */}
        <button
          onClick={onClose}
          type='button'
          className="absolute top-4 right-4 text-subtext hover:text-dark enabled:cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-lg uppercase text-dark tracking-wide font-light mb-3">Update Name</h2>
        <p className="text-xs text-subtext font-light mb-10">Enter your first and last name below</p>

        {/* First Name Input */}
        <input
          type="text"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 mb-4 border border-border outline-none focus:ring-2 focus:ring-light"
          placeholder="First Name"
          autoFocus
        />

        {/* Last Name Input */}
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 mb-6 border border-border outline-none focus:ring-2 focus:ring-light"
          placeholder="Last Name"
        />

        {/* Save Button */}
        <button
          disabled={updateStatus === LOADING}
          className="bg-dark flex items-center justify-center uppercase font-light text-sm text-light w-full py-3 enabled:cursor-pointer"
        >
          {updateStatus === LOADING ? <span className='animate-spin'><LoaderCircle className='w-5 h-5' /></span> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
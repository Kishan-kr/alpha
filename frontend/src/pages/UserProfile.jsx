import React from 'react';
import { LoaderCircle } from 'lucide-react';
import EmailUpdateModal from '../components/userProfile/EmailUpdateModal';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING } from '../constants/appConstants';
import NameUpdateModal from '../components/userProfile/NameUpdateModal';
import { logout } from '../store/actions/userAction';
import { showErrorToastWithIcon } from '../utils/customToasts';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { userInfo: userData, status, logoutStatus } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const showEmailModal = searchParams.get('mod') === 'email';
  const showNameModal = searchParams.get('mod') === 'name';

  const handleEmailEdit = () => {
    setSearchParams({ mod: 'email' });
  };

  const handleNameEdit = () => {
    setSearchParams({ mod: 'name' });
  };

  const handleLogout = async () => {
    const result = await dispatch(logout());
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("You have been logged out");
      navigate("/login");
    }
    else if(result.meta.requestStatus === "rejected"){
      showErrorToastWithIcon("Failed to logout");
    }
  };

  const closeModal = () => {
    searchParams.delete('mod');
    setSearchParams(searchParams);
  };

  const isLoading = status === LOADING;

  const nearby = (landmark) => {
    if (!landmark) return ''

    let firstWord = landmark.split(' ')[0].toLowerCase();
    if (['near', 'nearby'].includes(firstWord)) {
      return landmark;
    }
    return `Near ${landmark}`;
  }

  const loadingScreen = (
    <div className="flex justify-center py-24 mt-8">
      <p className='text-xs tracking-wider font-light uppercase animate-spin'><LoaderCircle /></p>
    </div>
  )

  return (
    <section className="max-w-4xl mx-auto px-4 py-20 pt- md:pt-28 md:px-8 md:py-24 text-dark">
      <h1 className="text-xl uppercase font-gfs-didot text-dark mb-6">My Profile</h1>

      {isLoading ?
        loadingScreen :
        <>
          {/* first name and last name  */}
          <div className="relative p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 mb-9 border border-hover-tint">
            <div>
              <label className="block text-xxs uppercase mb-4 text-hover-tint">First Name</label>
              <p className='text-dark text-sm font-light'>{userData?.firstName}</p>
            </div>
            <div>
              <label className="block text-xxs uppercase text-hover-tint mb-4">Last Name</label>
              <p className='text-dark text-sm font-light'>{userData?.lastName}</p>
            </div>

            <button onClick={handleNameEdit} className='absolute md:static top-6 right-6 h-fit uppercase font-light underline text-xs text-dark cursor-pointer'>Edit</button>
          </div>

          {/* Phone and Email  */}
          <div className='relative p-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-x-6 gap-y-9 mb-9 border border-hover-tint'>
            <div>
              <label className="block text-xxs uppercase text-hover-tint mb-4">Phone</label>
              <p className='text-dark text-sm font-light bg-surface px-2 py-2'>{userData?.phone}</p>
              <p className="text-xs text-subtext font-light mt-4">Phone number cannot be edited</p>
            </div>

            {/* email */}
            <div>
              <label className="block text-xxs uppercase text-hover-tint mb-4">Email</label>
              <p className='text-dark text-sm font-light bg-surface px-2 py-2'>{userData?.email}</p>
              <p className="text-xs text-subtext font-light mt-4">Email change will require OTP verification</p>
            </div>

            <button onClick={handleEmailEdit} className='absolute md:static top-6 right-6 h-fit uppercase font-light underline text-xs text-dark cursor-pointer'>Edit</button>
          </div>

          {/* Addresses  */}
          <div className="relative sm:p-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 sm:border border-hover-tint">
            <div>
              <p className="text-xs uppercase mb-4 text-subtext">Saved Addresses</p>

              {userData?.addresses?.length > 0 ? (
                <ul className='space-y-4'>
                  {userData.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="bg-surface p-3 sm:p-6 relative"
                    >
                      {/* Top Row: Address + Default */}
                      <div className="flex flex-col gap-2 justify-between items-start mb-2 text-dark font-light text-sm">
                        <p className="">
                          {[addr.fullName, addr.phone && `+91 ${addr.phone}`]
                            .filter(Boolean) // remove empty, null, undefined, or false values
                            .join(', ')}
                        </p>
                        <p>
                          {[addr.line1, addr.line2, nearby(addr.landmark), addr.city]
                            .filter(Boolean) // remove empty, null, undefined, or false values
                            .join(', ')}
                        </p>
                        <p>{addr.state} - {addr.pincode}</p>
                        <p>{addr.country}</p>
                      </div>

                      {addr.isDefault && <span className="absolute -top-3 right-1 border-2 border-light text-xs font-light text-light bg-[#5DB7DE] px-2 py-0.5 rounded-full">
                        Default
                      </span>}
                      {/* Second Row: City/State/Pincode/Country */}
                      <div className="text-sm font-light text-dark flex flex-col flex-wrap gap-x-2 gap-y-2">
                      </div>
                    </div>
                  ))}
                </ul>
              ) : (
                <div className="bg-surface p-6 text-center text-sm font-light text-subtext border border-dashed border-hover-tint">
                  You haven’t saved any addresses yet.
                  <span className="block mt-1">Add one to speed up checkout.</span>
                </div>
              )}
            </div>

            <Link to={'edit-address'} className="absolute sm:static top-0 right-0 h-fit uppercase font-light underline text-xs text-dark cursor-pointer">
              Edit
            </Link>
          </div>

          {/* Logout Button */}
          <div className="mt-12">
            <button
              onClick={handleLogout}
              disabled={logoutStatus === LOADING}
              className="w-full sm:w-[90px] flex items-center justify-center border border-hover-tint text-dark px-5 py-2 uppercase text-xs font-light enabled:hover:bg-surface transition-colors enabled:cursor-pointer disabled:text-hover-tint"
            >
              {logoutStatus === LOADING ? <span className='animate-spin text-subtext'><LoaderCircle className='w-4 h-4' /></span> : "Logout"}
            </button>
          </div>

          {showEmailModal && (
            <EmailUpdateModal
              email={userData?.email}
              onClose={closeModal}
            />
          )}
          {showNameModal && (
            <NameUpdateModal
              firstName={userData?.firstName}
              lastName={userData?.lastName}
              onClose={closeModal}
            />
          )}
        </>}
    </section>
  );
}
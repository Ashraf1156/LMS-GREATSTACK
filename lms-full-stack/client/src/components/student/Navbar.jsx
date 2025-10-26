import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';


const Navbar = () => {

  const location = useLocation();

  const isCoursesListPage = location.pathname.includes('/course-list');

  // Removed getToken and setIsEducator as becomeEducator function is removed
  const { backendUrl, isEducator, navigate } = useContext(AppContext)

  const { openSignIn } = useClerk()
  const { user } = useUser()

  /*
  // --- FUNCTION REMOVED ---
  // This function allowed any user to update their role via the backend
  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
        return;
      }
      const token = await getToken()
      // This backend endpoint should also be removed/disabled
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        toast.success(data.message)
        setIsEducator(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  */

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCoursesListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={() => navigate('/')} src={assets.microsoft_logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" /> {/* Assuming assets.microsoft_logo is your intended logo */}
      <div className="md:flex hidden items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {
            user && <>
              {/* --- BUTTON REMOVED --- */}
              {/* <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> */}
              {/* Show Educator Dashboard link only if user IS an educator */}
              {isEducator && <Link to='/educator'>Educator Dashboard</Link>}
              {/* Conditionally show separator */}
              {isEducator && ' | '}
              <Link to='/my-enrollments' >My Enrollments</Link>
            </>
          }
        </div>
        {user
          ? <UserButton />
          : <button onClick={() => openSignIn()} className="bg-blue-600 text-white px-5 py-2 rounded-full">
            Create Account
          </button>}
      </div>
      {/* For Phone Screens */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {/* --- BUTTON REMOVED --- */}
          {/* <button onClick={becomeEducator}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button> */}
          {/* Show Educator Dashboard link only if user IS an educator */}
          {isEducator && <Link to='/educator'>Educator Dashboard</Link>}
          {/* Conditionally show separator */}
          {isEducator && ' | '}
          {
            user && <Link to='/my-enrollments' >My Enrollments</Link>
          }
        </div>
        {user
          ? <UserButton />
          : <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>}
      </div>
    </div>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Navigation from '../components/Navigation';

import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

import girlCamera from '/girlCamera.jpg';
import boyCamera from '/boyCamera.jpg';
import Photographer3 from '/photographer3.jpg';
import Photographer4 from '/photographer4.jpg';
import Photographer5 from '/photographer5.jpg';
import Navbar from '../components/Navbar';

import 'animate.css'

const SignIn = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  const handleShowErrorMessage = (message) => {
    toast.error(message)
  }

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(data.message));
        handleShowErrorMessage(data.message);
        return;
      } else {
        dispatch(signInSuccess(data));
        if (data.isAdmin) {
          navigate('/admin')
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <Navigation />
      <Navbar />
      <div className='w-full h-screen flex flex-col justify-center items-center'>
        <ToastContainer />
        <div className='w-3/4 h-[500px] rounded-[10px] flex gap-[20px] animate__animated animate__fadeInLeft'>

          <div className='w-1/2 max-md:w-full bg-gray-100 max-md:bg-laptop max-md:bg-cover border border-gray-300 rounded-[10px] text-black max-md:text-white backdrop-blur-sm text-center p-[10px] '>
            <h1 className='text-[20px] font-semibold pb-[30px]'>Welcome to Kaydi Ecommerce</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-[20px] justify-center items-center '>

              <div className='w-3/4 max-md:w-full border border-blue-300 rounded-[20px] flex items-center text-center gap-[10px] p-[5px] '>
                <TfiEmail className='text-gray-400 mx-[10px]' />
                <input onChange={handleChange} id='email' type="email" placeholder='Email' className=' outline-none bg-transparent w-full backdrop-blur-sm ' />
              </div>

              <div className='w-3/4 max-md:w-full border border-blue-300 rounded-[20px] flex justify-between items-center text-center gap-[10px] p-[5px] '>
                <div className='flex items-center'>
                  <RiLockPasswordLine className='text-gray-400 mx-[10px] text-[20px]' />
                  <input onChange={handleChange} id='password' type={showPassword ? 'text' : 'password'} placeholder='Password' className='mx-[10px] outline-none bg-transparent w-full backdrop-blur-sm' />
                </div>
                <button onClick={handleShowPassword} className='mx-[10px]'>
                  {showPassword ? (
                    <FaRegEyeSlash className='text-gray-400' />
                  ) : (
                    <FaRegEye className='text-gray-400' />
                  )}
                </button>
              </div>

              <button type='submit' className='w-3/4 max-md:w-full border-blue-300 border rounded-[20px] p-[5px] bg-blue-300 text-white hover:bg-opacity-70 hover:text-black'>
                Sign In
              </button>

              <hr className='w-3/4 max-md:w-full bg-gray-300 h-[2px]' />

              <button type='submit' className='w-3/4 max-md:w-full border-blue-300 border rounded-[20px] p-[5px] bg-blue-300 text-white hover:bg-opacity-70 hover:text-black'>
                Signin with Google
              </button>

              <div className='text-gray-500 max-md:text-white flex gap-[10px] backdrop-blur-sm'>
                Don't have any account ?
                <Link to='/signUp'>Sign Up</Link>
              </div>

            </form>
          </div>

          <div className='relative max-md:hidden w-1/2 rounded-[10px] bg-laptop bg-cover text-white p-[10px]'>
            <div className='absolute w-[95%] bg-gray-400 bg-opacity-20 rounded-[10px] h-[100px] bottom-[10px] left-1/2 transform -translate-x-1/2 backdrop-blur-sm flex justify-between items-center animated__animated animate__fadeIn '>
              {/* IMAGE */}
              <div className='avatar flex items-center '>
                <div className=' absolute left-[20px] w-[50px] h-[50px] rounded-[50%]'>
                  <img src={girlCamera} alt="" className='w-full h-full rounded-[50%] object-cover' />
                </div>
                <div className=' absolute left-[60px] w-[50px] h-[50px] rounded-[50%]'>
                  <img src={Photographer3} alt="" className='w-full h-full rounded-[50%] object-cover' />
                </div>
                <div className=' absolute left-[100px] w-[50px] h-[50px] rounded-50%'>
                  <img src={boyCamera} alt="" className='w-full h-full rounded-[50%] object-cover' />
                </div>
                <div className=' absolute left-[140px] w-[50px] h-[50px] rounded-50%'>
                  <img src={Photographer4} alt="" className='w-full h-full rounded-[50%] object-cover' />
                </div>
                <div className=' absolute left-[180px] w-[50px] h-[50px] rounded-50%'>
                  <img src={Photographer5} alt="" className='w-full h-full rounded-[50%] object-cover' />
                </div>
              </div>

              {/* TITLE */}
              <div className=''>
                <h2 className=' font-semibold text-[20px]'>Join with 20k+ Users!</h2>
                <p>Let's see our happy customer</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default SignIn
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Navigation from '../components/Navigation';
import Navbar from '../components/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FcAdvance } from "react-icons/fc";
import { TfiEmail } from "react-icons/tfi";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        if (!email || email === "") {
            handleShowErrorMessage("Please enter valid email address");
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/forgotPassword`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            }),
            credentials: 'include',

        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
            return;
        } else {
            toast.success("Reset password link has been sent to your email address. Please check your inbox.");
        }
    }

    return (
        <>
            <Navigation />
            <Navbar />
            <div className='container mx-auto overflow-x-clip'>
                <div className='w-full flex justify-center items-center'>
                    <ToastContainer />
                    <div className='w-[500px] h-[300px] max-md:w-full flex flex-col gap-[20px] border p-[10px] mt-[100px] shadow-xl rounded-[10px] '>
                        <FcAdvance className='text-[40px]' />

                        <div className='flex flex-col gap-[10px]'>
                            <h3 className='text-[16px] font-semibold'>Reset your password</h3>
                            <p className='text-[12px] text-gray-400'>Enter the email address you used to resister with</p>
                        </div>

                        <div className='w-3/4 max-md:w-full border border-blue-300 rounded-[20px] flex items-center text-center gap-[10px] p-[5px] '>
                            <TfiEmail className='text-gray-400 mx-[10px]' />
                            <input onChange={(e) => setEmail(e.target.value)} id='email' type="email" placeholder='Email address' className=' outline-none bg-transparent w-full backdrop-blur-sm ' />
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            <div onClick={() => navigate('/signIn')} className='w-[150px] h-[30px] border rounded-[10px] bg-gray-100 flex justify-center items-center cursor-pointer hover:bg-blue-400 text-blue-500 hover:text-white'>
                                <p className='text-[14px] '>
                                    Back to sign in
                                </p>
                            </div>

                            <div onClick={handleForgotPassword} className='w-[150px] h-[30px] border rounded-[10px] flex justify-center items-center cursor-pointer bg-blue-400 hover:bg-blue-500 text-white hover:text-white'>
                                <p className='text-[14px] '>
                                    Confirm
                                </p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
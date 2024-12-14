import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Navigation from '../components/Navigation';
import Navbar from '../components/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FcAdvance } from "react-icons/fc";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { TfiEmail } from "react-icons/tfi";

const ResetPassword = () => {

    const { resetToken } = useParams();
    console.log(resetToken);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [formData, setFormData] = useState({});
    const [confirmPwd, setConfirmPwd] = useState('');

    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    const handleShowConfirmPwd = (e) => {
        e.preventDefault();
        setShowConfirmPwd(!showConfirmPwd);
    }

    const handleConfirmPwd = (e) => {
        setConfirmPwd(e.target.value);
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPwd) {
            handleShowErrorMessage("Passwords do not match");
            return;
        }
        try {
            const res = await fetch(`/api/auth/resetPassword/${resetToken}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword: formData.password })
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Failed to reset password");
                return;
            }
            toast.success("Password reset successfully! Redirecting...");
            setTimeout(() => navigate('/signIn'), 1000);
        } catch (error) {
            handleShowErrorMessage("An unexpected error occurred");
            console.error(error);
        }
    }


    return (
        <>
            <Navigation />
            <Navbar />
            <div className='w-full flex justify-center items-center'>
                <ToastContainer />
                <div className='w-[500px] h-[300px] max-md:w-full flex flex-col gap-[20px] border shadow-xl p-[10px] mt-[100px] rounded-[10px] '>
                    <FcAdvance className='text-[40px]' />

                    <div className='flex flex-col gap-[10px]'>
                        <h3 className='text-[16px] font-semibold'>Enter your new password</h3>
                        <p className='text-[12px] text-gray-400'>Your new password must be different to previous passwords.</p>
                    </div>

                    <div className='w-3/4 max-md:w-full border border-blue-300 rounded-[20px] flex justify-between items-center text-center gap-[10px] p-[5px] '>
                        <div className='flex items-center'>
                            <RiLockPasswordLine className='text-gray-400 mx-[10px] text-[20px]' />
                            <input onChange={handleChange} type={showPassword ? 'text' : 'password'} required placeholder='Enter new password' id='password' className='mx-[10px] outline-none bg-transparent w-full backdrop-blur-sm' />
                        </div>
                        <button onClick={handleShowPassword} className='mx-[10px]'>
                            {showPassword ? (
                                <FaRegEyeSlash className='text-gray-400' />
                            ) : (
                                <FaRegEye className='text-gray-400' />
                            )}
                        </button>
                    </div>

                    <div className='w-3/4 max-md:w-full border border-blue-300 rounded-[20px] flex justify-between items-center text-center gap-[10px] p-[5px] '>
                        <div className='flex items-center'>
                            <RiLockPasswordLine className='text-gray-400 mx-[10px] text-[20px]' />
                            <input onChange={handleConfirmPwd} type={showConfirmPwd ? 'text' : 'password'} required placeholder='Confirm new password' className='mx-[10px] outline-none bg-transparent w-full backdrop-blur-sm' />
                        </div>
                        <button onClick={handleShowConfirmPwd} className='mx-[10px]'>
                            {showConfirmPwd ? (
                                <FaRegEyeSlash className='text-gray-400' />
                            ) : (
                                <FaRegEye className='text-gray-400' />
                            )}
                        </button>
                    </div>

                    <div onClick={handleResetPassword} className='w-[150px] h-[30px] border rounded-[10px] flex justify-center items-center cursor-pointer bg-blue-400 hover:bg-blue-500 text-white hover:text-white'>
                        <p className='text-[14px] '>
                            Reset password
                        </p>
                    </div>


                </div>



            </div>
        </>
    )
}

export default ResetPassword
import { useState, useEffect, useRef } from 'react'

import Loader from '../../Loader';

import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import { FaSackDollar } from "react-icons/fa6";

const CustomerOrder = ({ order }) => {
    const [userInfo, setUserInfo] = useState(order?.userInfo);

    return (
        <div className='border border-b-[1px] flex flex-col gap-[20px] p-[20px] rounded-[10px] w-full overflow-x-scroll shadow-md animate__animated animate__fadeInUp '>
            <div className='flex max-md:flex-col items-center gap-[40px] max-md:gap-[20px]'>
                <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                    <MdDriveFileRenameOutline className='text-blue-500 text-[18px]' />
                    <p>Name:</p>
                    <p className='text-gray-500'>{userInfo?.username}</p>
                </div>
                <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                    <MdOutlineEmail className='text-red-500 text-[18px]' />
                    <p>Email:</p>
                    <p className='text-gray-500'>{userInfo?.email}</p>
                </div>
            </div>
            <div className='flex max-md:flex-col items-center gap-[40px] max-md:gap-[20px]'>
                <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                    <IoPeopleOutline className='text-purple-500 text-[18px]' />
                    <p>Gender:</p>
                    <p className='text-gray-500'>{userInfo?.gender}</p>
                </div>
                <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                    <CiPhone className='text-green-500 text-[18px]' />
                    <p>Contact:</p>
                    <p className='text-gray-500'>{userInfo?.phoneNumber}</p>
                </div>
            </div>
            <div className='flex max-md:flex-col items-center gap-[40px] max-md:gap-[20px]'>
                <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                    <CiPhone className='text-orange-500 text-[18px]' />
                    <p>Total Orders:</p>
                    <p className='text-gray-500'>{order?.totalOrders}</p>
                </div>
                <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                    <FaSackDollar className='text-yellow-500 text-[18px]' />
                    <p>Total Amount:</p>
                    <p className='text-gray-500'>{order?.totalAmountSpent}&#8363;</p>
                </div>
            </div>
        </div>
    )
}

export default CustomerOrder
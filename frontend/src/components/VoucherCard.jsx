import React from 'react'
import { CiGift } from "react-icons/ci";
import { format } from 'date-fns';

const VoucherCard = ({ voucher }) => {

    return (
        <div className='w-[400px] h-[200px] flex flex-col border border-pink-500 rounded-[20px]'>
            <div className='bg-gradient-to-br from-purple-500 to-pink-500 w-full h-[150px] p-[20px] rounded-t-[20px] flex flex-col gap-[20px]'>
                <div className='flex justify-between'>
                    <p className='text-[20px]'>{voucher.code}</p>
                    <CiGift className='text-[30px] text-red-600' />
                </div>
                <p className='text-[20px] text-white'>{voucher.discount}% OFF</p>
                <p className='text-gray-400'>{voucher.status}</p>

            </div>
            <div className='bg-white w-full h-[50px] p-[10px] flex justify-between rounded-b-[20px] shadow-md'>
                <p>Usage limit: {voucher.usageLimit}</p>
                <p>Valid until: {new Date(voucher.expiryDate).toLocaleDateString('en-GB')}</p>
            </div>

        </div>
    )
}

export default VoucherCard
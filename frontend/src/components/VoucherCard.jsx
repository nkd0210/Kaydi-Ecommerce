import React from 'react'
import { CiGift } from "react-icons/ci";
import { format } from 'date-fns';

const VoucherCard = ({ voucher }) => {

    return (
        <div className='w-[300px] h-[130px] flex flex-col border border-pink-500 rounded-[20px]'>
            <div className='bg-gradient-to-br from-purple-500 to-pink-500 w-full h-[100px] p-[10px] rounded-t-[20px] flex flex-col gap-[5px]'>
                <div className='flex justify-between'>
                    <p className='text-[20px]'>{voucher.code}</p>
                    <CiGift className='text-[30px] text-red-600' />
                </div>
                <p className='text-[18px] text-white'>{voucher.discount}% OFF</p>
                <p className='text-gray-400'>{voucher.status}</p>

            </div>
            <div className='bg-white w-full h-[30px] p-[10px] flex flex-col rounded-b-[20px] shadow-md'>
                <p className='text-[12px] text-gray-500'>Valid until: {new Date(voucher.expiryDate).toLocaleDateString('en-GB')}</p>
            </div>

        </div>
    )
}

export default VoucherCard
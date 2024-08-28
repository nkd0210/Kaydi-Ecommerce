import { useState, useEffect, useRef } from 'react'
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BiTrash } from 'react-icons/bi';
import Loader from '../../Loader';
import { FaGripLinesVertical } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import { FaSackDollar } from "react-icons/fa6";
import { LiaShippingFastSolid } from "react-icons/lia";
import { MdPayment } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { TbPlayerTrackNext } from "react-icons/tb";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { PiArrowFatLinesRightLight } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";

import 'animate.css'


const SingleOrder = ({ order, handleFetchOrder }) => {

    const products = order?.products;

    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [editStatus, setEditStatus] = useState(order?.status);

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const [orderId, setOrderId] = useState('');
    const [loadingEdit, setLoadingEdit] = useState(false);

    const handleEditOrderStatus = async () => {
        setLoadingEdit(true);
        try {
            const res = await fetch(`/api/order/editOrder/${orderId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: editStatus })
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Edit order status failed! Try again.");
                return;
            } else {
                handleShowSucccessMessage("Edit order status successfully.");
                setOpenStatusModal(false);
                handleFetchOrder();
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingEdit(false);
        }
    }

    return (
        <div className='border border-b-[1px] flex flex-col gap-[20px] p-[20px] rounded-[10px] w-full overflow-x-scroll shadow-md animate__animated animate__fadeInUp '>
            {
                loadingEdit ? (
                    <Loader />
                ) : (
                    <>
                        {/* customer info */}
                        <div className='flex gap-[20px] pb-[20px] border-b-[1px] border-gray-400'>
                            <ToastContainer />
                            <div className='flex gap-[10px]'>
                                <p>Name: </p>
                                <p className='text-gray-500'>{order?.receiverName}</p>
                                <FaGripLinesVertical className='text-[20px] ' />
                            </div>
                            <div className='flex gap-[10px]'>
                                <p>Phone: </p>
                                <p className='text-gray-500'>{order?.receiverPhone}</p>
                                <FaGripLinesVertical className='text-[20px]' />
                            </div>
                            <div className='flex gap-[10px]'>
                                <p>Note: </p>
                                <p className='text-gray-500'>{order?.receiverNote ? order.receiverNote : 'None'}</p>
                                <FaGripLinesVertical className='text-[20px]' />
                            </div>
                            <div className='flex gap-[10px]'>
                                <p>Address: </p>
                                <p className='text-gray-500'>{order?.shippingAddress}</p>
                            </div>
                        </div>

                        {/* product info */}
                        <div className='flex flex-col gap-[20px]'>

                            {products.map((product, index) => (
                                <div key={index} className='flex gap-[40px] items-center' >
                                    <div className='flex items-center gap-[10px]'>
                                        <MdDriveFileRenameOutline className='text-blue-500 text-[18px]' />
                                        <p>Name:</p>
                                        <p className='text-gray-500'>{product?.name}</p>
                                    </div>
                                    <div className='flex items-center gap-[10px]'>
                                        <IoPricetagOutline className='text-red-500 text-[18px]' />
                                        <p>Price:</p>
                                        <p className='text-gray-500'>{product?.price}&#8363;</p>

                                    </div>
                                </div>
                            ))}

                            <div className='flex items-center gap-[10px]'>
                                <LiaShippingFastSolid className='text-[18px] text-green-500' />
                                <p>Method: </p>
                                <p className='text-gray-500'>{order?.paymentMethod}</p>
                                <p>~~~</p>
                                <MdPayment className='text-[18px] text-green-500' />
                                <p>Payment check:</p>
                                <p className='text-gray-500'>{order?.paymentCheck ? 'Yes' : 'No'}</p>
                            </div>

                            <div className='flex items-center gap-[10px]'>
                                <FaRegCalendarAlt className='text-[18px] text-purple-500' />
                                <p>Date: </p>
                                <p className='text-gray-500'>{new Date(order?.createdAt).toLocaleString('en-GB')}</p>
                            </div>

                            <div className='flex items-center gap-[10px]'>
                                <FaSackDollar className='text-[18px] text-yellow-500' />
                                <p>Total price: </p>
                                <p className='text-gray-500'>{order?.totalAmount}&#8363;</p>
                            </div>

                            <div className='flex items-center gap-[10px]'>
                                <GrStatusGood className='text-[18px] text-orange-500' />
                                <p>Status: </p>
                                <p className='text-gray-500'>{order?.status}</p>
                                <div className='border rounded-[20px] flex items-center justify-center gap-[10px] w-[30px] h-[30px] bg-gray-50 '>
                                    {
                                        openStatusModal ? (
                                            <MdOutlineKeyboardDoubleArrowLeft className='text-[18px] cursor-pointer' onClick={() => { setOpenStatusModal(false); setOrderId(order._id) }} />
                                        ) : (
                                            <TbPlayerTrackNext className='text-[18px] cursor-pointer' onClick={() => { setOpenStatusModal(true); setOrderId(order._id) }} />
                                        )
                                    }
                                </div>

                                {
                                    openStatusModal && (
                                        <div className='flex items-center gap-[20px] border rounded-[10px] p-[10px]'>
                                            <p onClick={() => setEditStatus('pending')} className={`cursor-pointer hover:text-red-500 ${editStatus === 'pending' ? 'text-red-500' : ''}`}>Pending</p>
                                            <PiArrowFatLinesRightLight className='text-[18px] text-blue-500' />
                                            <p onClick={() => setEditStatus('processing')} className={`cursor-pointer hover:text-red-500 ${editStatus === 'processing' ? 'text-red-500' : ''}`}>Processing</p>
                                            <PiArrowFatLinesRightLight className='text-[18px] text-blue-500' />
                                            <p onClick={() => setEditStatus('shipped')} className={`cursor-pointer hover:text-red-500 ${editStatus === 'shipped' ? 'text-red-500' : ''}`}>Shipped</p>
                                            <PiArrowFatLinesRightLight className='text-[18px] text-blue-500' />
                                            <p onClick={() => setEditStatus('delivered')} className={`cursor-pointer hover:text-red-500 ${editStatus === 'delivered' ? 'text-red-500' : ''}`}>Delivered</p>
                                            <div className='flex gap-[20px] pl-[20px]'>
                                                <div onClick={() => handleEditOrderStatus()} className='cursor-pointer hover:text-blue-500'>Save</div>
                                                <div onClick={() => setOpenStatusModal(false)} className='cursor-pointer hover:text-red-500'>Cancel</div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                        </div>
                    </>
                )
            }

        </div>
    )
}

export default SingleOrder
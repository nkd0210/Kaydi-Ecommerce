import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoMdNotificationsOutline } from 'react-icons/io';
import Navigation from '../components/Navigation';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { FiArrowDownCircle } from "react-icons/fi";
import { MdOutlineArrowCircleRight } from "react-icons/md";
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiTrash } from 'react-icons/bi';
// ANIMATE
import 'animate.css';
// MODAL
import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";
const OrderDetail = () => {

    const { orderId } = useParams();

    const [orderDetail, setOrderDetail] = useState({});
    const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

    const fetchOrder = async () => {
        setLoadingOrderDetail(true);
        try {
            const res = await fetch(`/api/order/getOrderById/${orderId}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderDetail(data);
                setLoadingOrderDetail(false);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingOrderDetail(false);
        }
    }

    useEffect(() => {
        fetchOrder();
    }, [orderId])


    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const [cancelModal, setCancelModal] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const handleCancelOrder = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/order/cancelOrder/${currentUser._id}/${orderId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Cancel order failed! Try again");
                return;
            } else {
                setCancelModal(false);
                navigate('/profile/history');
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <>
            <Navigation />
            <Navbar />
            <div className='p-[20px]'>
                {loadingOrderDetail ? (
                    <Loader />
                ) : (
                    <div className='p-[20px] max-md:p-[10px] border w-full flex flex-wrap gap-[20px] h-[450px] max-md:h-full'>
                        <ToastContainer />
                        {/* status */}
                        <div className='border-black w-[150px] max-md:w-full flex flex-col max-md:flex-row gap-[20px] max-md:gap-[5px] items-center justify-center animate__animated animate__fadeInLeft'>
                            <p className={`${orderDetail.status === 'pending' ? 'text-red-500 font-semibold text-[18px]' : 'text-[14px]'}`}>Pending</p>
                            <FiArrowDownCircle className='text-[30px] max-md:hidden' />
                            <MdOutlineArrowCircleRight className='text-[30px] md:hidden ' />
                            <p className={`${orderDetail.status === 'processing' ? 'text-red-500 font-semibold text-[18px]' : 'text-[14px]'}`}>Processing</p>
                            <FiArrowDownCircle className='text-[30px] max-md:hidden' />
                            <MdOutlineArrowCircleRight className='text-[30px] md:hidden' />
                            <p className={`${orderDetail.status === 'shipped' ? 'text-red-500 font-semibold text-[18px]' : 'text-[14px]'}`}>Shipped</p>
                            <FiArrowDownCircle className='text-[30px] max-md:hidden' />
                            <MdOutlineArrowCircleRight className='text-[30px] md:hidden' />
                            <p className={`${orderDetail.status === 'delivered' ? 'text-red-500 font-semibold text-[18px]' : 'text-[14px]'}`}>Delivered</p>
                        </div>
                        {/* products */}
                        <div className='bg-white w-[500px] max-md:w-[400px] max-h-[400px] flex flex-col gap-[20px] overflow-y-scroll animate__animated animate__fadeInDown'>
                            {orderDetail.products?.map((product, index) => (
                                <div key={index} className='flex justify-between gap-[10px] border shadow-md p-[10px]'>
                                    <div className='flex gap-[10px]'>
                                        <img src={product.image} alt="" className='w-[60px] h-[60px] object-cover rounded-[5px]' />
                                        <div className='flex flex-col gap-[5px]'>
                                            <p>{product.name}</p>
                                            <p><span className='uppercase'>{product.size}</span> | {product.color} | x{product.quantity}</p>
                                        </div>
                                    </div>
                                    <p className='text-red-500'>{product.price}&#8363;</p>
                                </div>
                            ))}
                            <p>Thành tiền: <span className='text-red-500'>{orderDetail.totalAmount}&#8363;</span> </p>
                        </div>
                        {/* info */}
                        <div className='max-h-[400px] overflow-y-scroll border rounded-[10px] p-[10px] shadow-md flex-1 animate__animated animate__fadeInRight'>
                            <h3 className='font-semibold text-[18px] pb-[20px]'>Thông tin nhận hàng</h3>
                            <div className='flex gap-[10px]'>
                                <span className='w-[200px] max-md:w-[160px]'>
                                    Tên người nhận:
                                </span>
                                <p>
                                    {orderDetail.receiverName}
                                </p>
                            </div>
                            <div className='flex gap-[10px]'>
                                <span className='w-[200px] max-md:w-[160px]'>
                                    Số điện thoại nhận:
                                </span>
                                <p>
                                    {orderDetail.receiverPhone}
                                </p>
                            </div>
                            <div className='flex gap-[10px]'>
                                <span className='w-[200px] max-md:w-[160px]'>
                                    Ghi chú:
                                </span>
                                <p>
                                    {orderDetail?.receiverNote}
                                </p>
                            </div>
                            <div className='flex gap-[10px]'>
                                <span className='w-[200px] max-md:w-[160px]'>
                                    Địa chỉ nhận:
                                </span>
                                <p>
                                    {orderDetail.shippingAddress}
                                </p>
                            </div>
                            <h3 className='font-semibold text-[18px] py-[20px]'>Phương thức thanh toán</h3>
                            <p>{orderDetail.paymentMethod}</p>
                            <h3 className='font-semibold text-[18px] py-[20px]'>Thông tin đơn hàng </h3>
                            <div className='flex gap-[10px]'>
                                <span className='w-[200px] max-md:w-[160px]'>Mã đơn hàng: </span>
                                <p>{orderDetail._id}</p>
                            </div>
                            <div className='flex gap-[10px]'>
                                <span className='w-[200px] max-md:w-[160px]'>Thời gian đặt hàng:</span>
                                <p>{new Date(orderDetail.createdAt).toLocaleString('en-GB')}</p>
                            </div>
                            {/* button */}
                            <div className='flex gap-[20px] py-[10px]'>
                                <div onClick={() => setCancelModal(true)} className='border border-red-500 p-[10px] w-[150px] cursor-pointer text-center hover:bg-gray-50'>
                                    Hủy đơn hàng
                                </div>
                                <div className='bg-red-500 text-white w-[150px] p-[10px] cursor-pointer text-center hover:opacity-70'>
                                    Đánh giá
                                </div>
                            </div>
                        </div>

                        <Modal
                            open={cancelModal}
                            onClose={() => setCancelModal(false)}
                            className="z-40"
                        >
                            <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] max-md:w-[300px] h-[200px] overflow-y-scroll bg-white text-black rounded-[20px]'>
                                <IoIosCloseCircleOutline onClick={() => setCancelModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                <div className='p-[20px] flex flex-col gap-[20px]'>
                                    <h3 className='text-center text-[20px]'>Hủy đơn hàng này ?</h3>
                                    <span className='text-gray-400 text-[12px] text-center'>(đơn hàng có thể không hủy được nếu như đang được vận chuyển)</span>
                                    <div className='flex justify-evenly gap-[20px]'>
                                        <div onClick={handleCancelOrder} className='flex justify-center items-center w-[200px] bg-red-400 cursor-pointer p-[10px] rounded-[20px] hover:opacity-70'>Hủy đơn hàng</div>
                                        <div onClick={() => setCancelModal(false)} className='flex justify-center items-center w-[200px] bg-blue-400 cursor-pointer p-[10px] rounded-[20px] hover:opacity-70'>Quay trở lại</div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </div>
                )}
            </div >
        </>
    )
}

export default OrderDetail
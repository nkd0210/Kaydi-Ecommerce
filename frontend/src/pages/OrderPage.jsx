import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import { useSelector, useDispatch } from 'react-redux'
import { setCartStart, setCartSuccess } from "../redux/cart/cartSlice";
import Loader from '../components/Loader';
import { setClearOrder, setOrderSuccess } from '../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import { removeSingleItemInOrder } from '../redux/order/orderSlice';

import { CiTrash } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaCcStripe } from "react-icons/fa";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

const OrderPage = () => {

  const { currentUser } = useSelector((state) => state.user);
  const { products, totalPrice } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleShowSucccessMessage = (message) => {
    toast.success(message)
  }

  const handleRemoveItem = (product) => {
    try {
      dispatch(removeSingleItemInOrder(product));
      handleShowSucccessMessage("Đã xóa sản phẩm khỏi giỏ hàng")
    } catch (error) {
      console.log(error.message);
    }
  }

  const [voucherModal, setVoucherModal] = useState(false);


  // form order
  const [receiverName, setReceiverName] = useState(currentUser.username)
  const [receiverPhone, setReceiverPhone] = useState(currentUser.phoneNumber)
  const [receiverNote, setReceiverNote] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');


  const handleInputChange = (e) => {
    setReceiverAddress(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedAddress(e.target.value);
    setReceiverAddress(e.target.value);
  };


  return (
    <>
      <Navigation />
      <Navbar />
      <div className='p-[20px] max-md:p-[10px] w-full overflow-x-scroll'>
        <ToastContainer />
        <h1 className='font-semibold text-[20px] py-[20px]'>Hi, {currentUser.username}!</h1>
        <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px]'>

          <div className='flex flex-col gap-[20px] border rounded-[20px] p-[10px] max-h-[1000px] overflow-y-scroll'>
            <h3 className='uppercase font-semibold'>Giỏ hàng</h3>
            <div>
              {products.length === 0 ? (
                <h3 className='text-red-500'>
                  Giỏ hàng của bạn đang trống !
                </h3>
              ) : (
                <>
                  {products.map((product, index) => (
                    <div key={index} className='flex gap-[50px] max-md:gap-[10px] overflow-x-scroll mb-[20px]'>
                      <img src={product.image} alt="img" className='w-[150px] h-[200px] object-cover rounded-[10px]' />
                      <div className='flex flex-col gap-[10px]'>
                        <p className='uppercase'>{product.name}</p>
                        <p className='uppercase'>màu sắc: {product.color} </p>
                        <p className='uppercase'>size: {product.size}</p>
                        <p className='uppercase'>số lượng: {product.quantity}</p>
                        <p className='uppercase'> giá: {product.price}&#8363;</p>
                        <div onClick={() => handleRemoveItem(product)} className='flex gap-[10px] cursor-pointer hover:opacity-70'>
                          <CiTrash className='text-[20px]' />
                          <span>Xóa</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <p className='uppercase'>tổng số tiền thanh toán: <span className='text-blue-700'>{totalPrice}&#8363;</span></p>
          </div>

          <div className='flex flex-col gap-[20px] border rounded-[20px] p-[10px] max-h-[800px] overflow-y-scroll'>
            <h3 className='uppercase font-semibold'>Thông tin đặt hàng</h3>
            {/* ten + sdt */}
            <div className='flex max-md:flex-col gap-[20px]'>
              <div className='flex flex-col'>
                <span>Họ và tên</span>
                <input id='receiverName' onChange={(e) => setReceiverName(e.target.value)} type="text" defaultValue={currentUser.username} className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
              </div>
              <div className='flex flex-col'>
                <span>Số điện thoại</span>
                <input id='receiverPhone' onChange={(e) => setReceiverPhone(e.target.value)} type="text" defaultValue={currentUser.phoneNumber} className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
              </div>
            </div>
            {/* dia chi */}
            <div className='flex max-md:flex-col gap-[20px]'>
              <div className='flex flex-col'>
                <span>Địa chỉ</span>
                <input id='shippingAddress' onChange={handleInputChange} type="text" value={receiverAddress} placeholder='Địa chỉ' className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
              </div>
              <div className='flex flex-col'>
                <label>Mở sổ địa chỉ:</label>
                <select
                  value={selectedAddress}
                  onChange={handleSelectChange}
                  className='rounded-[10px] p-[10px] w-[300px]'
                >
                  {currentUser.addressList.map((address, index) => (
                    <option value={address} key={index}>{address}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* ghi chu */}
            <div className='flex flex-col gap-[10px]'>
              <span>Ghi chú thêm</span>
              <input id='receiverNote' onChange={(e) => setReceiverNote(e.target.value)} type="text" placeholder='Ghi chú thêm' className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
            </div>
            {/* thanh toan */}
            <h3 className='uppercase font-semibold'>Hình thức thanh toán</h3>
            <div className='flex flex-col gap-[10px]'>
              <div
                className={`border rounded-[20px] w-full p-[10px] flex gap-[20px] items-center ${paymentMethod === 'COD' ? 'border-blue-400' : ''}`}
                onClick={() => setPaymentMethod('COD')}
              >
                <CiDeliveryTruck className='text-[30px]' />
                <div className='flex flex-col gap-[10px]'>
                  <p>COD</p>
                  <p>Thanh toán khi nhận hàng</p>
                </div>
              </div>
              <div
                className={`border rounded-[20px] w-full p-[10px] flex gap-[20px] items-center ${paymentMethod === 'Stripe' ? 'border-blue-400' : ''}`}
                onClick={() => setPaymentMethod('Stripe')}
              >
                <FaCcStripe className='text-[30px]' />
                <div className='flex flex-col gap-[10px]'>
                  <p>Thanh toán qua Stripe</p>
                </div>
              </div>
              <div
                className={`border rounded-[20px] w-full p-[10px] flex gap-[20px] items-center ${paymentMethod === 'MoMo' ? 'border-blue-400' : ''}`}
                onClick={() => setPaymentMethod('MoMo')}
              >
                <img src="/logo/momo.webp" alt="momo" className='w-[30px] h-[30px] object-cover' />
                <div className='flex flex-col gap-[10px]'>
                  <p>Thanh toán qua MoMo</p>
                </div>
              </div>
              <div
                className={`border rounded-[20px] w-full p-[10px] flex gap-[20px] items-center ${paymentMethod === 'Zalo' ? 'border-blue-400' : ''}`}
                onClick={() => setPaymentMethod('Zalo')}
              >
                <img src="/logo/zalo.png" alt="zalo" className='w-[30px] h-[30px] object-cover' />
                <div className='flex flex-col gap-[10px]'>
                  <p>Thanh toán qua Zalo</p>
                </div>
              </div>
            </div>
            {/*  voucher */}
            <div className='flex gap-[20px]'>
              <h3 className='uppercase font-semibold'>Voucher khuyến mãi</h3>
              <p onClick={() => setVoucherModal(true)} className='underline cursor-pointer'>{`Xem tất cả >`} </p>
            </div>

            <div className='flex items-center justify-center w-[200px] rounded-[20px] bg-red-400 py-[10px] cursor-pointer hover:opacity-70 hover:text-white '>Đặt hàng</div>
          </div>


        </div>
      </div>

      <Modal
        open={voucherModal}
        onClose={() => setVoucherModal(false)}
      >
        <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[500px] max-md:w-full bg-white text-black h-[500px] rounded-[20px] '>
          <IoIosCloseCircleOutline onClick={() => setVoucherModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />

        </div>
      </Modal>
    </>
  )
}

export default OrderPage
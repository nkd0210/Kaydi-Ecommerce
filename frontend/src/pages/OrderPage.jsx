import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader';
import { setClearOrder } from '../redux/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import { removeSingleItemInOrder } from '../redux/order/orderSlice';

import { CiTrash } from "react-icons/ci";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaCcStripe } from "react-icons/fa";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

import VoucherCard from '../components/VoucherCard';
import { setVoucher } from '../redux/order/voucherSlice';

import { setCartSuccess } from '../redux/cart/cartSlice';

import 'animate.css'

import { loadStripe } from '@stripe/stripe-js';

const OrderPage = () => {

  const { currentUser } = useSelector((state) => state.user);
  const { products, totalPrice } = useSelector((state) => state.order);
  const { items, cartCount } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(products);

  const handleShowSucccessMessage = (message) => {
    toast.success(message)
  }

  const handleRemoveItem = (product) => {
    try {
      dispatch(removeSingleItemInOrder(product));
      handleShowSucccessMessage("Đã xóa sản phẩm khỏi giỏ hàng");
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


  const [addressListModal, setAddressListModal] = useState(false);

  const handleInputChange = (e) => {
    setReceiverAddress(e.target.value);
  };

  const handleSelectChange = (address) => {
    setReceiverAddress(address);
    setAddressListModal(false);
  };

  // fetch voucher
  const [availableVouchers, setAvailableVouchers] = useState([]);

  const fetchVoucherByProducts = async () => {
    const productIds = products.map((item) => item.productId);
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/voucher/getVoucherByProductIds/${productIds.join(',')}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setAvailableVouchers(data)
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (products) {
      fetchVoucherByProducts();
    }
  }, [products]);

  const [newPrice, setNewPrice] = useState('');
  const [chooseVoucher, setChooseVoucher] = useState({});

  // click voucher for view the price if it's good
  const handleClickVoucher = (voucher) => {
    const discountAmount = totalPrice * voucher.discount / 100;
    const priceAfterDiscount = totalPrice - discountAmount;
    try {
      setNewPrice(priceAfterDiscount);
      setChooseVoucher(voucher);
      setVoucherModal(false);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowErrorMessage = (message) => {
    toast.error(message)
  }

  const [priceAfterApplyVoucher, setPriceAfterApplyVoucher] = useState('');

  const handleApplyVoucher = async (voucher) => {
    const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/voucher/applyVoucher/${currentUser._id}/${voucher.code}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productIds: voucher.applyProducts,
        categories: voucher.applyCategories
      }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      handleShowErrorMessage("Voucher code is invalid or expired!");
      return;
    } else {
      const discountPrice = totalPrice * voucher.discount / 100;
      setPriceAfterApplyVoucher(totalPrice - discountPrice);
      handleShowSucccessMessage("Áp dụng voucher thành công")
    }
  }

  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleSubmitOrderForm = async (e) => {
    e.preventDefault();
    const orderForm = {
      userId: currentUser._id,
      receiverName,
      receiverPhone,
      receiverNote,
      products,
      totalAmount: priceAfterApplyVoucher || totalPrice,
      shippingAddress: receiverAddress,
      paymentMethod,
    }
    setLoadingOrder(true);
    try {

      if (paymentMethod === "COD") {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/createOrder`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderForm),
          credentials: 'include',
        });
        if (!res.ok) {
          handleShowErrorMessage("Đã xảy ra lỗi khi đặt hàng!");
          return;
        } else {
          setLoadingOrder(false);
          dispatch(setClearOrder());
          navigate('/profile/history');
        }
        await handleRemoveProductInCart();
      }
      else if (paymentMethod === "Stripe") {

        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/paymentWithStripe`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderForm),
          credentials: 'include',
        });

        const session = await res.json();
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          console.log(result.error);
          handleShowErrorMessage("Đã xảy ra lỗi khi thanh toán với Stripe!");
          return;
        }
      }
      else if (paymentMethod === "ZaloPay") {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/payment/createPaymentZaloPay`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderForm),
          credentials: 'include',
        });
        const dataResponse = await res.json();
        if (!res.ok) {
          handleShowErrorMessage("Đã xảy ra lỗi khi đặt hàng!");
          return;
        } else {
          window.location.href = dataResponse?.data.payment_url;
        }

      }

    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingOrder(false);
    }
  }

  const handleRemoveProductInCart = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cart/removeItemsInCart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?._id,
          productsRemove: products
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        dispatch(setCartSuccess(data));
      }
    } catch (error) {
      console.log(error.message);
    }

  }

  return (
    <>
      <Navigation />
      <Navbar />
      <div className='container mx-auto overflow-x-clip'>
        <div className='p-[20px] max-md:p-[10px] w-full overflow-x-scroll'>
          <ToastContainer />
          <h1 className='font-semibold text-[20px] py-[20px] animate__animated animate__fadeInLeft'>Hi, {currentUser.username}!</h1>
          {loadingOrder ? (
            <Loader />
          ) : (
            <>
              <div className='grid grid-cols-2 max-md:grid-cols-1 gap-[20px]'>

                <div className='flex flex-col gap-[20px] p-[10px] max-h-[1000px] overflow-y-scroll animate__animated animate__fadeInLeft'>
                  <h3 className='uppercase font-semibold'>Giỏ hàng</h3>
                  <div>
                    {products.length === 0 ? (
                      <h3 className='text-red-500'>
                        Giỏ hàng của bạn đang trống !
                      </h3>
                    ) : (
                      <>
                        {products.map((product, index) => (
                          <div key={index} className='flex gap-[50px] max-md:gap-[10px] overflow-x-scroll mb-[20px] border rounded-[20px] p-[10px] shadow-md'>
                            <img src={product.image} alt="img" className='w-[150px] h-[200px] object-cover rounded-[10px]' />
                            <div className='flex flex-col gap-[10px]'>
                              <p className='uppercase'>{product.name}</p>
                              <p className='uppercase'>màu sắc: {product.color} </p>
                              <p className='uppercase'>size: {product.size}</p>
                              <p className='uppercase'>số lượng: {product.quantity}</p>
                              <p className='uppercase'> giá: {product.price}&#8363;</p>
                              <div onClick={() => handleRemoveItem(product)} className='flex gap-[10px] cursor-pointer hover:text-red-400'>
                                <CiTrash className='text-[20px]' />
                                <span>Xóa</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {priceAfterApplyVoucher ? (
                    <p className='uppercase animate__animated animate__fadeInUp'>tổng số tiền thanh toán: <span className='text-blue-700'>{priceAfterApplyVoucher}&#8363;</span></p>

                  ) : (
                    <>
                      <p className='uppercase'>tổng số tiền sản phẩm: <span className='text-blue-700'>{totalPrice}&#8363;</span></p>
                      {newPrice && (
                        <div className='flex max-md:flex-col gap-[20px] animate__animated animate__fadeInUp'>
                          <p className='uppercase'>tổng số tiền sau khi dùng voucher: <span className='text-blue-700'>{newPrice}&#8363;.</span></p>
                          <p onClick={() => handleApplyVoucher(chooseVoucher)} className='cursor-pointer hover:text-red-400'>Sử dụng voucher này</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <form onSubmit={handleSubmitOrderForm} className='flex flex-col gap-[20px] border rounded-[20px] shadow-md p-[20px] max-h-[800px] overflow-y-scroll animate__animated animate__fadeInRight'>
                  <h3 className='uppercase font-semibold'>Thông tin đặt hàng</h3>
                  {/* ten + sdt */}
                  <div className='flex max-md:flex-col gap-[20px]'>
                    <div className='flex flex-col'>
                      <span>Họ và tên</span>
                      <input required id='receiverName' onChange={(e) => setReceiverName(e.target.value)} type="text" defaultValue={currentUser.username} className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
                    </div>
                    <div className='flex flex-col'>
                      <span>Số điện thoại</span>
                      <input required id='receiverPhone' onChange={(e) => setReceiverPhone(e.target.value)} type="text" defaultValue={currentUser.phoneNumber} className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
                    </div>
                  </div>
                  {/* dia chi */}
                  <div className='flex max-md:flex-col items-center gap-[20px]'>
                    <div className='flex flex-col'>
                      <span>Địa chỉ</span>
                      <input required id='shippingAddress' onChange={handleInputChange} type="text" value={receiverAddress} placeholder='Địa chỉ' className='border border-gray-400 rounded-[30px] p-[10px] pl-[20px] w-[300px]' />
                    </div>

                    <p onClick={() => setAddressListModal(true)} className='underline cursor-pointer'> {`Mở sổ địa chỉ > `}</p>


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
                      className={`border rounded-[20px] w-full cursor-pointer hover:bg-gray-100 p-[10px] flex gap-[20px] items-center ${paymentMethod === 'COD' ? 'border-blue-400' : ''}`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <CiDeliveryTruck className='text-[30px]' />
                      <div className='flex flex-col gap-[10px]'>
                        <p>COD</p>
                        <p>Thanh toán khi nhận hàng</p>
                      </div>
                    </div>
                    <div
                      className={`border rounded-[20px] w-full cursor-pointer hover:bg-gray-100 p-[10px] flex gap-[20px] items-center ${paymentMethod === 'Stripe' ? 'border-blue-400' : ''}`}
                      onClick={() => setPaymentMethod('Stripe')}
                    >
                      <FaCcStripe className='text-[30px]' />
                      <div className='flex flex-col gap-[10px]'>
                        <p>Thanh toán qua Stripe</p>
                      </div>
                    </div>
                    <div
                      className={`border rounded-[20px] w-full cursor-pointer hover:bg-gray-100 p-[10px] flex gap-[20px] items-center ${paymentMethod === 'MoMo' ? 'border-blue-400' : ''}`}
                      onClick={() => setPaymentMethod('MoMo')}
                    >
                      <img src="/logo/momo.webp" alt="momo" className='w-[30px] h-[30px] object-cover' />
                      <div className='flex flex-col gap-[10px]'>
                        <p>Thanh toán qua MoMo</p>
                      </div>
                    </div>
                    <div
                      className={`border rounded-[20px] cursor-pointer hover:bg-gray-100 w-full p-[10px] flex gap-[20px] items-center ${paymentMethod === 'ZaloPay' ? 'border-blue-400' : ''}`}
                      onClick={() => setPaymentMethod('ZaloPay')}
                    >
                      <img src="/logo/zalo.png" alt="zalo" className='w-[30px] h-[30px] object-cover' />
                      <div className='flex flex-col gap-[10px]'>
                        <p>Thanh toán qua ZaloPay</p>
                      </div>
                    </div>
                  </div>
                  {/*  voucher */}
                  <div className='flex gap-[20px]'>
                    <h3 className='uppercase font-semibold'>Voucher khuyến mãi</h3>
                    {
                      paymentMethod === "Stripe" ? (
                        <p className='text-gray-400'>(không thể áp dụng voucher đối với phương thức này)</p>
                      ) : (
                        <p onClick={() => setVoucherModal(true)} className='underline cursor-pointer'>{`Xem tất cả >`} </p>

                      )
                    }
                  </div>

                  <button type='submit' className='flex items-center justify-center w-[200px] rounded-[20px] bg-red-400 py-[10px] cursor-pointer hover:opacity-70 hover:text-white '>Đặt hàng</button>
                </form>

              </div>
            </>
          )}
        </div>
      </div>



      {/* ADDRESS LIST MODAL */}
      <Modal
        open={addressListModal}
        onClose={() => setAddressListModal(false)}
      >
        <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] max-md:w-[380px] h-[400px] bg-white text-black rounded-[20px] '>
          <IoIosCloseCircleOutline onClick={() => setAddressListModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
          <div className='p-[20px] flex flex-col gap-[20px] mt-[30px]'>
            {currentUser?.addressList.map((address, index) => (
              <div key={index} onClick={() => handleSelectChange(address)} className='border w-full p-[10px] rounded-[10px] shadow-md cursor-pointer'>
                {address}
              </div>
            ))}

          </div>
        </div>
      </Modal>
      {/* VOUCHER MODAL */}
      <Modal
        open={voucherModal}
        onClose={() => setVoucherModal(false)}
      >
        <div className=' absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] max-md:w-[380px] h-[600px] bg-white text-black rounded-[20px] '>
          <IoIosCloseCircleOutline onClick={() => setVoucherModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
          {availableVouchers.length === 0 ? (
            <div className='p-[20px] '>No voucher available!</div>
          ) : (
            <div className='w-full overflow-y-scroll p-[20px] flex flex-col gap-[20px] '>
              {availableVouchers.map((voucher, index) => (
                <div key={index} onClick={() => handleClickVoucher(voucher)}>
                  <VoucherCard voucher={voucher} className='cursor-pointer' />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default OrderPage
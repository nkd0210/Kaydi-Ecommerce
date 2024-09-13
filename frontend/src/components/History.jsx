import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

import "animate.css"

const History = () => {

  const [userOrderData, setUserOrderData] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  const fetchUserOrder = async (page) => {
    setLoadingUserOrders(true);
    try {
      const res = await fetch(`/api/order/getUserOrder/${currentUser._id}?page=${page}&limit=3`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setUserOrderData(data);
        setUserOrders(data.findUserOrder);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingUserOrders(false);
    }
  }

  useEffect(() => {
    fetchUserOrder(1);
  }, [])

  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => {
        const newPage = prevPage - 1;
        fetchUserOrder(newPage);
        return newPage;
      })
    }
  }

  const handleNextPage = () => {
    if (page < userOrderData?.totalPages) {
      setPage(prevPage => {
        const newPage = prevPage + 1;
        fetchUserOrder(newPage);
        return newPage;
      })
    }
  }

  return (
    <div className='w-full max-h-[800px] overflow-y-scroll bg-gray-50 p-[20px] rounded-[10px]'>
      <h2 className="text-[24px] font-semibold mb-[20px] animate__animated animate__fadeIn">Lịch sử đơn hàng</h2>
      {
        loadingUserOrders ? (
          <Loader />
        ) : userOrders.length === 0 ? (
          <div>Chưa có đơn hàng nào được đặt!</div>
        ) : (
          <div className='flex flex-col gap-[20px]'>
            {userOrders.map((order, index) => (
              <div onClick={() => navigate(`/orderDetail/${order._id}`)} key={index} className='border p-[10px] bg-white flex flex-col gap-[20px] cursor-pointer hover:bg-opacity-70 animate__animated animate__fadeInUp'>
                {order.products.map((product, index) => (
                  <div key={index} className='flex justify-between  gap-[10px]'>
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

                <div className='flex justify-between'>
                  <p>{order.products.length} sản phẩm</p>
                  <p>Thành tiền: <span className='text-red-500'>{order.totalAmount}&#8363;</span></p>
                </div>

                {order?.paymentCheck ? (
                  <p className='text-green-500'>Đã thanh toán</p>
                ) : (
                  <p className='text-blue-500'>Chưa thanh toán</p>
                )}
              </div>
            ))}
            <div className='flex justify-center mx-auto items-center gap-[10px] my-[40px]'>
              <button onClick={handlePreviousPage} disabled={page === 1}>{`<`}</button>
              <p>{userOrderData?.currentPage}/{userOrderData?.totalPages}</p>
              <button onClick={handleNextPage} disabled={userOrderData?.currentPage === userOrderData?.totalPages}>{`>`}</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default History
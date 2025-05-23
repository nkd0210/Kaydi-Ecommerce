import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import 'animate.css'

import StarIcon from '@mui/icons-material/Star';
import Loader from './Loader';

const Reply = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [loadingReview, setLoadingReview] = useState(false);
  const [userReviewData, setUserReviewData] = useState({});
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const handleFetchUserReview = async (page) => {
    setLoadingReview(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/review/getUserReview/${currentUser._id}?page=${page}&limit=5`, {
        method: "GET",
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setUserReviewData(data);
        setReviews(data.findUserReview);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingReview(false);
    }
  }

  useEffect(() => {
    handleFetchUserReview(1);
  }, [])

  const [page, setPage] = useState(1);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => {
        const newPage = prevPage - 1;
        handleFetchUserReview(newPage);
        return newPage;
      })
    }
  }

  const handleNextPage = () => {
    if (page < userReviewData?.totalPages) {
      setPage(prevPage => {
        const newPage = prevPage + 1;
        handleFetchUserReview(newPage);
        return newPage;
      })
    }
  }

  return (
    <div className='w-full h-[600px] overflow-y-scroll bg-gray-50 p-[20px] rounded-[10px] hide-scrollbar'>
      <h2 className="text-[24px] font-semibold mb-[20px] animate__animated animate__fadeInDown">Đánh giá và phản hồi</h2>
      {
        loadingReview ? (
          <Loader />
        ) : !reviews ? (
          <div className='text-red-400'>Chưa có đánh giá nào của bạn!</div>
        ) : (
          <div className='flex flex-col gap-[40px]'>
            {
              reviews.map((review, index) => (
                <div onClick={() => navigate(`/productDetail/${review?.product[0]._id}`)} key={index} className='border shadow-md cursor-pointer rounded-[10px] w-full p-[10px] flex flex-col gap-[20px] animate__animated animate__fadeInUp'>
                  <div className='flex gap-[20px]'>
                    <p>Tên sản phẩm:</p>
                    <p>{review.product[0].name}</p>
                  </div>
                  <div className='flex gap-[20px]'>
                    <p>Chi tiết: </p>
                    <p>{review.order.products[0].color} | {review.order.products[0].size} | x{review.order.products[0].quantity}</p>
                  </div>
                  <div className='flex gap-[20px]'>
                    <p>Ngày đặt:</p>
                    <p>{new Date(review.order.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                  <div className='flex gap-[20px]'>
                    <p>Rating:</p>
                    <div className='flex items-center gap-[5px]'>
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={index < review.rating ? 'text-yellow-300' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className='flex gap-[20px]'>
                    <p>Phản hồi:</p>
                    <p>{review.comment}</p>
                  </div>
                  <div className='flex gap-[20px]'>
                    <p>Hình ảnh:</p>
                    {
                      review.image.length === 0 ? (
                        <p>Chưa có hình ảnh nào</p>
                      ) : (
                        <div className='w-[600px] overflow-x-scroll hide-scrollbar flex gap-[20px]'>
                          {
                            review.image.map((item, index) => (
                              <div key={index} className=''>
                                <img src={item} alt="image" className='w-[200px] h-[100px] object-cover rounded-[10px]' />
                              </div>
                            ))
                          }
                        </div>
                      )
                    }
                  </div>
                </div>
              ))
            }
            <div className='flex justify-center mx-auto items-center gap-[10px] my-[40px]'>
              <button onClick={handlePreviousPage} disabled={page === 1}>{`<`}</button>
              <p>{userReviewData?.currentPage}/{userReviewData?.totalPages}</p>
              <button onClick={handleNextPage} disabled={userReviewData?.currentPage === userReviewData?.totalPages}>{`>`}</button>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default Reply
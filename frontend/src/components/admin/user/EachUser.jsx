import { useState, useEffect, useRef } from 'react'


import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { IoPeopleOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import { FaSackDollar } from "react-icons/fa6";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FaRegAddressCard } from "react-icons/fa6";
import StarIcon from '@mui/icons-material/Star';


import 'animate.css'
const EachUser = ({ userId }) => {

    const [userData, setUserData] = useState({});
    const [loadingUser, setLoadingUser] = useState(false);

    const handleFetchUserData = async () => {
        setLoadingUser(true);
        try {
            const res = await fetch(`/api/user/getuser/${userId}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserData(data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingUser(false);
        }
    }

    const [userOrderInfo, setUserOrderInfo] = useState({});
    const [userOrder, setUserOrder] = useState([]);
    const [loadingOrder, setLoadingOrder] = useState(false);

    const handleFetchUserOrder = async (page) => {
        setLoadingOrder(true);
        try {
            const res = await fetch(`/api/order/getUserOrder/${userId}?page=${page}&limit=3`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setUserOrderInfo(data);
                setUserOrder(data.findUserOrder);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingOrder(false);
        }
    }

    const [pageOrder, setPageOrder] = useState(1);

    const handlePreviousPageOrder = () => {
        if (pageOrder > 1) {
            setPageOrder(prevPage => {
                const newPage = prevPage - 1;
                handleFetchUserOrder(newPage);
                return newPage;
            })
        }
    }

    const handleNextPageOrder = () => {
        if (pageOrder < userOrderInfo?.totalPages) {
            setPageOrder(prevPage => {
                const newPage = prevPage + 1;
                handleFetchUserOrder(newPage);
                return newPage;
            })
        }
    }

    const [userReviewInfo, setUserReviewInfo] = useState({});
    const [userReview, setUserReview] = useState([]);
    const [loadingReview, setLoadingReview] = useState(false);

    const handleFetchUserReview = async (page) => {
        setLoadingReview(true);
        try {
            const res = await fetch(`/api/review/getUserReview/${userId}?page=${page}&limit=5`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setUserReviewInfo(data);
                setUserReview(data.findUserReview);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingReview(false);
        }
    }

    const [pageReview, setPageReview] = useState(1);

    const handlePreviousPageReview = () => {
        if (pageReview > 1) {
            setPageReview(prevPage => {
                const newPage = prevPage - 1;
                handleFetchUserReview(newPage);
                return newPage;
            })
        }
    }

    const handleNextPageReview = () => {
        if (pageReview < userReviewInfo?.totalPages) {
            setPageReview(prevPage => {
                const newPage = prevPage + 1;
                handleFetchUserReview(newPage);
                return newPage;
            })
        }
    }


    useEffect(() => {
        handleFetchUserData();
        handleFetchUserOrder(1);
        handleFetchUserReview(1);
    }, [userId])

    return (
        <div className='p-[20px] max-md:p-[10px] flex flex-col gap-[20px]'>
            <h3 className='text-center uppercase font-semibold text-[20px] max-md:text-[14px]'>User Detail</h3>
            <div className='flex flex-col gap-[20px] animate__animated animate__fadeInUp'>
                <h3 className='font-semibold text-[16px]'>Detail Information </h3>
                <div className='border border-b-[1px] flex flex-col gap-[20px] p-[20px] w-full overflow-x-scroll shadow-md '>
                    <img src={userData?.profilePic} alt="avatar" className='w-[200px] h-[200px] object-cover border rounded-[10px] p-[10px]' />
                    <div className='flex max-md:flex-col items-center gap-[40px] max-md:gap-[20px]'>
                        <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                            <MdDriveFileRenameOutline className='text-blue-500 text-[18px]' />
                            <p>Name:</p>
                            <p className='text-gray-500'>{userData?.username}</p>
                        </div>
                        <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                            <MdOutlineEmail className='text-red-500 text-[18px]' />
                            <p>Email:</p>
                            <p className='text-gray-500'>{userData?.email}</p>
                        </div>
                    </div>
                    <div className='flex max-md:flex-col items-center gap-[40px] max-md:gap-[20px]'>
                        <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                            <IoPeopleOutline className='text-purple-500 text-[18px]' />
                            <p>Gender:</p>
                            <p className='text-gray-500'>{userData?.gender}</p>
                        </div>
                        <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                            <CiPhone className='text-green-500 text-[18px]' />
                            <p>Contact:</p>
                            <p className='text-gray-500'>{userData?.phoneNumber}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-[10px] w-[400px] max-md:w-full'>
                        <LiaBirthdayCakeSolid className='text-orange-500 text-[18px]' />
                        <p>DOB:</p>
                        <p className='text-gray-500'>{userData?.dateOfBirth}</p>
                    </div>

                    <div className='flex gap-[10px] '>
                        <FaRegAddressCard className='text-orange-500 text-[18px]' />
                        <p>Address List:</p>
                        {
                            userData?.addressList?.map((address, index) => (
                                <div key={index} className='text-gray-500'>
                                    {address} |
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-[20px] animate__animated animate__fadeInUp'>
                <h3 className='font-semibold text-[16px]'>Detail Orders </h3>
                <div className='border border-b-[1px] flex flex-col gap-[20px] p-[20px] w-full overflow-x-scroll shadow-md  '>
                    <div className='flex flex-col gap-[20px]'>
                        {
                            userOrder.length == 0 ? (
                                <p>This user dont have any order yet!</p>
                            ) : (
                                <>
                                    {userOrder?.map((order, index) => (
                                        <div key={index} className='border p-[10px] bg-white flex flex-col gap-[20px]  hover:bg-opacity-70 animate__animated animate__fadeIn'>
                                            {order?.products?.map((product, index) => (
                                                <div key={index} className='flex justify-between  gap-[10px]'>
                                                    <div className='flex gap-[10px]'>
                                                        <img src={product?.image} alt="" className='w-[60px] h-[60px] object-cover rounded-[5px]' />
                                                        <div className='flex flex-col gap-[5px]'>
                                                            <p>{product?.name}</p>
                                                            <p><span className='uppercase'>{product?.size}</span> | {product?.color} | x{product?.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className='text-red-500'>{product?.price}&#8363;</p>
                                                </div>
                                            ))}

                                            <div className='flex justify-between'>
                                                <p>{order?.products.length} sản phẩm</p>
                                                <p>Thành tiền: <span className='text-red-500'>{order?.totalAmount}&#8363;</span></p>
                                            </div>

                                            {order?.paymentCheck ? (
                                                <p className='text-green-500'>Đã thanh toán</p>
                                            ) : (
                                                <p className='text-blue-500'>Chưa thanh toán</p>
                                            )}
                                        </div>
                                    ))}
                                    <div className='flex justify-center mx-auto items-center gap-[10px] my-[40px]'>
                                        <button onClick={handlePreviousPageOrder} disabled={pageOrder === 1}>{`<`}</button>
                                        <p>{userOrderInfo?.currentPage}/{userOrderInfo?.totalPages}</p>
                                        <button onClick={handleNextPageOrder} disabled={userOrderInfo?.currentPage === userOrderInfo?.totalPages}>{`>`}</button>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-[20px] animate__animated animate__fadeInUp'>
                <h3 className='font-semibold text-[16px]'>Detail Reviews </h3>
                <div className='border border-b-[1px] flex flex-col gap-[20px] p-[20px] w-full overflow-x-scroll shadow-md  '>
                    <div className='flex flex-col gap-[20px]'>
                        {!userReview ? (
                            <p>This user dont create any review yet!</p>
                        ) : (
                            <>
                                {
                                    userReview?.map((review, index) => (
                                        <div key={index} className='border shadow-md rounded-[10px] w-full p-[10px] flex flex-col gap-[20px] animate__animated animate__fadeIn'>
                                            <div className='flex gap-[20px]'>
                                                <p>Tên sản phẩm:</p>
                                                <p>{review?.product[0]?.name}</p>
                                            </div>
                                            <div className='flex gap-[20px]'>
                                                <p>Chi tiết: </p>
                                                <p>{review?.order?.products[0]?.color} | {review?.order?.products[0]?.size} | x{review?.order?.products[0]?.quantity}</p>
                                            </div>
                                            <div className='flex gap-[20px]'>
                                                <p>Ngày đặt:</p>
                                                <p>{new Date(review?.order?.createdAt).toLocaleString('en-GB')}</p>
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
                                                <p>{review?.comment}</p>
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
                                    <button onClick={handlePreviousPageReview} disabled={pageReview === 1}>{`<`}</button>
                                    <p>{userReviewInfo?.currentPage}/{userReviewInfo?.totalPages}</p>
                                    <button onClick={handleNextPageReview} disabled={userReviewInfo?.currentPage === userReviewInfo?.totalPages}>{`>`}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EachUser
import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { FaReplyAll } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
// ANIMATE
import 'animate.css';

const Comment = ({ commentInfo, comments, loadingComment, reviewCount, handleFetchComment, totalPage, openReply, setOpenReply, replyCommentIds, setReplyCommentIds, commentId, setCommentId, toggleOpenReply, toggleReply }) => {

    const { currentUser } = useSelector((state) => state.user);

    const roundedRating = Math.round(commentInfo?.averageRating * 2) / 2;
    const [page, setPage] = useState(1);

    const handleNextPage = () => {
        if (page < totalPage) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                handleFetchComment(newPage);
                return newPage;
            });
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => {
                const newPage = prevPage - 1;
                handleFetchComment(newPage);
                return newPage;
            });
        }
    };

    const [text, setText] = useState('');

    const handleChange = (e) => {
        setText(e.target.value);
    }

    const handleReplyComment = async () => {
        const res = await fetch(`/api/review/replyReview/${commentId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text
            })
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
            return;
        } else {
            setText('');
            setOpenReply((prev) => ({ ...prev, [commentId]: false }));
            setShowReply(true);
            handleFetchComment(page);
        }
    }



    return (
        <div className='flex max-md:flex-col max-md:items-center gap-[30px] py-[40px]'>

            {/* DANH GIA SAN PHAM */}
            <div className='w-[300px] h-[300px] flex flex-col justify-center items-center gap-[10px] border p-[10px]  rounded-[10px] bg-gray-100'>
                <p className='uppercase font-semibold text-[20px]'>đánh giá sản phẩm</p>
                <p className='text-[40px] font-semibold'>{commentInfo?.averageRating || 0}</p>
                <div className='flex items-center gap-[5px]'>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                            {roundedRating >= star ? (
                                <StarIcon className=' text-yellow-400' />
                            ) : roundedRating >= star - 0.5 ? (
                                <StarHalfIcon className=' text-yellow-400' />
                            ) : (
                                <StarIcon className=' text-gray-400' />
                            )}
                        </span>
                    ))}
                </div>
                <p className='text-gray-500'>{reviewCount || 0} đánh giá</p>
            </div>

            {/* COMMENTS */}
            <div className='flex-1 w-full h-[400px] overflow-y-scroll hide-scrollbar '>
                {
                    loadingComment ? (
                        <Loader />
                    ) : (
                        <>
                            {
                                !comments ? (
                                    <p className='mt-[20px]'>Chưa có bài đánh giá nào!</p>
                                ) : (
                                    <div className='flex flex-col gap-[20px]'>
                                        <div className='flex flex-wrap max-md:flex-col gap-[20px] w-full animate__animated animate__fadeIn'>
                                            {comments?.map((comment, index) => (
                                                <div key={index} className='flex flex-col h-[220px] overflow-y-scroll border rounded-[10px] p-[10px] items-start max-md:ml-[20px] gap-[10px] w-[500px] max-md:w-full'>
                                                    {
                                                        // this part is for admin reply user comment
                                                        openReply[comment._id] ? (
                                                            <>
                                                                <p className='font-semibold text-[16px]'>{comment?.creator?.username}</p>
                                                                <p>{comment?.comment}</p>
                                                                <div className='flex justify-start items-center gap-[10px]'>
                                                                    <p onClick={() => toggleOpenReply(comment._id)} className='text-[13px] text-gray-500 cursor-pointer hover:text-red-400'>Cancel</p>
                                                                    <div className='flex justify-start items-center gap-[10px] border rounded-[10px] py-[5px] px-[10px]'>
                                                                        <input onChange={handleChange} type="text" value={text} placeholder='Reply...' className='bg-transparent w-[350px]  rounded-[10px]' />
                                                                        <FiSend onClick={() => handleReplyComment()} className='text-[18px] cursor-pointer hover:text-blue-400' />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* star + admin reply  */}
                                                                <div className='flex w-full justify-between items-center gap-[5px]'>
                                                                    <div>
                                                                        {[...Array(5)].map((_, index) => (
                                                                            <StarIcon
                                                                                key={index}
                                                                                className={index < comment?.rating ? 'text-yellow-300' : 'text-gray-300'}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    {
                                                                        currentUser?.isAdmin && (
                                                                            <FaReplyAll onClick={() => { toggleOpenReply(comment._id); setCommentId(comment._id) }} className='text-blue-500 text-[20px] cursor-pointer hover:text-blue-400' />
                                                                        )
                                                                    }
                                                                </div>
                                                                {/* ten */}
                                                                <p className='font-semibold text-[16px]'>{comment?.creator?.username}</p>
                                                                {/* order */}
                                                                <p className='text-[12px] text-gray-400'>
                                                                    {comment?.order?.products[0]?.color}/{comment?.order?.products[0]?.size}/x{comment?.order?.products[0]?.quantity}
                                                                </p>
                                                                {/* comment */}
                                                                <p>{comment?.comment}</p>
                                                                <div>
                                                                    {
                                                                        comment?.image && comment?.image.length > 0 && (
                                                                            <div className='flex w-full overflow-x-scroll gap-[10px] h-[50px]'>
                                                                                {
                                                                                    comment?.image.map((pic, index) => (
                                                                                        <div key={index} className='w-[50px] h-[50px] '>
                                                                                            <img src={pic} alt="" className='w-full h-full object-cover' />
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                                {/* date + click xem phan hoi */}
                                                                <div className='flex justify-between items-center w-full'>
                                                                    <p className='text-[12px] text-gray-400'>{new Date(comment?.createdAt).toLocaleDateString('vi-VN')}</p>
                                                                    <p onClick={() => toggleReply(comment?._id)} className='text-[12px] text-gray-400 cursor-pointer hover:text-black'>
                                                                        {replyCommentIds.includes(comment?._id) ? 'Đóng phản hồi' : 'Xem phản hồi'}
                                                                    </p>
                                                                </div>
                                                                {
                                                                    replyCommentIds.includes(comment._id) && (
                                                                        <>
                                                                            {
                                                                                comment?.reply && comment.reply.length > 0 ? (
                                                                                    <div className='w-full flex flex-col gap-[10px] bg-gray-200 p-[10px]'>
                                                                                        <p className='font-semibold'>Phản hồi của người bán : </p>
                                                                                        <div className='flex flex-col gap-[10px]'>
                                                                                            {
                                                                                                comment?.reply.map((rep, index) => (
                                                                                                    <p key={index} className='text-[13px]'>{rep?.text}</p>
                                                                                                ))
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className='w-full flex flex-col gap-[10px] bg-gray-200 p-[10px]'>
                                                                                        <p>Chưa có phản hồi nào</p>
                                                                                    </div>

                                                                                )
                                                                            }
                                                                        </>
                                                                    )
                                                                }

                                                            </>
                                                        )
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                        <div className='flex justify-center mx-auto items-center gap-[10px] mt-[40px]'>
                                            <button onClick={handlePreviousPage} disabled={page === 1}>{`<`}</button>
                                            <p>{page}/{totalPage}</p>
                                            <button onClick={handleNextPage} disabled={page === totalPage}>{`>`}</button>
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Comment
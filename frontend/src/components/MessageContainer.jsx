import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Skeleton from '@mui/material/Skeleton';

import { IoInformationCircleOutline } from "react-icons/io5";

const MessageContainer = ({ loadingChatBox, selectId, singleChat, singleGroupChat }) => {

    return (
        <div className='w-full'>
            <div className="w-full py-[10px] px-[20px] border-b-[1px] border-gray-900 flex justify-between items-center">
                {
                    loadingChatBox ? (
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-[10px]">
                                <Skeleton sx={{ bgcolor: 'grey.800' }} animation="wave" variant="circular" width={40} height={40} />
                                <Skeleton variant="text" sx={{ fontSize: '1rem', color: 'grey.800' }} />
                            </div>
                            <Skeleton sx={{ bgcolor: 'grey.800' }} animation="wave" variant="circular" width={30} height={30} />
                        </div>
                    ) : (
                        <>
                            {
                                singleGroupChat && Object.keys(singleGroupChat).length > 0 ? (
                                    <>
                                        <div className="flex items-center gap-[10px]">
                                            <img src={singleGroupChat?.groupPhoto} alt="" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                            <p>{singleGroupChat?.chatName}</p>
                                        </div>
                                        <IoInformationCircleOutline className="text-[30px] text-gray-300 hover:text-gray-400 cursor-pointer" />
                                    </>
                                ) : singleChat && Object.keys(singleChat).length > 0 ? (
                                    <>
                                        <div className="flex items-center gap-[10px]">
                                            <img src={singleChat?.receiver?.profilePic} alt="" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                            <p>{singleChat?.receiver?.username}</p>
                                        </div>
                                        <IoInformationCircleOutline className="text-[30px] text-gray-300 hover:text-gray-400 cursor-pointer" />
                                    </>
                                ) : (
                                    <>Chat not found</>
                                )
                            }
                        </>
                    )
                }
            </div>
            MessageContainer
        </div>
    )
}

export default MessageContainer
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ChatInformation from "./ChatInformation";


import { IoMdInformationCircleOutline } from "react-icons/io";
import Skeleton from '@mui/material/Skeleton';

import "animate.css"


const MessageContainer = ({ loadingChatBox, singleChat, singleGroupChat, handleAccessGroupChat, handleFetchAllChats }) => {

    const [openSidebar, setOpenSidebar] = useState(false);


    return (
        <div className='w-full h-screen'>
            {/* TOP BAR */}
            <div className="w-full h-[60px]  py-[10px] px-[20px] border-b-[1px] border-gray-700 flex justify-between items-center">
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
                                        <IoMdInformationCircleOutline onClick={() => setOpenSidebar(!openSidebar)} className="text-[30px] text-gray-300 hover:text-gray-400 cursor-pointer" />
                                    </>
                                ) : singleChat && Object.keys(singleChat).length > 0 ? (
                                    <>
                                        <div className="flex items-center gap-[10px]">
                                            <img src={singleChat?.receiver?.profilePic} alt="" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                            <p>{singleChat?.receiver?.username}</p>
                                        </div>
                                        <IoMdInformationCircleOutline className="text-[30px] text-gray-300 hover:text-gray-400 cursor-pointer" />
                                    </>
                                ) : (
                                    <>Chat not found</>
                                )
                            }
                        </>
                    )
                }
            </div>

            {/* BOX CHAT */}
            <div className="flex">
                <div className={`${openSidebar ? 'w-3/4' : 'w-full'} h-full p-[10px]`}>
                    Messages chat here
                </div>
                {/* SIDEBAR */}
                {openSidebar && (
                    <div className=" w-1/4 animate__animated animate__fadeInRight">
                        <ChatInformation singleGroupChat={singleGroupChat} handleAccessGroupChat={handleAccessGroupChat} handleFetchAllChats={handleFetchAllChats} />
                    </div>
                )}
            </div>




        </div>
    )
}

export default MessageContainer
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Skeleton from '@mui/material/Skeleton';

const MessageBox = ({ currentUser, message }) => {

    const isCurrentUserChat = message?.sender?._id === currentUser._id;

    return (
        <>
            <div className={`flex ${isCurrentUserChat ? 'justify-end' : 'justify-start items-center'} mb-[20px] gap-[10px] `}>
                {
                    !isCurrentUserChat && (
                        <img src={message?.sender?.profilePic} alt="" className="w-[30px] h-[30px] object-cover rounded-[50%]" />
                    )
                }
                <div className={`rounded-[20px] p-[10px] max-w-[60%]  ${isCurrentUserChat ? 'bg-blue-400' : 'bg-[#303030]'}`} style={{
                    wordBreak: 'break-word', // Wrap long words
                    whiteSpace: 'pre-wrap',  // Keep formatting (like newlines)
                }}>
                    {message?.content}
                </div>
            </div>
        </>
    )
}

export default MessageBox
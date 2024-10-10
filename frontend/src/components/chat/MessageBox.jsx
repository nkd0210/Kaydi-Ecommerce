import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';

const MessageBox = ({ currentUser, message, loadingChatBox }) => {

    const isCurrentUserChat = message?.sender?._id === currentUser._id;

    const formatDate = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();

        // check if message is send today
        const isToday =
            messageDate.getDate() === today.getDate() &&
            messageDate.getMonth() === today.getMonth() &&
            messageDate.getFullYear() === today.getFullYear();

        if (isToday) {
            const hours = messageDate.getHours().toString().padStart(2, '0');
            const minutes = messageDate.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else {
            const day = messageDate.getDate().toString().padStart(2, '0');
            const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
            return `${day}/${month}`;
        }
    }


    return (
        <>
            {
                loadingChatBox ? (
                    <>
                    </>
                ) : (
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

                            <Tooltip title={formatDate(message?.createdAt)} placement="right">
                                <span>{message?.content}</span>
                            </Tooltip>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MessageBox
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ChatInformation from "./ChatInformation";
import MessageBox from "./MessageBox";
import { pusherClient } from '../../lib/pusher';

import { IoMdInformationCircleOutline } from "react-icons/io";
import Skeleton from '@mui/material/Skeleton';
import { LuPlusCircle } from "react-icons/lu";
import { BsSendFill } from "react-icons/bs";
import { GrFormPrevious } from "react-icons/gr";


import "animate.css"


const MessageContainer = ({ currentUser, chatId, messages, setMessages, loadingChatBox, setSelectId, openMainSidebar, setOpenMainSidebar, singleChat, singleGroupChat, handleAccessGroupChat, handleFetchAllChats }) => {

    const [openInformationBar, setOpenInformationBar] = useState(false);

    // const chatId = singleChat?.chat?._id || singleGroupChat?._id;

    const [inputMessage, setInputMessage] = useState('');

    const handleChangeInputMessage = (e) => {
        setInputMessage(e.target.value);
    }

    // const fetchAllMessages = async (id) => {
    //     try {
    //         const res = await fetch(`/api/message/getAllMessages/${id}`, {
    //             method: "GET"
    //         });
    //         const data = await res.json();
    //         if (!res.ok) {
    //             console.log(data.message);
    //             return;
    //         } else {
    //             setMessages(data);
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    const handleSendMessage = async () => {
        try {
            const res = await fetch(`/api/message/sendMessage`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatId: chatId,
                    content: inputMessage
                })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setInputMessage('');
                // fetchAllMessages(chatId);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        pusherClient.subscribe(chatId);

        const handleMessage = async (newMessage) => {
            setMessages((prevMessage) => {
                return [...prevMessage, newMessage];
            })
        }

        pusherClient.bind("new-message", handleMessage);

        return () => {
            pusherClient.unsubscribe(chatId);
            pusherClient.unbind("new-message", handleMessage);
        }

    }, [chatId]);

    /* Scrolling down to the bottom when having the new message */
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);


    return (
        <div className='w-full h-screen'>
            {/* TOP BAR */}
            <div className="w-full h-[60px] py-[10px] px-[20px] border-b-[1px] border-[#383939] flex justify-between items-center">
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
                                            {
                                                openMainSidebar == false && (
                                                    <GrFormPrevious onClick={() => { setOpenMainSidebar(true); setSelectId(''); handleFetchAllChats() }} className="text-[26px] cursor-pointer hover:text-blue-400" />
                                                )
                                            }
                                            <img src={singleGroupChat?.groupPhoto} alt="" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                            <p>{singleGroupChat?.chatName}</p>
                                        </div>
                                        <IoMdInformationCircleOutline onClick={() => setOpenInformationBar(!openInformationBar)} className="text-[30px] text-gray-300 hover:text-gray-400 cursor-pointer" />
                                    </>
                                ) : singleChat && Object.keys(singleChat).length > 0 ? (
                                    <>
                                        <div className="flex items-center gap-[10px]">
                                            {
                                                openMainSidebar == false && (
                                                    <GrFormPrevious onClick={() => { setOpenMainSidebar(true); setSelectId(''); handleFetchAllChats() }} className="text-[26px] cursor-pointer hover:text-blue-400" />
                                                )
                                            }
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

                {/* main chat */}
                <div className={`${openInformationBar ? 'w-3/4' : 'w-full'} p-[10px] flex flex-col gap-[10px]  h-[calc(100vh-60px)] overflow-y-scroll`}>
                    <div className="h-[calc(100vh-100px)] overflow-y-scroll p-[10px]" >
                        {
                            messages?.map((message, index) => (
                                <MessageBox key={index} currentUser={currentUser} message={message} loadingChatBox={loadingChatBox} />
                            ))
                        }
                        <div ref={bottomRef} />
                    </div>
                    <div className="flex gap-[10px] items-center">
                        <LuPlusCircle className="text-[26px] text-gray-400 cursor-pointer hover:text-blue-500" />
                        <input
                            onChange={handleChangeInputMessage}
                            value={inputMessage} type="text"
                            placeholder="Aa"
                            className="rounded-[20px] bg-[#3a3b3c] w-full p-[10px]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }} />
                        <BsSendFill onClick={handleSendMessage} className="text-[20px] text-gray-400 cursor-pointer hover:text-blue-500" />
                    </div>
                </div>

                {/* sidebar */}
                {openInformationBar && (
                    <div className=" w-1/4 animate__animated animate__fadeInRight">
                        <ChatInformation singleGroupChat={singleGroupChat} handleAccessGroupChat={handleAccessGroupChat} />
                    </div>
                )}
            </div>


        </div>
    )
}

export default MessageContainer
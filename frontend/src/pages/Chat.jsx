import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BiConversation } from "react-icons/bi";
import { PiNotePencilBold } from "react-icons/pi";

import Loader from '../components/Loader';
import MessageContainer from "../components/chat/MessageContainer";
import SearchChat from "../components/chat/SearchChat";
import CreateGroupChat from "../components/chat/CreateGroupChat";

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";
import Skeleton from '@mui/material/Skeleton';
import "animate.css"
import { pusherClient } from "../lib/pusher";


const Chat = () => {

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [allChats, setAllChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);

    // lay ra tat ca doan chat cua user
    const handleFetchAllChats = async () => {
        setLoadingChats(true);
        try {
            const res = await fetch(`/api/chat/getAllChatsOfUser`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setAllChats(data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingChats(false);
            }, 1000);
        }
    }

    useEffect(() => {
        handleFetchAllChats();
        setSelectId('');
    }, [currentUser]);

    const [selectId, setSelectId] = useState(''); // active doan chat theo id cua receiver hoac cua chatId neu la groupchat

    // handle search
    const [isSearch, setIsSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchUser, setSearchUser] = useState([]); // luu tru cac user khi search
    const [openModal, setOpenModal] = useState(false);
    const [loadingChatBox, setLoadingChatBox] = useState(false);

    const [messages, setMessages] = useState([]);

    const [singleChat, setSingleChat] = useState({});

    const [openMainSidebar, setOpenMainSidebar] = useState(true);

    // access single chat
    const handleAccessChat = async (id) => {
        setLoadingChatBox(true);
        try {
            const res = await fetch(`/api/chat/accessSingleChat`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ receiverId: id })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setSingleChat(data);
                setMessages(data?.chat?.messages);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingChatBox(false);
            }, 1000)
        }
    }

    const [singleGroupChat, setSingleGroupChat] = useState({});

    // access group chat
    const handleAccessGroupChat = async (id) => {
        setLoadingChatBox(true);
        try {
            const res = await fetch(`/api/chat/accessGroupChat/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setSingleGroupChat(data);
                setMessages(data?.messages);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingChatBox(false);
            }, 1000)
        }
    }

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

    const [chatId, setChatId] = useState('');

    useEffect(() => {
        if (currentUser) {
            pusherClient.subscribe(currentUser._id);

            const handleChatUpdate = (updatedChat) => {
                setAllChats((prevChats) => {
                    const chatIndex = prevChats.findIndex(chat => chat._id == updatedChat.id);

                    if (chatIndex !== -1) {

                        const updatedMessages = [
                            ...prevChats[chatIndex].messages,
                            ...updatedChat.messages
                        ];

                        const newChats = [...prevChats];
                        newChats[chatIndex] = {
                            ...newChats[chatIndex],
                            messages: updatedMessages,
                            latestMessage: updatedMessages[updatedMessages.length - 1],
                        };

                        return newChats;
                    } else {
                        return [...prevChats, updatedChat];
                    }
                })
            }

            pusherClient.bind("update-chat", handleChatUpdate);

            return () => {
                pusherClient.unbind("update-chat", handleChatUpdate);
                pusherClient.unsubscribe(currentUser._id);
            }

        }
    }, [currentUser])

    return (
        <div className="bg-[#212121] w-screen h-screen  text-white flex ">

            {/* SIDEBAR */}
            {
                openMainSidebar && (
                    <div className="min-w-[320px] max-md:w-full h-full overflow-y-scroll flex flex-col gap-[20px] bg-[#171717] transition-all duration-300 opacity-100">
                        <div className="flex justify-between p-[20px]">

                            <FaHome
                                onClick={() => navigate(currentUser.isAdmin ? '/admin' : '/')}
                                className="text-[20px] cursor-pointer hover:text-red-300"
                            />
                            <div className="flex items-center gap-[10px]">
                                <img src={currentUser?.profilePic} alt="avatar" className="w-[30px] h-[30px] object-cover rounded-[50%]" />
                                <div onClick={() => setOpenModal(true)} className="border rounded-[50%] w-[30px] h-[30px] flex items-center justify-center bg-[#212121] hover:bg-[#424242] hover:cursor-pointer ">
                                    <PiNotePencilBold className="text-[16px] text-gray-300 cursor-pointer" />
                                </div>
                            </div>

                        </div>

                        {
                            isSearch ? (
                                <SearchChat setMessages={setMessages} setSingleChat={setSingleChat} setSelectId={setSelectId} setIsSearch={setIsSearch} searchKey={searchKey} setSearchKey={setSearchKey} searchUser={searchUser} setSearchUser={setSearchUser} handleFetchAllChats={handleFetchAllChats} setOpenMainSidebar={setOpenMainSidebar} />
                            ) : (
                                <>
                                    <div className="px-[20px]">
                                        <div className="w-full flex gap-[10px] bg-[#2a2a2d] rounded-[20px] px-[10px] py-[5px] justify-start items-center animate__animated animate__fadeIn ">
                                            <CiSearch className="text-[20px]" />
                                            <input type="text" className="bg-transparent w-full" placeholder="Search" onClick={() => setIsSearch(true)} />
                                        </div>
                                    </div>

                                    <div className="flex justify-evenly rounded-[10px] p-[10px]">
                                        <p className="cursor-pointer hover:text-red-300">Active now</p>
                                        <p className="cursor-pointer hover:text-red-300">All</p>
                                    </div>

                                    {/*  HIEN TAT CA DOAN CHAT CUA USER */}
                                    {
                                        loadingChats ? (
                                            <div className="flex flex-col gap-[20px]">
                                                <Skeleton animation="wave" variant="rounded" width={300} height={60} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton animation="wave" variant="rounded" width={300} height={60} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton animation="wave" variant="rounded" width={300} height={60} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton animation="wave" variant="rounded" width={300} height={60} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton animation="wave" variant="rounded" width={300} height={60} sx={{ bgcolor: 'grey.900' }} />
                                            </div>
                                        ) : (
                                            <div className="animate__animated animate__fadeIn">
                                                {
                                                    Array.isArray(allChats) && allChats.length === 0 ? (
                                                        <p className="text-center text-red-200">No chat found!</p>
                                                    ) : (
                                                        <>
                                                            {
                                                                Array.isArray(allChats) && allChats?.map((chat, index) => (
                                                                    <div key={index} className="">
                                                                        {/* if is group chat, access group chat through chat id */}
                                                                        {chat.isGroupChat ? (
                                                                            <div onClick={() => { setSelectId(chat?._id); setChatId(chat?._id); setOpenMainSidebar(false); handleAccessGroupChat(chat?._id); setSingleChat({}) }} className={`flex justify-between items-center w-full py-[20px] border-b-[1px] h-[80px] border-gray-600 cursor-pointer hover:bg-[#292929] ${selectId === chat?._id ? 'bg-gray-800' : ''}  `} >
                                                                                <div className="flex items-center gap-[20px] pl-[20px]">
                                                                                    <div className="w-[50px]">
                                                                                        <img key={index} src={chat?.groupPhoto} alt="ava" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                                                                    </div>
                                                                                    <div className="flex flex-col gap-[5px]">
                                                                                        <p className="text-[13px]">{chat?.chatName}</p>
                                                                                        {

                                                                                            chat?.latestMessage ? (
                                                                                                <p className={`text-[11px] w-[150px] truncate ${chat?.latestMessage?.seenBy.find((member) => member === currentUser._id) ? 'text-gray-300' : 'font-semibold'} `}>{chat?.latestMessage?.content}</p>
                                                                                            ) : (
                                                                                                <p className="text-[11px] font-bold">Start a chat now</p>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    chat?.latestMessageAt ? (
                                                                                        <p className="text-[11px] pr-[20px]">{formatDate(chat?.latestMessageAt)}</p>
                                                                                    ) : (
                                                                                        <p className="text-[11px] pr-[20px]">Now</p>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        ) : (
                                                                            // if is single chat, access chat through receiver id
                                                                            <div onClick={() => { setSelectId(chat?.receiver[0]?._id); setChatId(chat?._id); setOpenMainSidebar(false); handleAccessChat(chat?.receiver[0]?._id); setSingleGroupChat({}) }} className={`flex justify-between items-center w-full py-[20px] border-b-[1px] h-[80px] border-gray-600 cursor-pointer hover:bg-[#292929] ${selectId === chat?.receiver[0]?._id ? 'bg-gray-800' : ''}`} >
                                                                                <div className="flex items-center gap-[20px] pl-[20px]">
                                                                                    <div className="w-[50px]">
                                                                                        <img key={index} src={chat?.receiver[0]?.profilePic} alt="ava" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                                                                    </div>
                                                                                    <div className="flex flex-col gap-[5px]">
                                                                                        <p className="text-[13px]">{chat?.receiver[0]?.username}</p>
                                                                                        {
                                                                                            chat?.latestMessage ? (
                                                                                                <p className={`text-[11px] w-[150px] truncate ${chat?.latestMessage?.seenBy.find((member) => member === currentUser._id) ? 'text-gray-300' : 'font-semibold'} `}>{chat?.latestMessage?.content}</p>
                                                                                            ) : (
                                                                                                <p className="text-[11px] font-bold">Start a chat now</p>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    chat?.latestMessageAt ? (
                                                                                        <p className="text-[11px] pr-[20px]">{formatDate(chat?.latestMessageAt)}</p>
                                                                                    ) : (
                                                                                        <p className="text-[11px] pr-[20px]">Now</p>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

                                </>
                            )
                        }

                    </div>
                )
            }


            {/* CHAT BOX */}

            {
                !selectId || isSearch ? (
                    <div className="flex-1 max-md:hidden flex-col gap-[20px] p-[20px] bg-[#212121] flex justify-center items-center">
                        <BiConversation className="text-[50px] text-gray-400" />
                        <p className="text-[20px] text-gray-400">
                            Select conversation to start messaging
                        </p>
                    </div>
                ) : (
                    <MessageContainer
                        currentUser={currentUser}
                        chatId={chatId}
                        messages={messages}
                        setMessages={setMessages}
                        loadingChatBox={loadingChatBox}
                        setSelectId={setSelectId}
                        openMainSidebar={openMainSidebar}
                        setOpenMainSidebar={setOpenMainSidebar}
                        singleChat={singleChat}
                        singleGroupChat={singleGroupChat}
                        handleAccessGroupChat={handleAccessGroupChat}
                        handleFetchAllChats={handleFetchAllChats}
                    />
                )
            }


            {/* Create Group Chat */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[500px] bg-[#232323] text-black h-[400px] overflow-hidden overflow-y-scroll max-md:h-[200px] rounded-[10px]'>
                    <CreateGroupChat setOpenModal={setOpenModal} setSingleGroupChat={setSingleGroupChat} handleFetchAllChats={handleFetchAllChats} setSelectId={setSelectId} setLoadingChatBox={setLoadingChatBox} />
                </div>
            </Modal>

        </div >
    )
}

export default Chat
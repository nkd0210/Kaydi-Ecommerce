import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { BiConversation } from "react-icons/bi";
import { PiNotePencilBold } from "react-icons/pi";

import Loader from '../components/Loader';
import MessageContainer from "../components/MessageContainer";
import SearchChat from "../components/SearchChat";

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";
import Skeleton from '@mui/material/Skeleton';

import "animate.css"


const Chat = () => {

    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [allChats, setAllChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(false);
    const [singleChat, setSingleChat] = useState({});
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
            setLoadingChats(false);
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
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingChatBox(false);
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
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingChatBox(false);
        }
    }

    return (
        <div className="bg-[#212121] w-screen h-screen text-white flex ">

            {/* SIDEBAR */}
            <div className="min-w-[320px] flex flex-col gap-[20px]  bg-[#171717]">
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
                        <SearchChat setSingleChat={setSingleChat} setSelectId={setSelectId} setIsSearch={setIsSearch} searchKey={searchKey} setSearchKey={setSearchKey} searchUser={searchUser} setSearchUser={setSearchUser} handleFetchAllChats={handleFetchAllChats} />
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
                                        <Skeleton variant="rounded" width={300} height={80} />
                                        <Skeleton variant="rounded" width={300} height={80} />
                                        <Skeleton variant="rounded" width={300} height={80} />
                                        <Skeleton variant="rounded" width={300} height={80} />
                                        <Skeleton variant="rounded" width={300} height={80} />
                                    </div>
                                ) : (
                                    <div className="animate__animated animate__fadeIn">
                                        {
                                            allChats.length === 0 ? (
                                                <p className="text-center text-red-200">No chat found!</p>
                                            ) : (
                                                <>
                                                    {
                                                        allChats?.map((chat, index) => (
                                                            <div key={index} className="">
                                                                {/* if is group chat, access group chat through chat id */}
                                                                {chat.isGroupChat ? (
                                                                    <div onClick={() => { setSelectId(chat?._id); handleAccessGroupChat(chat?._id); setSingleChat({}) }} className={`flex justify-between items-center w-full py-[20px] border-b-[1px] h-[80px] border-gray-600 cursor-pointer hover:bg-gray-800 ${selectId === chat?._id ? 'bg-gray-800' : ''}  `} >
                                                                        <div className="flex items-center gap-[20px] pl-[20px]">
                                                                            <div className="w-[50px]">
                                                                                <img key={index} src={chat?.groupPhoto} alt="ava" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <p className="text-[12px]">{chat?.chatName}</p>
                                                                                <p className="text-[12px]">chat</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[12px] pr-[20px]">Now</p>
                                                                    </div>
                                                                ) : (
                                                                    // if is single chat, access chat through receiver id
                                                                    <div onClick={() => { setSelectId(chat?.receiver[0]?._id), handleAccessChat(chat?.receiver[0]?._id); setSingleGroupChat({}) }} className={`flex justify-between items-center w-full py-[20px] border-b-[1px] h-[80px] border-gray-600 cursor-pointer hover:bg-gray-800 ${selectId === chat?.receiver[0]?._id ? 'bg-gray-800' : ''}`} >
                                                                        <div className="flex items-center gap-[20px] pl-[20px]">
                                                                            <div className="w-[50px]">
                                                                                <img key={index} src={chat?.receiver[0]?.profilePic} alt="ava" className="w-[40px] h-[40px] object-cover rounded-[50%]" />
                                                                            </div>
                                                                            <div className="flex flex-col">
                                                                                <p className="text-[12px]">{chat?.receiver[0]?.username}</p>
                                                                                <p className="text-[12px]">chat</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[12px] pr-[20px]">Now</p>
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

            {/* CHAT BOX */}

            {
                !selectId || isSearch ? (
                    <div className="flex-1 flex-col gap-[20px] p-[20px] bg-[#212121] flex justify-center items-center">
                        <BiConversation className="text-[50px] text-gray-400" />
                        <p className="text-[20px] text-gray-400">
                            Select conversation to start messaging
                        </p>
                    </div>
                ) : (
                    <MessageContainer loadingChatBox={loadingChatBox} selectId={selectId} singleChat={singleChat} singleGroupChat={singleGroupChat} />
                )
            }


            {/* Create Group Chat */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] bg-gray-200 text-black h-[200px] max-md:h-[200px] rounded-[20px] flex flex-col gap-[20px] justify-center items-center '>
                    <IoIosCloseCircleOutline onClick={() => setOpenModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />

                </div>
            </Modal>

        </div >
    )
}

export default Chat
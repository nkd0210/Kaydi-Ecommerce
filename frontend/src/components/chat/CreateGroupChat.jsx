import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Loader from "../Loader";

import { CiSearch } from "react-icons/ci";
import Skeleton from '@mui/material/Skeleton';
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

const CreateGroupChat = ({ setOpenModal, setSingleGroupChat, handleFetchAllChats, setSelectId, setChatId, setLoadingChatBox, setOpenMainSidebar }) => {

    const [allUsers, setAllUsers] = useState([]);
    const [loadingAllUser, setLoadingAllUser] = useState(false);

    const getAllUsersToChat = async () => {
        setLoadingAllUser(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/getAllUsersToChat`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setAllUsers(data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingAllUser(false);
            }, 1000);
        }
    }

    useEffect(() => {
        getAllUsersToChat();
    }, []);


    const [selectedUser, setSelectedUser] = useState([]);

    const handleToggleUser = (user) => {
        setSelectedUser((prevSelectedUser) => {
            const isUserSelected = prevSelectedUser.some((selected) => selected._id === user._id);
            if (isUserSelected) {
                // Remove the user if already selected
                return prevSelectedUser.filter((selected) => selected._id !== user._id);
            } else {
                // Add the user if not selected
                return [...prevSelectedUser, user];
            }
        });
    };

    const removeUser = (user) => {
        setSelectedUser((prevSelectedUser) => prevSelectedUser.filter((selected) => selected._id !== user._id));
    }

    const [isSearch, setIsSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchUser, setSearchUser] = useState([]);

    const handleChange = (e) => {
        setSearchKey(e.target.value);
    }

    const handleSearch = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/user/searchUser?search=${searchKey}`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setSearchUser(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (searchKey) {
            handleSearch();
            setIsSearch(true);
        } else {
            setSearchUser([]);
            setIsSearch(false);
        }
    }, [searchKey]);

    // FORM CREATE GROUP CHAT

    const [groupName, setGroupName] = useState('');

    const handleChangeGroupName = (e) => {
        setGroupName(e.target.value);
    }

    const [memberIds, setMemberIds] = useState([]);

    useEffect(() => {
        setMemberIds(selectedUser.map((user) => user._id));
    }, [selectedUser]);

    const [loadingCreateGroupChat, setLoadingCreateGroupChat] = useState(false);

    const handleCreateGroupChat = async (e) => {
        e.preventDefault();
        setLoadingCreateGroupChat(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/chat/createGroupChat`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chatName: groupName,
                    memberIds: memberIds
                }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setSingleGroupChat(data);
                setOpenMainSidebar(false);
                setSelectId(data._id);
                setChatId(data._id);
                setOpenModal(false);
                // handleFetchAllChats();
                setLoadingChatBox(true);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingCreateGroupChat(false);
                setLoadingChatBox(false);
            }, 1000);
        }
    };


    return (
        <>
            {
                loadingCreateGroupChat ? (
                    <Loader />
                ) : (
                    <div className="p-[20px] flex flex-col gap-[20px] ">
                        <div className="flex justify-between">
                            <p onClick={() => setOpenModal(false)} className={`text-blue-400 cursor-pointer hover:text-opacity-75 `}>Hủy</p>
                            <h2 className="text-white">Nhóm mới</h2>
                            <button disabled={groupName.length === 0 && selectedUser.length === 0} onClick={handleCreateGroupChat} className={`text-blue-400 cursor-pointer hover:text-opacity-75 ${groupName.length > 0 && selectedUser.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}>Tạo</button>
                        </div>
                        <input onChange={handleChangeGroupName} value={groupName} type="text" placeholder="Tên nhóm" className="bg-transparent text-white" />
                        <div className="w-full flex gap-[10px] bg-[#2a2a2d] rounded-[10px] px-[10px] py-[10px] justify-start items-center animate__animated animate__fadeIn ">
                            <CiSearch className="text-[20px] text-gray-500" />
                            <input onChange={handleChange} value={searchKey} type="text" className="bg-transparent w-full text-white" placeholder="Tìm kiếm" />
                        </div>

                        {
                            selectedUser && (
                                <div className="flex gap-[10px] max-w-full overflow-x-scroll">
                                    {
                                        selectedUser?.map((user, index) => (
                                            <div key={index} className="relative">
                                                <div className=" flex flex-col gap-[5px] items-center text-white">
                                                    <img src={user?.profilePic} alt="ava" className="w-[30px] h-[30px] object-cover rounded-[50%]" />
                                                    <p className="text-[10px]">{user?.username}</p>
                                                </div>
                                                <IoCloseCircleOutline onClick={() => removeUser(user)} className="absolute top-0 right-0 text-white bg-gray-800 rounded-[50%] text-[16px] cursor-pointer" />
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }

                        <p className="text-[12px] text-gray-400">Gợi ý</p>

                        {
                            isSearch ? (
                                <>
                                    {
                                        Array.isArray(searchUser) && searchUser.length === 0 ? (
                                            <></>
                                        ) : (
                                            <>
                                                {Array.isArray(searchUser) && searchUser.map((user, index) => (
                                                    <div onClick={() => handleToggleUser(user)} key={index} className={`flex gap-[10px] items-center text-white justify-start cursor-pointer hover:bg-[#292929] p-[10px] rounded-[10px] ${selectedUser.some((selected) => selected._id === user._id) ? 'bg-[#292929]' : ''} `}>
                                                        <img src={user?.profilePic} alt="ava" className="w-[30px] h-[30px] object-cover rounded-[50%]" />
                                                        <p className="text-[14px]">{user?.username}</p>
                                                    </div>
                                                ))}
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    {
                                        loadingAllUser ? (
                                            <div className="flex flex-col gap-[20px] ">
                                                <Skeleton variant="rounded" width={450} height={40} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton variant="rounded" width={450} height={40} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton variant="rounded" width={450} height={40} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton variant="rounded" width={450} height={40} sx={{ bgcolor: 'grey.900' }} />
                                                <Skeleton variant="rounded" width={450} height={40} sx={{ bgcolor: 'grey.900' }} />
                                            </div>
                                        ) : (
                                            <>
                                                {allUsers?.map((user, index) => (
                                                    <div onClick={() => handleToggleUser(user)} key={index} className={`flex gap-[10px] items-center text-white justify-start cursor-pointer hover:bg-[#292929] p-[10px] rounded-[10px] ${selectedUser.some((selected) => selected._id === user._id) ? 'bg-[#292929]' : ''} `}>
                                                        <img src={user?.profilePic} alt="ava" className="w-[30px] h-[30px] object-cover rounded-[50%]" />
                                                        <p className="text-[14px]">{user?.username}</p>
                                                    </div>
                                                ))}
                                            </>
                                        )
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

export default CreateGroupChat
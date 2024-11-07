import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IoMdAddCircleOutline } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";

const SearchChat = ({ setMessages, setSingleChat, setSelectId, setChatId, setIsSearch, searchKey, setSearchKey, searchUser, setSearchUser, setOpenMainSidebar }) => {

    const handleChange = (e) => {
        setSearchKey(e.target.value);
    }

    const handleSearch = async () => {
        try {
            const res = await fetch(`/api/user/searchUser?search=${searchKey}`, {
                method: "GET"
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
        } else {
            setSearchUser([]);
        }
    }, [searchKey]);

    const handleAccessSearchResultChat = async (id) => {
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
                setIsSearch(false);
                setSingleChat(data);
                setChatId(data.chat._id);
                setOpenMainSidebar(false);
                setMessages(data?.chat?.messages);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleClickSearchResultChat = (id) => {
        setSelectId(id);
        handleAccessSearchResultChat(id);
    }

    return (
        <div className="flex flex-col gap-[20px] px-[20px]">
            <div className="flex items-center gap-[10px]">
                <IoArrowBackOutline onClick={() => setIsSearch(false)} className="text-[20px] hover:rounded-[50%] hover:bg-[#424242] hover:cursor-pointer w-[30px] h-[30px] p-[5px] animate__animated animate__fadeIn" />
                <div className="flex gap-[10px] bg-[#2a2a2d] rounded-[20px] px-[10px] py-[5px] justify-center items-center w-full ">
                    <CiSearch className="text-[20px]" />
                    <input autoFocus onChange={handleChange} value={searchKey} type="text" className="bg-transparent w-full" placeholder="Search" />
                </div>
            </div>
            {
                searchKey && (
                    <p className=" flex justify-start text-[12px] text-gray-400">Tìm kiếm tin nhắn cho {searchKey}</p>
                )
            }
            <div className="flex flex-col gap-[20px]">

                {
                    Array.isArray(searchUser) && searchUser.length === 0 ? (
                        <></>
                    ) : (
                        <>
                            {Array.isArray(searchUser) && searchUser.map((user, index) => (
                                <div onClick={() => handleClickSearchResultChat(user?._id)} key={index} className="flex items-center justify-start gap-[10px] cursor-pointer hover:bg-gray-800 p-[10px] rounded-[5px]">
                                    <img src={user?.profilePic} alt="ava" className="w-[30px] h-[30px] object-cover rounded-[50%]" />
                                    <p className="text-[14px]">{user?.username}</p>
                                </div>
                            ))}
                        </>
                    )
                }

            </div>
        </div>
    )
}

export default SearchChat
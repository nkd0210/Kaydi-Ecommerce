import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { FaPen } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonRemove } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CiImageOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import Skeleton from '@mui/material/Skeleton';
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

import Modal from '@mui/material/Modal';

import { BiTrash } from 'react-icons/bi';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { app } from '../../firebase';

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import 'animate.css';

const ChatInformation = ({ singleGroupChat, handleAccessGroupChat, handleAccessChat, setOpenInformationBar }) => {

    const { currentUser } = useSelector((state) => state.user);

    // change info like name or photo
    const [openOptionChat, setOpenOptionChat] = useState(false);
    const [openListMember, setOpenListMember] = useState(false);
    const [openUser, setOpenUser] = useState('');

    const toggleUser = (index) => {
        if (openUser === index) {
            setOpenUser('');
        } else {
            setOpenUser(index);
        }
    }

    const [openModalName, setOpenModalName] = useState(false);
    const [openModalImage, setOpenModalImage] = useState(false);

    const [chatName, setChatName] = useState('');
    const [groupImage, setGroupImage] = useState('');

    useEffect(() => {
        if (singleGroupChat) {
            setChatName(singleGroupChat.chatName);
            setGroupImage(singleGroupChat.groupPhoto);
        }
    }, [singleGroupChat])

    const handleChangeChatName = (e) => {
        setChatName(e.target.value);
    }

    // handle upload and remove image
    const fileRef = useRef(null);
    const [formDataImage, setFormDataImage] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [imageToDelete, setImageToDelete] = useState([]); // Track images to delete
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const handleFileUploadImage = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB)');
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setFormDataImage(downloadURL)
                    })
                console.log("Image upload completed")
            }
        )
    }

    const handleRemovePhoto = (imageToDelete) => {
        setImageToDelete([imageToDelete]);
        setGroupImage('');
    }

    const handleClickSave = async () => {
        setUploadSuccess(true);
        try {
            const storage = getStorage(app);
            const deletePromises = imageToDelete.map((url) => {
                const imageRef = ref(storage, url);
                return deleteObject(imageRef)
            })
            await Promise.all(deletePromises);
            setImageToDelete([]);
        } catch (error) {
            console.log("Cant find the photo in the firebase ", error);
        }
        await handleFileUploadImage(groupImage);
    }

    const [isEditting, setIsEditting] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleUpdateGroupInformation = async () => {
        setLoadingUpdate(true);

        const updateGroupChatForm = {};
        if (chatName) updateGroupChatForm.chatName = chatName;
        if (formDataImage.length > 0) updateGroupChatForm.groupPhoto = formDataImage;

        try {
            const res = await fetch(`/api/chat/updateGroupChat/${singleGroupChat?._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateGroupChatForm)
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOpenModalName(false);
                setOpenModalImage(false);
                handleAccessGroupChat(singleGroupChat._id);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingUpdate(false);
        }
    }

    //add or remove people

    const [openModalAdd, setOpenModalAdd] = useState(false);

    const [allUsers, setAllUsers] = useState([]);
    const [loadingAllUser, setLoadingAllUser] = useState(false);

    const getAllUsersToChat = async () => {
        setLoadingAllUser(true);
        try {
            const res = await fetch(`/api/user/getAllUsersToChat`, {
                method: "GET"
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
            setIsSearch(true);
        } else {
            setSearchUser([]);
            setIsSearch(false);
        }
    }, [searchKey]);

    const handleAddPeople = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            const res = await fetch(`/api/chat/addToGroupChat/${singleGroupChat._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: selectedUser })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOpenModalAdd(false);
                handleAccessGroupChat(singleGroupChat._id);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingUpdate(false);
        }
    }

    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectUserDeleted, setSelectUserDeleted] = useState('');

    const handleRemovePeople = async (e) => {
        setLoadingUpdate(true);
        try {
            const res = await fetch(`/api/chat/removeFromGroupChat/${singleGroupChat._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userDeletedId: selectUserDeleted })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOpenUser('');
                setOpenModalDelete(false);
                handleAccessGroupChat(singleGroupChat._id);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingUpdate(false);
        }
    }

    return (
        <div className='flex flex-col gap-[20px] p-[20px] border-l-[1px] border-[#383939] h-[calc(100vh-60px)] overflow-y-scroll '>
            <div className='flex flex-col gap-[10px] items-center justify-center'>
                <img src={singleGroupChat?.groupPhoto} alt="" className='w-[60px] h-[60px] rounded-[50%] object-cover' />
                <p className='font-semibold text-[14px]'>{singleGroupChat?.chatName}</p>
            </div>
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-[14px]'>Tùy chỉnh đoạn chat</p>
                {
                    openOptionChat ? (
                        <IoIosArrowUp onClick={() => setOpenOptionChat(false)} className="cursor-pointer " />
                    ) : (
                        <IoIosArrowDown onClick={() => setOpenOptionChat(true)} className="cursor-pointer " />
                    )
                }
            </div>
            {
                openOptionChat && (
                    <div className="flex flex-col gap-[20px] text-[13px]">
                        <div onClick={() => setOpenModalName(true)} className="flex justify-start items-center gap-[10px] cursor-pointer hover:text-gray-300">
                            <FaPen />
                            <p>Đổi tên đoạn chat</p>
                        </div>
                        <div onClick={() => setOpenModalImage(true)} className="flex justify-start items-center gap-[10px] cursor-pointer hover:text-gray-300">
                            <IoIosImages />
                            <p>Thay đổi ảnh</p>
                        </div>
                    </div>
                )
            }
            <div className='flex justify-between items-center'>
                <p className='font-semibold text-[14px]'>Thành viên trong đoạn chat</p>
                {
                    openListMember ? (
                        <IoIosArrowUp onClick={() => setOpenListMember(false)} className="cursor-pointer " />
                    ) : (
                        <IoIosArrowDown onClick={() => setOpenListMember(true)} className="cursor-pointer " />
                    )
                }
            </div>
            {
                openListMember && (
                    <div className="flex flex-col gap-[20px] text-[13px]">
                        {
                            singleGroupChat?.members.map((user, index) => (
                                <div key={index} className="relative flex justify-between items-center gap-[10px]">
                                    <div className="flex items-center gap-[10px]">
                                        <img src={user?.profilePic} alt="" className="w-[35px] h-[35px] rounded-[50%] object-cover" />
                                        <p>{user?.username}</p>
                                    </div>

                                    <BsThreeDots onClick={() => { toggleUser(index); setSelectUserDeleted(user._id) }} className="cursor-pointer hover:text-gray-300" />
                                    {
                                        openUser === index && user._id !== currentUser._id && (
                                            <div className="absolute bottom-[-80px] right-[12px] w-[180px] border-black rounded-[10px] shadow-lg h-[80px] z-10 bg-[#303030] flex flex-col gap-[10px] p-[10px]">
                                                <div onClick={() => { handleAccessChat(user._id); setOpenInformationBar(false) }} className="flex justify-start items-center gap-[10px] cursor-pointer">
                                                    <BiMessageRounded />
                                                    <p>Nhắn tin</p>
                                                </div>
                                                <div onClick={() => setOpenModalDelete(true)} className="flex justify-start items-center gap-[10px] cursor-pointer">
                                                    <IoPersonRemove />
                                                    <p>Xóa khỏi nhóm</p>
                                                </div>
                                            </div>
                                        )
                                    }

                                </div>
                            ))
                        }
                        <div onClick={() => setOpenModalAdd(true)} className="flex items-center gap-[10px]  cursor-pointer hover:text-gray-300">
                            <IoPersonAddSharp className="text-[16px]" />
                            <p>Thêm người</p>
                        </div>
                    </div>
                )
            }

            {/* MODAL NAME */}
            <Modal open={openModalName} onClose={() => setOpenModalName(false)}>

                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] text-white p-[20px] bg-[#232323] h-[250px] overflow-hidden overflow-y-scroll max-md:h-[200px] rounded-[10px]'>
                    {
                        loadingUpdate ? (
                            <div className="flex justify-center items-center">
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                                    <CircularProgress color="secondary" />
                                </Stack>
                            </div>
                        ) : (
                            <>
                                <IoIosCloseCircleOutline onClick={() => setOpenModalName(false)} className='absolute top-[10px] right-[10px] text-[30px] text-gray-500 cursor-pointer hover:text-red-[400]' />
                                {/* name */}
                                <h3 className="text-[16px] font-semibold text-center">Đổi tên đoạn chat</h3>
                                <div className="flex flex-col gap-[10px] mt-[20px]">
                                    <p className="text-[13px]">Mọi người đều biết khi thông tin nhóm chat thay đổi.</p>
                                    <div className="border border-gray-400 p-[10px] bg-transparent flex flex-col gap-[5px]">
                                        <p className="text-[13px] text-gray-400">Tên đoạn chat</p>
                                        <input onChange={handleChangeChatName} type="text" className="bg-transparent w-full" value={chatName} />
                                    </div>
                                    <div className="flex justify-end items-center gap-[20px]">
                                        <div onClick={() => setOpenModalName(false)} className="text-blue-400 cursor-pointer hover:text-opacity-70">Hủy</div>
                                        <div onClick={handleUpdateGroupInformation} className="rounded-[5px] py-[10px] px-[20px] bg-[#303030] cursor-pointer text-gray-400 hover:bg-[#444444] hover:text-white ">Lưu</div>
                                    </div>
                                </div>
                            </>
                        )
                    }

                </div>

            </Modal>

            {/* MODAL IMAGE */}
            <Modal open={openModalImage} onClose={() => setOpenModalImage(false)}>
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] text-white p-[20px] bg-[#232323] h-[300px] overflow-hidden overflow-y-scroll max-md:h-[200px] rounded-[10px]'>
                    {
                        loadingUpdate ? (
                            <div className="flex justify-center items-center">
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                                    <CircularProgress color="secondary" />
                                </Stack>
                            </div>
                        ) : (
                            <>
                                <IoIosCloseCircleOutline onClick={() => setOpenModalImage(false)} className='absolute top-[10px] right-[10px] text-[30px] text-gray-500 cursor-pointer hover:text-red-[400]' />

                                {/* chat photo */}
                                <h3 className="text-[16px] font-semibold text-center">Đổi ảnh đoạn chat</h3>

                                <div className="flex flex-col gap-[10px] mt-[20px]">
                                    <p className="text-[13px] text-gray-400">Ảnh đoạn chat</p>

                                    <div className=" relative w-[120px] h-[120px] p-[5px] border border-gray-400">
                                        {
                                            isEditting ? (
                                                <>
                                                    {
                                                        groupImage ? (
                                                            <img src={typeof groupImage === 'string' ? groupImage : URL.createObjectURL(groupImage)} alt="" className="w-full h-full object-cover rounded-[5px]" />
                                                        ) : (
                                                            <>
                                                                <input onChange={(e) => setGroupImage(e.target.files[0])} type="file" multiple className="hidden" accept="image/*" ref={fileRef} />
                                                                <CiImageOn className='text-[30px] cursor-pointer' onClick={() => fileRef.current.click()} />
                                                            </>
                                                        )
                                                    }
                                                    <BiTrash onClick={() => handleRemovePhoto(groupImage)} className="absolute top-[5px] right-[5px] cursor-pointer text-black hover:text-red-400 text-[20px]" />
                                                </>
                                            ) : (
                                                <>
                                                    <img src={groupImage} alt="" className="w-full h-full object-cover rounded-[5px]" />
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className="flex items-center justify-start gap-[20px] ml-[20px]">
                                        {
                                            isEditting ? (
                                                <div onClick={() => { setIsEditting(false); setImageToDelete([]); setGroupImage(singleGroupChat?.groupPhoto) }} className="cursor-pointer text-gray-300 hover:text-white">Hủy</div>
                                            ) : (
                                                <div onClick={() => setIsEditting(true)} className="cursor-pointer text-gray-300 hover:text-white">Sửa</div>
                                            )
                                        }
                                        <div onClick={handleClickSave} className="cursor-pointer text-gray-300 hover:text-white">Lưu</div>
                                    </div>

                                    <div className="flex justify-end items-center gap-[20px]">
                                        <div onClick={() => setOpenModalImage(false)} className="text-blue-400 cursor-pointer hover:text-opacity-70">Hủy</div>
                                        <div onClick={handleUpdateGroupInformation} className="rounded-[5px] py-[10px] px-[20px] bg-[#303030] cursor-pointer text-gray-400 hover:bg-[#444444] hover:text-white ">Lưu</div>
                                    </div>
                                </div>
                            </>
                        )
                    }





                </div>
            </Modal>

            {/* MODAL ADD */}
            <Modal open={openModalAdd} onClose={() => setOpenModalAdd(false)}>

                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] text-white p-[20px] bg-[#232323] max-h-[600px] overflow-hidden overflow-y-scroll max-md:h-[200px] rounded-[10px]'>
                    {
                        loadingUpdate ? (
                            <div className="flex justify-center items-center">
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                                    <CircularProgress color="secondary" />
                                </Stack>
                            </div>
                        ) : (
                            <>
                                <IoIosCloseCircleOutline onClick={() => setOpenModalAdd(false)} className='absolute top-[10px] right-[10px] text-[30px] text-gray-500 cursor-pointer hover:text-red-[400]' />
                                {/* name */}
                                <h3 className="text-[16px] font-semibold text-center">Thêm người</h3>
                                <div className="flex flex-col gap-[10px] mt-[20px]">
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
                                            <div className="h-[200px] overflow-y-scroll">
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
                                            </div>
                                        ) : (
                                            <div className="h-[200px] overflow-y-scroll">
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
                                            </div>
                                        )
                                    }
                                    <button onClick={handleAddPeople} disabled={selectedUser.length === 0} className={`flex justify-center items-center gap-[10px] w-full rounded-[5px] p-[10px]  ${selectedUser.length > 0 ? 'cursor-pointer bg-gray-700' : 'cursor-not-allowed bg-[#3a3b3c] text-gray-400'}`}>
                                        <IoPersonAddSharp className="text-[16px]" />
                                        <p>Thêm người</p>
                                    </button>
                                </div>
                            </>
                        )
                    }

                </div>

            </Modal>

            {/* MODAL DELETE */}
            <Modal open={openModalDelete} onClose={() => setOpenModalDelete(false)}>

                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] text-white p-[20px] bg-[#232323] max-h-[600px] overflow-hidden overflow-y-scroll max-md:h-[200px] rounded-[10px]'>
                    {
                        loadingUpdate ? (
                            <div className="flex justify-center items-center">
                                <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                                    <CircularProgress color="secondary" />
                                </Stack>
                            </div>
                        ) : (
                            <>
                                <IoIosCloseCircleOutline onClick={() => setOpenModalDelete(false)} className='absolute top-[10px] right-[10px] text-[30px] text-gray-500 cursor-pointer hover:text-red-[400]' />
                                {/* name */}
                                <h3 className="text-[16px] font-semibold text-center">Xóa khỏi đoạn chat</h3>

                                <p className="text-[13px] mt-[30px]"> Bạn có chắc chắn muốn xóa người này khỏi cuộc trò chuyện không? Họ sẽ không thể gửi hay nhận được tin nhắn mới nữa.</p>

                                <div className="flex justify-center items-center w-full gap-[10px] mt-[20px]">
                                    <div onClick={() => setOpenModalDelete(false)} className="w-1/2 rounded-[5px] text-center cursor-pointer hover:bg-opacity-70  p-[10px] bg-[#3a3b3c]">Hủy</div>
                                    <div onClick={handleRemovePeople} className="w-1/2 rounded-[5px] text-center cursor-pointer hover:bg-opacity-70  p-[10px] bg-gray-700">Xóa khỏi đoạn chat</div>
                                </div>
                            </>
                        )
                    }

                </div>

            </Modal>

        </div>
    )
}

export default ChatInformation
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useRef } from 'react';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

import { FaRegUser } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";

import "animate.css"

const Account = () => {
    const { currentUser } = useSelector((state) => state.user);

    const [updateAccount, setUpdateAccount] = useState(false);
    const [updateAuth, setUpdateAuth] = useState(false);

    // select date for date or birth
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (newValue) => {
        setSelectedDate(newValue);
    };

    // update account function
    const [formAccount, setFormAccount] = useState({});

    const dispatch = useDispatch();

    const handleChange = (e) => {
        e.preventDefault();
        setFormAccount({ ...formAccount, [e.target.id]: e.target.value });
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const submitFormAccount = async (e) => {
        e.preventDefault();
        if (!formAccount.username && !formAccount.phoneNumber && !formAccount.gender && !formDataImage && !selectedDate) {
            handleShowErrorMessage("Vui lòng nhập thông tin cần cập nhật");
            return;
        }
        const formData = {
            username: formAccount.username,
            phoneNumber: formAccount.phoneNumber,
            gender: formAccount.gender,
            dateOfBirth: selectedDate?.format('DD/MM/YYYY'),
            profilePic: formDataImage
        };
        dispatch(updateStart());
        try {
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                handleShowErrorMessage("Cập nhật thất bại!");
                return;
            } else {
                dispatch(updateSuccess(data));
                setUpdateAccount(false);
                handleShowSucccessMessage("Cập nhật thông tin tài khoản thành công !")
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // Update avatar
    const fileRef = useRef(null);

    const [image, setImage] = useState(undefined);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formDataImage, setFormDataImage] = useState('');

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
            }
        )
    }

    useEffect(() => {
        if (image) {
            handleFileUploadImage(image);
        }
    }, [image])

    // Update form auth
    const [formAuth, setFormAuth] = useState({});

    const handleChangeFormAuth = (e) => {
        e.preventDefault();
        setFormAuth({ ...formAuth, [e.target.id]: e.target.value });
    }

    const submitFormAuth = async (e) => {
        e.preventDefault();
        dispatch(updateStart());
        if (!formAuth.email && !formAuth.password) {
            handleShowErrorMessage("Vui lòng nhập thông tin cần cập nhật");
            return;
        }
        try {
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formAuth.email,
                    password: formAuth.password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                handleShowErrorMessage("Cập nhật thất bại!");
                return;
            } else {
                dispatch(updateSuccess(data));
                setUpdateAuth(false);
                handleShowSucccessMessage("Cập nhật thông tin đăng nhập thành công!");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="p-[20px]">
            <ToastContainer />

            <div className="animate__animated animate__fadeInRight">
                <h2 className="text-[24px] font-semibold mb-[20px]">Thông tin tài khoản</h2>
                <div className="w-[100px] h-[100px] ">
                    <img
                        src={currentUser?.profilePic}
                        alt="avatar"
                        className="w-full h-full object-cover border rounded-[50%]"
                    />
                </div>
                <div className="flex justify-start my-[20px]">
                    <label className="w-[300px] max-md:w-[150px]">Họ và tên</label>
                    <p>{currentUser?.username}</p>
                </div>
                <div className="flex justify-start my-[20px]">
                    <label className="w-[300px] max-md:w-[150px]">Số điện thoại</label>
                    <p>{currentUser?.phoneNumber}</p>
                </div>
                <div className="flex justify-start my-[20px]">
                    <label className="w-[300px] max-md:w-[150px]">Giới tính</label>
                    <p>{currentUser?.gender}</p>
                </div>
                <div className="flex justify-start my-[20px]">
                    <label className="w-[300px] max-md:w-[150px]">Ngày sinh</label>
                    <p>{currentUser?.dateOfBirth}</p>
                </div>
                <div onClick={() => setUpdateAccount(true)} className="border border-black rounded-[20px] w-[100px] text-center p-[10px] hover:bg-black hover:text-white cursor-pointer">Cập nhật</div>

                <h2 className="text-[24px] font-semibold pt-[20px]">Thông tin đăng nhập</h2>
                <div className="flex justify-start my-[20px]">
                    <label className="w-[300px] max-md:w-[150px]">Email</label>
                    <p>{currentUser?.email}</p>
                </div>
                <div className="flex justify-start my-[20px]">
                    <label className="w-[300px] max-md:w-[150px]">Mật khẩu</label>
                    <p>********</p>
                </div>
                <div onClick={() => setUpdateAuth(true)} className="border border-black rounded-[20px] w-[100px] text-center p-[10px] hover:bg-black hover:text-white cursor-pointer">Cập nhật</div>
            </div>

            {updateAccount && (
                <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm animate__animated animate__fadeIn'>
                    <div className="relative flex flex-col gap-[20px] overflow-y-scroll w-[500px] max-md:w-[300px] h-[600px] mx-auto bg-white rounded-[10px] p-[20px] mt-[100px]">
                        <h3 className="text-[20px] font-semibold">Chỉnh sửa thông tin tài khoản</h3>
                        <div className="w-[100px] h-[100px]">
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" className="hidden" accept="image/*" ref={fileRef} />
                            <img
                                onClick={() => fileRef.current.click()}
                                src={formDataImage || currentUser?.profilePic}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-[50%] border cursor-pointer"
                            />
                        </div>
                        {imageFileUploadProgress > 0 && imageFileUploadProgress < 100 && (
                            <span className="text-gray-400 text-sm">{imageFileUploadProgress}%</span>
                        )}
                        <button className="absolute top-0 right-0 " onClick={() => setUpdateAccount(false)}>
                            <IoMdCloseCircleOutline className="text-[30px]" />
                        </button>
                        <form onSubmit={submitFormAccount}>
                            <div className='flex items-center px-[20px] py-[5px] gap-[20px] border rounded-[20px] w-full'>
                                <FaRegUser />
                                <div className="flex flex-col gap-[5px]">
                                    <p>Họ và tên</p>
                                    <input onChange={handleChange} type="text" id='username' defaultValue={currentUser.username} className="w-[350px] max-md:w-full " />
                                </div>
                            </div>
                            <div className="flex flex-col px-[20px] py-[5px] border rounded-[20px] w-full mt-[20px]">
                                <p>Ngày sinh</p>
                                <div>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker value={selectedDate} onChange={handleDateChange} />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>

                            <div className="flex gap-[20px] px-[20px] py-[5px] border rounded-[20px] w-full mt-[20px]">
                                <div className="flex gap-[5px]">
                                    <input type="radio" id='gender' value='Nam' name="gender" onChange={handleChange} />
                                    <label>Nam</label>
                                </div>
                                <div className="flex gap-[5px]">
                                    <input type="radio" id='gender' value='Nữ' name="gender" onChange={handleChange} />
                                    <label>Nữ</label>
                                </div>
                                <div className="flex gap-[5px]">
                                    <input type="radio" id='gender' value='Khác' name="gender" onChange={handleChange} />
                                    <label>Khác</label>
                                </div>
                            </div>

                            <div className='flex items-center px-[20px] py-[5px] gap-[20px] border rounded-[20px] w-full mt-[20px]'>
                                <FaPhoneAlt />
                                <div className="flex flex-col gap-[5px]">
                                    <p>Số điện thoại</p>
                                    <input id='phoneNumber' onChange={handleChange} type="tel" defaultValue={currentUser?.phoneNumber} className="w-[350px] max-md:w-full" />
                                </div>
                            </div>
                            <button className="border rounded-[20px] w-[200px] bg-black text-white py-[5px] my-[20px]">Cập nhật tài khoản</button>
                        </form>
                    </div>
                </div>
            )}

            {updateAuth && (
                <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm  animate__animated animate__fadeIn'>
                    <div className="relative flex flex-col gap-[20px] overflow-y-scroll w-[500px] max-md:w-[300px] h-[400px] mx-auto bg-white rounded-[10px] p-[20px] mt-[100px]">
                        <h3 className="text-[20px] font-semibold">Chỉnh sửa thông tin đăng nhập</h3>
                        <button className="absolute top-0 right-0 " onClick={() => setUpdateAuth(false)}>
                            <IoMdCloseCircleOutline className="text-[30px]" />
                        </button>
                        <form onSubmit={submitFormAuth}>
                            <input onChange={handleChangeFormAuth} id='email' type="email" placeholder="email mới" className="border rounded-[20px] w-full p-[10px] my-[20px]" />
                            <input onChange={handleChangeFormAuth} id='password' type="password" placeholder="mật khẩu mới" className="border rounded-[20px] w-full p-[10px]" />
                            <button className="border rounded-[20px] w-[200px] bg-black text-white py-[5px] my-[20px]">Cập nhật tài khoản</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Account
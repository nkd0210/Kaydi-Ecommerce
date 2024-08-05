import React, { useState, useEffect, useRef } from 'react'
import { FaBars } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { signOutSuccess, updateStart, updateSuccess } from '../redux/user/userSlice';

import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

import Dashboard from '../components/admin/Dashboard';
import Category from '../components/admin/Category';
import Order from '../components/admin/Order';
import Products from '../components/admin/Products';
import { getStorage, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {

    const [openSidebar, setOpenSidebar] = useState(false);

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const res = await fetch('/api/auth/signout', {
            method: "POST"
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
        } else {
            dispatch(signOutSuccess());
            navigate('/');
        }
    }

    const [active, setActive] = useState('dashboard')

    const [openModal, setOpenModal] = useState(false);

    // update profile
    const [formData, setFormData] = useState({});

    const fileRef = useRef();
    const [photo, setPhoto] = useState('');
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
                        setFormData({ ...formData, profilePic: downloadURL })
                    })
            }
        )
    }

    useEffect(() => {
        if (photo) {
            handleFileUploadImage(photo);
        }
    }, [photo])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSuccessMessage = (message) => {
        toast.success(message)
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const profileForm = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            profilePic: formData.profilePic
        }
        dispatch(updateStart());
        try {
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Update profile failed");
                return;
            } else {
                handleShowSuccessMessage("Update profile successfully");
                dispatch(updateSuccess(data));
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div className='flex'>
            <ToastContainer />
            <div className='flex flex-col justify-between items-center p-[20px] gap-[20px] h-screen w-[200px] text-[18px] bg-black text-white max-md:hidden'>
                <div onClick={() => setOpenModal(true)} className='w-[80px] h-[80px] cursor-pointer hover:opacity-70'>
                    <img src={currentUser?.profilePic} alt="" className='w-full h-full object-cover rounded-[50%]' />
                </div>
                <div className='flex flex-col gap-[50px]'>
                    <div onClick={() => setActive('dashboard')} className={`cursor-pointer hover:text-red-400 ${active === 'dashboard' ? 'text-red-400' : 'text-white'}`}>Dashboard</div>
                    <div onClick={() => setActive('products')} className={`cursor-pointer hover:text-red-400 ${active === 'products' ? 'text-red-400' : 'text-white'}`}>Products</div>
                    <div onClick={() => setActive('category')} className={`cursor-pointer hover:text-red-400 ${active === 'category' ? 'text-red-400' : 'text-white'}`}>Category</div>
                    <div onClick={() => setActive('order')} className={`cursor-pointer hover:text-red-400 ${active === 'order' ? 'text-red-400' : 'text-white'}`}>Order</div>
                </div>
                <div onClick={handleLogout} className={`cursor-pointer hover:text-red-400`}> Log out</div>
            </div>

            <div className='md:hidden absolute top-[10px] left-[10px] z-20' onClick={() => setOpenSidebar(true)}>
                <FaBars />
            </div>

            <Drawer
                open={openSidebar}
                onClose={() => setOpenSidebar(false)}
                anchor='left'
            >
                <div className="w-[200px] h-screen flex flex-col gap-[20px] justify-between items-center bg-black  shadow-lg py-[50px] text-[16px] text-white ">
                    <div className='w-[60px] h-[60px]'>
                        <img src={currentUser?.profilePic} alt="" className='w-full h-full object-cover rounded-[50%]' />
                    </div>
                    <div onClick={() => { setActive('dashboard'); setOpenSidebar(false) }} className={`cursor-pointer hover:text-red-400 ${active === 'dashboard' ? 'text-red-400' : 'text-white'}`}>Dashboard</div>
                    <div onClick={() => { setActive('products'), setOpenSidebar(false) }} className={`cursor-pointer hover:text-red-400 ${active === 'products' ? 'text-red-400' : 'text-white'}`}>Products</div>
                    <div onClick={() => { setActive('category'), setOpenSidebar(false) }} className={`cursor-pointer hover:text-red-400 ${active === 'category' ? 'text-red-400' : 'text-white'}`}>Category</div>
                    <div onClick={() => { setActive('order'), setOpenSidebar(false) }} className={`cursor-pointer hover:text-red-400 ${active === 'order' ? 'text-red-400' : 'text-white'}`}>Order</div>
                    <div onClick={handleLogout} className={`cursor-pointer hover:text-red-400`}>Log out</div>
                </div>
            </Drawer>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[500px] bg-white text-black h-[500px] rounded-[20px] '>
                    <IoIosCloseCircleOutline onClick={() => setOpenModal(false)} className='absolute top-[10px] right-[10px] text-[20px] cursor-pointer hover:text-red-[400]' />
                    <form onSubmit={handleUpdateProfile} className='p-[10px] flex flex-col gap-[20px]'>
                        <h3>Edit Profile</h3>
                        <div className='flex gap-[10px] mt-[20px]'>
                            <input onChange={(e) => setPhoto(e.target.files[0])} type="file" className='hidden' accept='image/*' ref={fileRef} />
                            <img onClick={() => fileRef.current.click()} src={currentUser.profilePic} alt="" className='w-[50px] h-[50px] rounded-[50%]' />
                            <div className='flex flex-col gap-[5px]'>
                                <input onChange={handleChange} id='username' type="text" defaultValue={currentUser.username} />
                                {currentUser.isAdmin && (
                                    <p>Role: Admin</p>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col gap-[10px]'>
                            <span>Email : </span>
                            <input onChange={handleChange} id='email' type="text" defaultValue={currentUser.email} className='bg-gray-100 rounded-[10px] py-[10px] px-[10px] shadow-sm' />
                        </div>
                        <div className='flex flex-col gap-[10px]'>
                            <span>Password : </span>
                            <input onChange={handleChange} id='password' type="password" className='bg-gray-100 rounded-[10px] py-[10px] px-[10px] shadow-sm' />
                        </div>
                        <button type='submit' className='bg-gray-100 rounded-[20px] p-[10px] w-[200px] mx-auto hover:bg-red-200 hover:text-white'>
                            Save
                        </button>
                    </form>
                </div>
            </Modal>

            <div className='w-full h-screen max-md:mt-[20px]'>
                {active === 'dashboard' && <Dashboard />}
                {active === 'products' && <Products />}
                {active === 'category' && <Category />}
                {active === 'order' && <Order />}

            </div>
        </div>
    )
}

export default AdminDashboard
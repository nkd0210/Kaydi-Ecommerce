import { useState, useEffect, useRef } from 'react'
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BiTrash } from 'react-icons/bi';
import Loader from '../Loader';

import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

import { CiCirclePlus } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { SiVirustotal } from "react-icons/si";
import { CiImageOn } from "react-icons/ci";
import EditCategory from './category/EditCategory';

import 'animate.css'

const Category = () => {

    const [categories, setCategories] = useState([]);
    const [totalCategory, setTotalCategory] = useState('');
    const [lastWeekCategoryCount, setLastWeekCategoryCount] = useState('');
    const [lastMonthCategoryCount, setLastMonthCategoryCount] = useState('');
    const [loading, setLoading] = useState(true);

    const handleFetchCategories = async () => {
        try {
            const res = await fetch(`/api/category/getCategoriesFromNewest`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setCategories(data.allCategories);
                setTotalCategory(data.totalCategory);
                setLastMonthCategoryCount(data.lastMonthCategoryCount);
                setLastWeekCategoryCount(data.lastWeekCategoryCount);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        handleFetchCategories();
    }, []);

    // CREATE CATEGORY

    const [openCreateCategory, setOpenCreateCategory] = useState(false);
    const [createDesc, setCreateDesc] = useState([]);
    const [formCreate, setFormCreate] = useState({});
    const [inputCreateDesc, setInputCreateDesc] = useState('');
    const [loadingCreate, setLoadingCreate] = useState(false);

    const handleInputCreateDesc = (e) => {
        setInputCreateDesc(e.target.value)
    }

    const handleAddCreateDesc = () => {
        if (inputCreateDesc.trim()) {
            setCreateDesc([...createDesc, inputCreateDesc.trim()]);
            setInputCreateDesc('');
        }
    }

    const handleRemoveCreateDesc = (index) => {
        setCreateDesc((prevDesc) => prevDesc.filter((_, id) => id !== index))
    }

    const handleChangeCreate = (e) => {
        setFormCreate({ ...formCreate, [e.target.id]: e.target.value });
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    // HANDLE UPLOAD IMAGE

    const fileRef = useRef(null);
    const [image, setImage] = useState('');
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
                console.log("Image upload completed")
            }
        )
    }

    const handleClickSave = () => {
        handleFileUploadImage(image);
    }

    const handleCreateForm = async (e) => {
        e.preventDefault();
        setLoadingCreate(true);
        try {
            const res = await fetch(`/api/category/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formCreate.name,
                    title: formCreate.title,
                    description: createDesc,
                    heroImage: formDataImage
                })
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Create category failed");
                return;
            } else {
                handleShowSucccessMessage("Create category successfully");
                setOpenCreateCategory(false);
                handleFetchCategories();
                setFormCreate({});
                setCreateDesc([]);
                setLoadingCreate(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll bg-gray-100'>
            <>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <ToastContainer />
                        <div className='flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                            <div className='flex gap-[20px] items-center'>
                                <MdDashboard className='text-[30px]' />
                                <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Category Dashboard</h1>
                            </div>
                            <div className='flex gap-[20px] items-center max-md:flex-col max-md:items-start'>
                                <div onClick={() => setOpenCreateCategory(true)} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <CiCirclePlus className='text-[20px]' />
                                    <p className='text-[16px]'>Create category</p>
                                </div>
                                <div className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <IoIosPrint className='text-[20px]' />
                                    <p className='text-[16px]'>Print Excel</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-[10px] mt-[20px] items-center'>
                            <FaBusinessTime className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>Business Overview</h3>
                        </div>

                        <div className='flex max-md:flex-wrap justify-center max-md:justify-start items-center gap-[20px] py-[30px] animate__animated animate__fadeIn'>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <SiVirustotal className='text-[20px]' />
                                    <span>Total category: </span>
                                </div>
                                <p>{totalCategory}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <LiaCalendarWeekSolid className='text-[20px]' />
                                    <span>Last week create: </span>
                                </div>
                                <p>{lastWeekCategoryCount}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <MdCalendarMonth className='text-[20px]' />
                                    <span>Last month create: </span>
                                </div>
                                <p>{lastMonthCategoryCount}</p>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <MdCategory className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>All Categories</h3>
                        </div>

                        <EditCategory
                            categories={categories}
                            handleFetchCategories={handleFetchCategories}
                        />

                    </>
                )}
            </>

            {/* CREATE */}
            <Modal
                open={openCreateCategory}
                onClose={() => { setOpenCreateCategory(false); setCreateDesc([]) }}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] max-md:w-[400px] bg-white text-black h-[600px] overflow-y-scroll rounded-[20px] flex flex-col gap-[20px] p-[20px] max-md:p-[10px] '>
                    {loadingCreate ? (
                        <Loader />
                    ) : (
                        <>
                            <IoIosCloseCircleOutline onClick={() => setOpenCreateCategory(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                            <h2 className='text-center text-[20px] font-semibold'>Create New Category</h2>
                            <form onSubmit={handleCreateForm} className='flex flex-col gap-[20px]'>
                                <div className='flex max-md:flex-col gap-[20px]'>
                                    <p className='w-[160px] font-semibold'>Name:</p>
                                    <input onChange={handleChangeCreate} type="text" id='name' placeholder='Enter category name' className='border-[2px] border-black border-dotted px-[10px]' />
                                </div>
                                <div className='flex max-md:flex-col gap-[20px]'>
                                    <p className='w-[160px] font-semibold'>Title:</p>
                                    <input onChange={handleChangeCreate} type="text" id='title' placeholder='Enter title name' className='border-[2px] border-black border-dotted px-[10px]' />
                                </div>
                                <div className='flex max-md:flex-col gap-[20px]'>
                                    <p className='w-[160px] font-semibold'>Description:</p>
                                    <input onChange={handleInputCreateDesc} value={inputCreateDesc} type="text" id='title' placeholder='Enter descriptions' className='border-[2px] border-black border-dotted px-[10px]' />
                                    <div onClick={handleAddCreateDesc} className='rounded-[10px] bg-black text-white hover:opacity-70 py-[3px] px-[10px] cursor-pointer w-[100px] text-center'>Add</div>
                                </div>
                                <div className='flex flex-wrap gap-[20px] w-[full] mt-[20px]'>
                                    {createDesc?.map((item, index) => (
                                        <div key={index} className='relative p-[10px] rounded-[5px] w-[160px] bg-red-50'>
                                            {item}
                                            <BiTrash onClick={() => handleRemoveCreateDesc(index)} className='absolute top-[5px] right-[5px] hover:text-red-400 cursor-pointer' />
                                        </div>
                                    ))}
                                </div>
                                <div className='flex flex-col gap-[20px] '>
                                    <div className='flex gap-[20px] items-center'>
                                        <p className='w-[160px] font-semibold'>Hero Image:</p>
                                        <input onChange={(e) => setImage(e.target.files[0])} type="file" className="hidden" accept="image/*" ref={fileRef} />
                                        <CiImageOn className='text-[30px] cursor-pointer' onClick={() => fileRef.current.click()} />
                                    </div>
                                    {image && (
                                        <div className=' relative w-[300px] h-[100px]'>
                                            <img src={URL.createObjectURL(image)} alt="hero image" className='w-full h-full rounded-[10px] object-cover' />
                                            <div onClick={() => setImage('')} className='absolute top-[5px] right-[5px] text-black cursor-pointer hover:text-red-400'><BiTrash /></div>

                                        </div>
                                    )}
                                    {image && (
                                        <div onClick={handleClickSave} className='rounded-[20px] bg-blue-400 w-[100px] p-[5px] text-center hover:bg-opacity-70 hover:text-white cursor-pointer'>Save</div>
                                    )}
                                </div>
                                <button type='submit' className='rounded-[30px] w-[200px] text-center p-[10px] mt-[20px] bg-red-400 text-white hover:opacity-70'>Create</button>
                            </form>
                        </>
                    )}
                </div>
            </Modal>

        </div>
    )
}

export default Category
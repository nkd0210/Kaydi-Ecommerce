import { useState, useEffect, useRef } from 'react'
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BiTrash } from 'react-icons/bi';
import Loader from '../../Loader';

import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { app } from '../../../firebase';

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

const EditCategory = ({ categories, handleFetchCategories }) => {

    // EDIT CATEGORY
    const [categoryId, setCategoryId] = useState('');

    const [openModal, setOpenModal] = useState(false);

    const [formData, setFormData] = useState({});
    const [eachCategory, setEachCategory] = useState({});
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState([]);
    const [heroImage, setHeroImage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleFetchSingleCategory = async (categoryId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/category/getEachCategory/${categoryId}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setEachCategory(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        if (eachCategory) {
            setName(eachCategory.name);
            setTitle(eachCategory.title);
            setDescription(eachCategory.description);
            setHeroImage(eachCategory.heroImage)
        }
    }, [eachCategory])


    const removeDesc = (index) => {
        setDescription((prevDesc) => prevDesc.filter((_, id) => id !== index))
    }

    const [descInput, setDescInput] = useState('');

    const handleInputDesc = (e) => {
        setDescInput(e.target.value)
    }

    const handlAddDesc = () => {
        if (descInput.trim()) {
            setDescription([...description, descInput.trim()]);
            setDescInput('');
        }
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const [loadingUpdate, setLoadingUpdate] = useState(false);

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
        setHeroImage('');
    }

    const handleClickSave = async () => {
        setUploadSuccess(true);

        try {
            const storage = getStorage(app);
            const deletePromises = imageToDelete.map((url) => {
                const imageRef = ref(storage, url);
                return deleteObject(imageRef);
            });
            await Promise.all(deletePromises);
            setImageToDelete([]);
        } catch (error) {
            console.error("Error deleting images: ", error);
        }
        await handleFileUploadImage(heroImage);
    }



    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        const updateForm = {};
        if (!formData.name) updateForm.name = formData.name;
        if (!formData.title) updateForm.title = formData.title;
        if (description.length > 0) updateForm.description = description;
        if (formDataImage.length > 0) updateForm.heroImage = formDataImage;

        try {
            const res = await fetch(`/api/category/update/${categoryId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Update category failed");
                return;
            } else {
                setLoadingUpdate(false);
                handleShowSucccessMessage("Update category successfully");
                setOpenModal(false);
                setCategoryId('');
                handleFetchCategories();
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    // DELETE CATEGORY

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const handleDeleteCategory = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/category/delete/${categoryId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Delete category failed");
                return;
            } else {
                handleShowSucccessMessage("Delete category successfully");
                setCategoryId('');
                setOpenDeleteModal(false);
                handleFetchCategories();
            }
        } catch (error) {
            console.log(error.messasge)
        }
    }
    return (
        <div className='border rounded-[20px] mt-[20px] p-[10px] bg-white'>

            {categories?.map((category, index) => (
                <div key={index} className='border-b-[2px] py-[40px] flex flex-col gap-[20px]'>

                    {/* name+title */}
                    <div className='flex gap-[20px]'>
                        <p className='font-semibold w-[100px]'>Name:</p>
                        <p>{category.name}</p>
                    </div>
                    <div className='flex gap-[20px]'>
                        <p className='font-semibold w-[100px]'>Title:</p>
                        <p>{category.title}</p>
                    </div>

                    {/* description */}
                    <div className='flex flex-col'>
                        <p className='font-semibold w-[100px]'>Description: </p>
                        <div className='flex flex-wrap gap-[20px] w-[full] mt-[20px]'>
                            {category.description?.map((item, index) => (
                                <div key={index} className='relative p-[10px] rounded-[5px] w-[160px] bg-red-50'>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* hero image */}
                    <div className='flex flex-col gap-[20px]'>
                        <p className='font-semibold w-[100px]'>Hero Image: </p>
                        {
                            category.heroImage ? (
                                <img src={category?.heroImage} alt="hero image" className='w-[300px] h-[100px] object-cover rounded-[10px]' />
                            ) : (
                                <div className='text-gray-500'>this product doesnt have hero image</div>
                            )
                        }
                    </div>

                    <div className='flex gap-[50px]'>
                        <button onClick={() => { setOpenModal(true); setCategoryId(category._id); handleFetchSingleCategory(category._id) }} type='submit' className='rounded-[30px] bg-blue-400 text-white w-[160px] p-[10px] hover:bg-opacity-70'>Edit</button>
                        <button onClick={() => { setOpenDeleteModal(true); setCategoryId(category._id) }} className='rounded-[30px] bg-red-400 text-white w-[160px] p-[10px] hover:bg-opacity-70'>Delete</button>
                    </div>
                </div>
            ))}

            {/* EDIT */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1000px] max-md:w-[400px] bg-white text-black h-[600px] overflow-y-scroll rounded-[20px] '>
                    <IoIosCloseCircleOutline onClick={() => setOpenModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <form onSubmit={handleSubmitForm} className='p-[20px] max-md:p-[10px]'>
                        {loadingUpdate ? (
                            <Loader />
                        ) : (
                            <>
                                <h2 className='text-center text-[20px] font-semibold'>Edit Category</h2>
                                {loading ? (<Loader />) : (
                                    <div className='flex flex-col gap-[20px] mt-[20px]'>

                                        <div className='flex max-md:flex-col gap-[20px]'>
                                            <p className='w-[160px] font-semibold'>Name: </p>
                                            <input onChange={handleChange} type="text" value={name} id='name' className='border-gray-500 border-[2px] border-dashed px-[10px] ' />
                                        </div>

                                        <div className='flex max-md:flex-col gap-[20px]'>
                                            <p className='w-[160px] font-semibold'>Title: </p>
                                            <input onChange={handleChange} type="text" value={title} id='title' className='border-gray-500 border-[2px] border-dashed px-[10px] ' />
                                        </div>

                                        <div className='flex max-md:flex-col flex-col'>
                                            <div className='flex max-md:flex-col items-center max-md:items-start gap-[20px]'>
                                                <p className='w-[160px] font-semibold'>Description: </p>
                                                <input onChange={handleInputDesc} value={descInput} type="text" placeholder='Enter here' id='description' className='border-gray-500 border-[2px] border-dashed px-[10px] ' />
                                                <div onClick={handlAddDesc} className='rounded-[10px] bg-black text-white hover:opacity-70 py-[3px] px-[10px] cursor-pointer'>Add</div>
                                            </div>
                                            <div className='flex flex-wrap gap-[20px] w-[full] mt-[20px]'>
                                                {description?.map((item, index) => (
                                                    <div key={index} className='relative p-[10px] rounded-[5px] w-[160px] bg-red-50'>
                                                        {item}
                                                        <BiTrash onClick={() => removeDesc(index)} className='absolute top-[5px] right-[5px] hover:text-red-400 cursor-pointer' />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-[20px] '>
                                            <div className='flex gap-[20px] items-center'>
                                                <p className='w-[160px] font-semibold'>Hero Image:</p>
                                                <input onChange={(e) => setHeroImage(e.target.files[0])} type="file" className="hidden" accept="image/*" ref={fileRef} />
                                                <CiImageOn className='text-[30px] cursor-pointer' onClick={() => fileRef.current.click()} />
                                            </div>
                                            {heroImage && (
                                                <div className=' relative w-[300px] h-[100px]'>
                                                    <img src={typeof heroImage === 'string' ? heroImage : URL.createObjectURL(heroImage)} alt="hero image" className='w-full h-full rounded-[10px] object-cover' />
                                                    <div onClick={() => handleRemovePhoto(heroImage)} className='absolute top-[5px] right-[5px] text-black cursor-pointer hover:text-red-400'><BiTrash /></div>

                                                </div>
                                            )}
                                            {uploadSuccess ? (
                                                <div></div>
                                            ) : (
                                                <div onClick={handleClickSave} className='rounded-[20px] bg-blue-400 w-[120px] text-[12px] p-[5px] text-center hover:bg-opacity-70 hover:text-white cursor-pointer'>Save Image</div>
                                            )}
                                        </div>
                                        <button type='submit' className='rounded-[30px] w-[200px] text-center p-[10px] bg-red-400 text-white hover:opacity-70'>Save</button>
                                    </div>
                                )}
                            </>
                        )}
                    </form>
                </div>

            </Modal>

            {/* DELETE */}
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] bg-white text-black h-[300px] max-md:h-[200px] rounded-[20px] flex flex-col gap-[20px] justify-center items-center '>
                    <IoIosCloseCircleOutline onClick={() => setOpenDeleteModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <h3 className='text-center text-[20px] max-md:text-[16px]'>Are you sure to delete this category ?</h3>
                    <div className='flex justify-evenly w-full'>
                        <div onClick={handleDeleteCategory} className='rounded-[10px] p-[10px] text-center bg-red-400 hover:opacity-70 w-[100px] cursor-pointer'>YES</div>
                        <div onClick={() => setOpenDeleteModal(false)} className='rounded-[10px] p-[10px] text-center bg-blue-400 hover:opacity-70 w-[100px] cursor-pointer'>CANCEL</div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default EditCategory
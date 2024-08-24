import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import Loader from '../../Loader';
// IMAGE UPLOAD
import { app } from '../../../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiTrash } from 'react-icons/bi';
import 'animate.css';

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

const EditProduct = ({ productId, setOpenEdit, setOpenShow, handleFetchProductsDashboard }) => {

    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    const [photos, setPhotos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);


    const handleFetchProduct = async () => {
        try {
            const res = await fetch(`/api/product/getEachProduct/${productId}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setProduct(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (productId) {
            handleFetchProduct();
        }
    }, [productId]);

    useEffect(() => {
        if (product) {
            setPhotos(product?.listingPhotoPaths);
            setCategories(product?.categories);
            setSizes(product?.sizes);
            setColors(product?.colors);
        }
    }, [product])

    const handleClickNoProduct = () => {
        setOpenEdit(false);
        setOpenShow(true)
    }

    // HANDLE IMAGE

    const fileRef = useRef(null);
    const [formDataImage, setFormDataImage] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [imagePending, setImagePending] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete

    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const handleUploadPhotosFromDevice = (e) => {
        setUploadSuccess(false);
        const newPhoto = e.target.files;
        setPhotos((prevPhoto) => [...prevPhoto, ...newPhoto]);
    }


    const handleRemovePhoto = (indexToRemove) => {
        setUploadSuccess(false);

        // console.log('Photos Array:', photos);
        // console.log('Index to Remove:', indexToRemove);

        const photoToRemove = photos[indexToRemove];

        // Log the photoToRemove for debugging
        // console.log('Photo to Remove:', photoToRemove);

        if (typeof photoToRemove === 'string') {
            // Add photo URL to imagesToDelete
            setImagesToDelete((prev) => [...prev, photoToRemove]);
        }

        setPhotos((prevPhoto) => prevPhoto.filter((_, index) => index !== indexToRemove));

    };

    // useEffect(() => {
    //     console.log('Updated list of photos to remove: ', imagesToDelete);
    //     console.log('Photos Array After remove:', photos);

    // }, [imagesToDelete]);


    const handleClearAllPhotos = () => {
        // Add all URLs to imagesToDelete before clearing
        const urlsToDelete = photos.filter(photo => typeof photo === 'string');
        setImagesToDelete((prev) => [...prev, ...urlsToDelete]);

        // Clear the photos array
        setPhotos([]);
    };


    const handleFileUploadImages = async (images) => {
        const storage = getStorage(app);

        // Filter out URLs and process only File objects
        const filesToUpload = images.filter(image => image instanceof File);

        const uploadPromises = filesToUpload.map((file) => {
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setImageFileUploadProgress((prevProgress) => ({
                            ...prevProgress,
                            [fileName]: progress.toFixed(0),
                        }));
                    },
                    (error) => {
                        setImageFileUploadError((prevError) => ({
                            ...prevError,
                            [fileName]: 'Could not upload image (File must be less than 2MB)',
                        }));
                        console.log(error);
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                resolve({ fileName, downloadURL });
                            })
                            .catch((error) => reject(error));
                    }
                );
            });
        });

        try {
            const uploadedFiles = await Promise.all(uploadPromises);
            const newPhotos = uploadedFiles.map((file) => file.downloadURL);
            setFormDataImage((prevData) => ({
                ...prevData,
                listingPhotoPaths: [...(prevData.listingPhotoPaths || []), ...newPhotos],
            }));
            setImagePending(false);
            handleShowSucccessMessage("Update images success")
        } catch (error) {
            console.error("Error uploading images: ", error);
        }
    };

    const handleClickSave = async () => {
        setUploadSuccess(true);
        setImagePending(true);

        // Handle deletions first
        try {
            const storage = getStorage(app);
            const deletePromises = imagesToDelete.map((url) => {
                const imageRef = ref(storage, url);
                return deleteObject(imageRef);
            });

            await Promise.all(deletePromises);

            setImagesToDelete([]);
        } catch (error) {
            console.error("Error deleting images: ", error);
        }

        // Update formDataImage with the current state of photos
        setFormDataImage((prevData) => ({
            ...prevData,
            listingPhotoPaths: photos.filter(photo => typeof photo === 'string') // Ensure URLs are updated
        }));

        // Handle file uploads
        await handleFileUploadImages(photos);

        // Other save operations...
        setImagePending(false);
    };



    // category
    const [categoryInput, setCategoryInput] = useState('');
    const handleInputCategory = (e) => {
        setCategoryInput(e.target.value)
    }

    const handleAddCategory = () => {
        if (categoryInput.trim()) {
            setCategories([...categories, categoryInput.trim()]);
            setCategoryInput('');
        }
    }

    const handleRemoveCategory = (index) => {
        setCategories((prevCategories) => prevCategories.filter((_, id) => id !== index))
    }

    // size
    const [sizeInput, setSizeInput] = useState('');
    const handleInputSize = (e) => {
        setSizeInput(e.target.value)
    }

    const handleAddSize = () => {
        if (sizeInput.trim()) {
            setSizes([...sizes, sizeInput.trim()]);
            setSizeInput('');
        }
    }

    const handleRemoveSize = (index) => {
        setSizes((prevSize) => prevSize.filter((_, id) => id !== index))
    }

    // color
    const [colorInput, setColorInput] = useState('');
    const handleInputColor = (e) => {
        setColorInput(e.target.value)
    }

    const handleAddColor = () => {
        if (colorInput.trim()) {
            setColors([...colors, colorInput.trim()]);
            setColorInput('');
        }
    }

    const handleRemoveColor = (index) => {
        setColors((prevColors) => prevColors.filter((_, id) => id !== index))
    }

    // submit form

    const [formData, setFormData] = useState({});

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmitForm = async (e) => {
        setLoading(true);
        e.preventDefault();
        const listingForm = {};
        if (formData?.name) listingForm.name = formData.name;
        if (formData?.description) listingForm.description = formData.description;
        if (formData?.price) listingForm.price = formData.price;
        if (formData?.stock) listingForm.stock = formData.stock;
        if (categories.length > 0) listingForm.categories = categories;
        if (sizes.length > 0) listingForm.sizes = sizes;
        if (colors.length > 0) listingForm.colors = colors;
        if (formDataImage.listingPhotoPaths) listingForm.listingPhotoPaths = formDataImage.listingPhotoPaths;

        try {
            const res = await fetch(`/api/product/update/${product._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(listingForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Update product failed! Try again.");
                setLoading(false);
                return;
            } else {
                handleShowSucccessMessage("Update product successfully!")
                handleFetchProduct();
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const [deleteModal, setDeleteModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDeleteProduct = async () => {
        setLoadingDelete(true);
        try {
            const res = await fetch(`/api/product/delete/${productId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                handleShowErrorMessage("Delete product failed! Try again.");
                return;
            } else {
                handleShowSucccessMessage("Delete product successfully!")
                setDeleteModal(false);
                setOpenEdit(false);
                setOpenShow(true);
                handleFetchProductsDashboard();
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingDelete(false);
        }
    }

    return (
        <div className='ml-[10px] mb-[50px] bg-white animate__animated animate__fadeInUp'>
            <ToastContainer />
            {Object.keys(product).length === 0 ? (
                <h3 onClick={handleClickNoProduct} className='cursor-pointer text-red-500 hover:text-blue-400'>
                    Please select a product!
                </h3>
            ) : (
                <>
                    {loading ? (
                        <Loader />
                    ) : (
                        <form onSubmit={handleSubmitForm} className='border shadow-md rounded-[10px] p-[10px] flex flex-col gap-[20px] h-[1000px] overflow-y-scroll'>
                            <h2 className='text-center font-semibold text-[20px]'>General Information</h2>
                            <div>
                                <h3 className='font-semibold pb-[10px]'>Product Name</h3>
                                <input onChange={handleChange} id='name' type="text" defaultValue={product?.name} className='border rounded-[10px] p-[10px] w-full mb-[20px]' />

                                <h3 className='font-semibold pb-[10px]'>Description</h3>
                                <textarea onChange={handleChange} id='description' defaultValue={product?.description} className='border rounded-[10px] p-[10px] w-full h-[200px] mb-[20px]'></textarea>

                                <h3 className='font-semibold pb-[10px]'>Product Image</h3>
                                {imagePending ? (
                                    <Loader />
                                ) : (
                                    <div className='mb-[20px]'>
                                        <input onChange={handleUploadPhotosFromDevice} ref={fileRef} type="file" id='image' accept='image/*' multiple className='hidden' />
                                        <div>
                                            {photos?.length === 0 ? (
                                                <h3 className='py-[20px] text-red-400'>
                                                    This product doesn't have any photos !
                                                </h3>
                                            ) : (
                                                <div className='flex flex-col '>
                                                    {/* PHOTOS */}
                                                    <div className='flex border w-[1000px] max-md:w-full overflow-x-scroll gap-[20px] rounded-[10px] p-[10px]'>
                                                        {photos?.map((photo, index) => (
                                                            <div key={index} className='relative w-[150px] h-[150px]'>
                                                                <div className='w-[150px] h-[150px]'>
                                                                    <img src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)} alt="picture" className='w-full h-full obejct-cover rounded-[10px]' />
                                                                </div>
                                                                <div onClick={() => handleRemovePhoto(index)} className='absolute top-[5px] right-[5px] text-black cursor-pointer hover:text-red-400'><BiTrash /></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* UPLOAD PHOTOS */}
                                        {uploadSuccess ? (
                                            <div className='mt-[20px]'>

                                            </div>
                                        ) : (
                                            <div className='flex items-center gap-[20px] my-[20px]'>
                                                <div onClick={handleClickSave} className=' flex items-center justify-center w-[100px] py-[10px] border rounded-[10px] bg-red-400 hover:bg-opacity-70 text-center cursor-pointer'>Save</div>
                                                <div onClick={handleClearAllPhotos} className='flex items-center justify-center w-[100px] py-[10px] border rounded-[10px] bg-red-400 hover:bg-opacity-70 text-center cursor-pointer'>Clear all</div>
                                            </div>
                                        )}

                                        <div onClick={() => fileRef.current.click()} className='border rounded-[10px] w-[220px] p-[10px] bg-black text-white hover:bg-opacity-75 cursor-pointer'>
                                            Upload from your device
                                        </div>
                                    </div>
                                )}

                                <h3 className='font-semibold pb-[10px]'>Product Detail</h3>
                                <div className='border rounded-[10px] p-[10px] w-full overflow-x-scroll'>
                                    <div className='flex items-center pb-[20px]'>
                                        <span className='w-[150px]'>Price: </span>
                                        <input onChange={handleChange} id='price' type='number' defaultValue={product?.price} placeholder='Enter price' className='border w-[500px] rounded-[5px] p-[10px] ' />
                                    </div>
                                    <div className='flex items-center pb-[20px]'>
                                        <span className='w-[150px]'>Stock: </span>
                                        <input onChange={handleChange} id='stock' type='number' defaultValue={product?.stock} placeholder='Enter number of stock' className='border w-[500px] rounded-[5px] p-[10px] ' />
                                    </div>
                                    <div className='flex items-center pb-[20px]'>
                                        <span className='w-[150px]'>Categories: </span>
                                        <input onChange={handleInputCategory} value={categoryInput} id='categories' type='text' placeholder='Enter categories' className='border w-[500px] rounded-[5px] p-[10px] ' />
                                        <div onClick={handleAddCategory} className='border cursor-pointer text-center rounded-[10px] p-[10px] mx-[10px] w-[60px]'>Add</div>
                                    </div>
                                    <div className='flex items-center gap-[20px] ml-[150px] max-md:ml-0 pb-[20px] w-full max-md:flex-wrap'>
                                        {categories?.map((category, index) => (
                                            <div key={index} className='relative'>
                                                <div className='border py-[10px] px-[15px] rounded-[5px] shadow-md text-center'>
                                                    {category}
                                                </div>
                                                <div className='absolute top-[2px] right-[2px] hover:text-red-400 cursor-pointer'>
                                                    <BiTrash onClick={() => handleRemoveCategory(index)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex items-center pb-[20px]'>
                                        <span className='w-[150px]'>Sizes: </span>
                                        <input onChange={handleInputSize} value={sizeInput} id='categories' type='text' placeholder='Enter sizes' className='border w-[500px] rounded-[5px] p-[10px] ' />
                                        <div onClick={handleAddSize} className='border rou cursor-pointer text-center rounded-[10px] p-[10px] mx-[10px] w-[60px]'>Add</div>
                                    </div>
                                    <div className='flex items-center gap-[20px] ml-[150px] max-md:ml-0 pb-[20px] w-full max-md:flex-wrap'>
                                        {sizes?.map((size, index) => (
                                            <div key={index} className='relative'>
                                                <div className='border py-[10px] px-[15px] rounded-[5px] shadow-md text-center'>
                                                    {size}
                                                </div>
                                                <div className='absolute top-[2px] right-[2px] hover:text-red-400 cursor-pointer'>
                                                    <BiTrash onClick={() => handleRemoveSize(index)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex items-center pb-[20px]'>
                                        <span className='w-[150px]'>Colors: </span>
                                        <input onChange={handleInputColor} value={colorInput} id='categories' type='text' placeholder='Enter colors' className='border w-[500px] rounded-[5px] p-[10px] ' />
                                        <div onClick={handleAddColor} className='border ro cursor-pointer text-center rounded-[10px] p-[10px] mx-[10px] w-[60px]'>Add</div>
                                    </div>
                                    <div className='flex items-center gap-[20px] ml-[150px] max-md:ml-0 pb-[20px] w-full overflow-x-scroll'>
                                        {colors?.map((color, index) => (
                                            <div key={index} className='relative'>
                                                <div className='border py-[10px] px-[15px] rounded-[5px] shadow-md text-center'>
                                                    {color}
                                                </div>
                                                <div className='absolute top-[2px] right-[2px] hover:text-red-400 cursor-pointer'>
                                                    <BiTrash onClick={() => handleRemoveColor(index)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            <div className='flex gap-[40px]'>
                                <button type='submit' className='border rounded-[20px] py-[5px] px-[10px] w-[200px] bg-blue-400 hover:bg-opacity-70'>Save</button>
                                <div onClick={() => setDeleteModal(true)} className='border rounded-[20px] py-[5px] px-[10px] w-[200px] bg-red-400 hover:bg-opacity-70 text-center cursor-pointer'>Delete</div>
                            </div>
                        </form>
                    )}
                    {/* DELETE */}
                    <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
                        <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[400px] p-[20px] bg-white text-black h-[200px] max-md:h-[200px] rounded-[20px] flex flex-col gap-[20px] justify-center items-center '>
                            {
                                loadingDelete ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <IoIosCloseCircleOutline onClick={() => setDeleteModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                                        <h3 className='text-center text-[18px] max-md:text-[16px]'>Are you sure to delete this product ?</h3>
                                        <div className='flex justify-evenly w-full'>
                                            <div onClick={handleDeleteProduct} className='rounded-[10px] p-[10px] text-center bg-red-400 hover:opacity-70 w-[100px] cursor-pointer'>YES</div>
                                            <div onClick={() => setDeleteModal(false)} className='rounded-[10px] p-[10px] text-center bg-blue-400 hover:opacity-70 w-[100px] cursor-pointer'>CANCEL</div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </Modal>
                </>

            )}
        </div>
    )
}

export default EditProduct
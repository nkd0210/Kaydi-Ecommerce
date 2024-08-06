import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
// IMAGE UPLOAD
import { app } from '../../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiTrash } from 'react-icons/bi';

const CreateProduct = ({ setOpenCreate, setOpenShow }) => {
    // category
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState([]);

    const handleInputCategory = (e) => {
        setCategoryInput(e.target.value)
    }

    const handleAddCategory = () => {
        if (categoryInput.trim()) {
            setCategories([...categories, categoryInput.trim()]);
            setCategoryInput('');
        }
    }

    // size
    const [sizeInput, setSizeInput] = useState('');
    const [sizes, setSizes] = useState([]);

    const handleInputSize = (e) => {
        setSizeInput(e.target.value)
    }

    const handleAddSize = () => {
        if (sizeInput.trim()) {
            setSizes([...sizes, sizeInput.trim()]);
            setSizeInput('');
        }
    }

    // color
    const [colorInput, setColorInput] = useState('');
    const [colors, setColors] = useState([]);

    const handleInputColor = (e) => {
        setColorInput(e.target.value)
    }

    const handleAddColor = () => {
        if (colorInput.trim()) {
            setColors([...colors, colorInput.trim()]);
            setColorInput('');
        }
    }

    // handle upload image
    const fileRef = useRef(null);

    const [photos, setPhotos] = useState([]);
    const [formDataImage, setFormDataImage] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);

    const handleUploadPhotosFromDevice = (e) => {
        setUploadSuccess(false);
        const newPhoto = e.target.files;
        setPhotos((prevPhoto) => [...prevPhoto, ...newPhoto]);
    }

    const handleRemovePhoto = (indexToRemove) => {
        setPhotos((prevPhoto) => prevPhoto.filter((_, index) => index !== indexToRemove))
    }

    const handleClearAllPhotos = () => {
        setPhotos([]);
    }

    const handleFileUploadImages = async (images) => {
        const storage = getStorage(app);
        const uploadPromises = images.map((image) => {
            const fileName = new Date().getTime() + image.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, image);

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
            console.log("Upload successful");
        } catch (error) {
            console.error("Error uploading images: ", error);
        }
    };

    const handleClickSave = () => {
        setUploadSuccess(true);
        handleFileUploadImages(photos);
    }

    // handle create product
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }


    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        const productForm = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            categories: categories,
            sizes: sizes,
            colors: colors,
            listingPhotoPaths: formDataImage.listingPhotoPaths
        }

        if (!productForm.name || !productForm.description || !productForm.price || !productForm.stock || !productForm.stock || !productForm.categories || !productForm.sizes || !productForm.colors || !productForm.listingPhotoPaths) {
            handleShowErrorMessage("All fields are required");
            console.log(productForm)
        }

        const res = await fetch(`/api/product/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productForm)
        });
        const data = await res.json();
        if (!res.ok) {
            handleShowErrorMessage("Create product failed");
            return;
        } else {
            handleShowSucccessMessage("Create product sucessfully");
            setOpenCreate(false);
            setOpenShow(true);
        }
    }


    return (
        <form onSubmit={handleCreateProduct} className='border w-[1200px] max-md:w-full p-[30px] max-md:p-[5px] flex flex-col justify-center gap-[30px] shadow-lg mx-[10px] max-md:mx-[5px]'>
            <ToastContainer />
            <div className='flex items-center'>
                <span className='w-[150px]'>Name: </span>
                <input onChange={handleChange} id='name' type="text" placeholder='Enter product name' className='border w-[500px] rounded-[5px] p-[10px] ' />
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>Description: </span>
                <textarea onChange={handleChange} id='description' placeholder='Enter description' className='border w-[500px] rounded-[5px] p-[10px] ' />
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>Price: </span>
                <input onChange={handleChange} id='price' type='number' placeholder='Enter price' className='border w-[500px] rounded-[5px] p-[10px] ' />
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>Stock: </span>
                <input onChange={handleChange} id='stock' type='number' placeholder='Enter number of stock' className='border w-[500px] rounded-[5px] p-[10px] ' />
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>Categories: </span>
                <input onChange={handleInputCategory} value={categoryInput} id='categories' type='text' placeholder='Enter categories' className='border w-[500px] rounded-[5px] p-[10px] ' />
                <div onClick={handleAddCategory} className='border cursor-pointer text-center rounded-[10px] p-[10px] mx-[10px] w-[60px]'>Add</div>
            </div>
            <div className='flex items-center gap-[20px] ml-[150px]'>
                {categories.map((category, index) => (
                    <div key={index} className='border p-[5px] rounded-[5px] shadow-md text-center'>
                        {category}
                    </div>
                ))}
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>Sizes: </span>
                <input onChange={handleInputSize} value={sizeInput} id='categories' type='text' placeholder='Enter sizes' className='border w-[500px] rounded-[5px] p-[10px] ' />
                <div onClick={handleAddSize} className='border rou cursor-pointer text-center rounded-[10px] p-[10px] mx-[10px] w-[60px]'>Add</div>
            </div>
            <div className='flex items-center gap-[20px] ml-[150px]'>
                {sizes.map((size, index) => (
                    <div key={index} className='border p-[5px] rounded-[5px] shadow-md text-center'>
                        {size}
                    </div>
                ))}
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>Colors: </span>
                <input onChange={handleInputColor} value={colorInput} id='categories' type='text' placeholder='Enter colors' className='border w-[500px] rounded-[5px] p-[10px] ' />
                <div onClick={handleAddColor} className='border ro cursor-pointer text-center rounded-[10px] p-[10px] mx-[10px] w-[60px]'>Add</div>
            </div>
            <div className='flex items-center gap-[20px] ml-[150px]'>
                {colors.map((color, index) => (
                    <div key={index} className='border p-[5px] rounded-[5px] shadow-md text-center'>
                        {color}
                    </div>
                ))}
            </div>
            <div className='flex items-center'>
                <span className='w-[150px]'>
                    Add some photos:
                </span>
                <input onChange={handleUploadPhotosFromDevice} ref={fileRef} type="file" id='image' accept='image/*' multiple className='hidden' />
                <div onClick={() => fileRef.current.click()} className='border rounded-[10px] p-[10px] bg-black text-white hover:bg-opacity-75 cursor-pointer'>
                    Upload from your device
                </div>
            </div>
            {photos.length >= 1 && (
                <div className='flex flex-col '>
                    {/* PHOTOS */}
                    <div className='flex border w-[1000px] overflow-x-scroll gap-[20px] rounded-[10px]'>
                        {photos.map((photo, index) => (
                            <div key={index} className='relative w-[150px] h-[150px]'>
                                <div className='w-[150px] h-[150px]'>
                                    <img src={URL.createObjectURL(photo)} alt="picture" className='w-full h-full obejct-cover rounded-[10px]' />
                                </div>
                                <div onClick={() => handleRemovePhoto(index)} className='absolute top-[5px] right-[5px] text-black cursor-pointer hover:text-red-400'><BiTrash /></div>
                            </div>
                        ))}
                    </div>
                    {/* UPLOAD PHOTOS */}

                    {uploadSuccess ? (
                        <div className='mt-[20px]'>

                        </div>
                    ) : (
                        <div className='flex items-center gap-[20px] mt-[20px]'>
                            <div onClick={handleClickSave} className=' flex items-center justify-center w-[100px] h-[50px] border rounded-[10px] bg-red-400 hover:bg-opacity-70 text-center cursor-pointer'>Save</div>
                            <div onClick={handleClearAllPhotos} className='flex items-center justify-center w-[100px] h-[50px] border rounded-[10px] bg-red-400 hover:bg-opacity-70 text-center cursor-pointer'>Clear all</div>
                        </div>
                    )}
                </div>
            )}
            <button type='submit' className='border rounded-[10px] p-[10px] w-[200px] text-center cursor-pointer bg-black text-white hover:bg-opacity-70'>Create Product</button>
        </form>
    )
}

export default CreateProduct
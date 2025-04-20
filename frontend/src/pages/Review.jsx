import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Navigation from '../components/Navigation';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
// IMAGE UPLOAD
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

import StarIcon from '@mui/icons-material/Star';
import { IoCameraOutline } from "react-icons/io5";
import { BiTrash } from 'react-icons/bi';

import 'animate.css';
import { toast } from 'react-toastify';

const Review = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const { orderId } = useParams();

    const [order, setOrder] = useState({});
    const [products, setProducts] = useState([]);
    const [loadingOrder, setLoadingOrder] = useState(false);

    const handleFetchOrder = async () => {
        setLoadingOrder(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/getOrderById/${orderId}`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrder(data);
                setProducts(data.products);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingOrder(false);
        }
    }

    useEffect(() => {
        handleFetchOrder();
    }, [])

    const [rating, setRating] = useState(0);

    const handleRating = (index) => {
        setRating(index + 1);
    }

    const [comment, setComment] = useState('');

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    // handle image
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

    const productIds = products.map((product) => product.productId)

    const [loadingReview, setLoadingReview] = useState(false);

    const handleSubmitFormReview = async (e) => {
        e.preventDefault();
        setLoadingReview(true);

        const reviewForm = {
            order: orderId,
            productIds: productIds,
            rating: rating,
            comment: comment,
        }

        if (formDataImage.listingPhotoPaths) reviewForm.image = formDataImage.listingPhotoPaths;

        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/review/createReview/${currentUser._id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reviewForm),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                toast.success("Đánh giá thành công!");
                navigate("/profile/reply");
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingReview(false)
        }
    }


    return (
        <div>
            <Navigation />
            <Navbar />
            <div className='container mx-auto overflow-x-clip mb-[50px]'>
                {
                    loadingOrder ? (
                        <Loader />
                    ) : (
                        <div className='p-[20px] max-md:p-[10px] w-full h-[800px] max-md:h-full'>
                            <h1 className='text-[20px] uppercase font-semibold my-[20px]'>Đánh giá sản phẩm</h1>
                            {
                                loadingReview ? (
                                    <Loader />
                                ) : (
                                    <form onSubmit={handleSubmitFormReview} className='border rounded-[10px] shadow-md p-[20px] h-[700px] max-md:h-full max-md:p-[10px] flex max-md:flex-col gap-[40px] '>
                                        {/* products */}
                                        <div className='bg-white w-[500px] max-md:w-full max-h-[400px] flex flex-col gap-[20px] overflow-y-scroll animate__animated animate__fadeInUp'>
                                            <h3 className='font-semibold text-[18px] pb-[20px]'>Thông tin sản phẩm</h3>

                                            {products.map((product, index) => (
                                                <div key={index} className='flex justify-between max-md:flex-col gap-[10px] border shadow-md p-[10px]'>
                                                    <div className='flex gap-[10px]'>
                                                        <img src={product.image} alt="" className='w-[60px] h-[60px] object-cover rounded-[5px]' />
                                                        <div className='flex flex-col gap-[5px]'>
                                                            <p>{product.name}</p>
                                                            <p><span className='uppercase'>{product.size}</span> | {product.color} | x{product.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className='text-red-500'>{product.price}&#8363;</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* review */}
                                        <div className='border rounded-[10px] h-[600px] overflow-y-scroll max-md:h-full  w-full p-[20px] max-md:p-[10px] flex flex-col gap-[20px] animate__animated animate__fadeInRight '>
                                            <h3 className='font-semibold text-[18px]'>Đánh giá của bạn</h3>
                                            {/* rating */}
                                            <div className='flex items-center gap-[20px]'>
                                                <p>Chất lượng sản phẩm</p>
                                                <div className='flex items-center gap-[5px]'>
                                                    {[...Array(5)].map((_, index) => (
                                                        <StarIcon
                                                            key={index}
                                                            onClick={() => handleRating(index)}
                                                            className={index < rating ? 'text-yellow-300' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {/* image */}
                                            <div className='my-[20px] flex flex-col w-full gap-[10px]'>
                                                <input onChange={handleUploadPhotosFromDevice} type="file" className='hidden' ref={fileRef} id='image' accept='image/*' multiple />
                                                <div className='flex gap-[20px] items-center max-w-[1000px] overflow-y-scroll '>
                                                    {photos.length >= 1 && (
                                                        <div className='flex gap-[20px] p-[10px]'>
                                                            {photos.map((photo, index) => (
                                                                <div key={index} className='relative w-[200px] h-[150px]'>
                                                                    <div className='w-[200px] h-[150px]'>
                                                                        <img src={URL.createObjectURL(photo)} alt="picture" className='w-full h-full obejct-cover rounded-[10px]' />
                                                                    </div>
                                                                    <div onClick={() => handleRemovePhoto(index)} className='absolute top-[5px] right-[5px] text-black cursor-pointer hover:text-red-400'><BiTrash /></div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div onClick={() => fileRef.current.click()} className='border border-orange-500 px-[20px] py-[10px] min-w-[200px] h-[90px] flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100'>
                                                        <IoCameraOutline className='text-[30px] text-orange-500' />
                                                        <p className='text-[12px] text-orange-500'>Thêm hình ảnh</p>
                                                    </div>
                                                </div>

                                                {photos.length >= 1 && !uploadSuccess && (
                                                    <div className='flex items-center gap-[20px] mt-[20px]'>
                                                        <div onClick={handleClickSave} className=' flex items-center justify-center w-[100px] h-[30px] border rounded-[20px] bg-orange-400 hover:bg-opacity-70 text-center cursor-pointer'>Save</div>
                                                    </div>
                                                )}

                                            </div>
                                            {/* comment */}
                                            <div>
                                                <p className='pb-[10px]'>Mô tả sản phẩm</p>
                                                <textarea onChange={handleChange} className='w-[500px] max-md:w-full border bg-gray-100 h-[200px] p-[10px]' placeholder='Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!'></textarea>
                                            </div>

                                            <button type='submit' className=' text-white border rounded-[30px] px-[20px] py-[10px] w-[150px] text-center cursor-pointer bg-orange-400 hover:bg-opacity-70 '>Gửi</button>
                                        </div>
                                    </form>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <Footer />
        </div>
    )
}

export default Review
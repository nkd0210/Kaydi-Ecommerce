import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from "../components/Navigation";
import Navbar from "../components/Navbar";
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { LuRefreshCcw } from "react-icons/lu";
import { FiPhoneCall } from "react-icons/fi";
import { BsArrowsCollapse } from "react-icons/bs";
import { BsArrowsExpand } from "react-icons/bs";

import styled from 'styled-components';

// ANIMATE
import 'animate.css';

const ProductDetail = () => {

    const { productId } = useParams();
    const [detailProduct, setDetailProduct] = useState({});

    const [showImage, setShowImage] = useState('');
    const [showColor, setShowColor] = useState('');
    const [showSize, setShowSize] = useState('');
    const [showQuantity, setShowQuantity] = useState(1);

    const [isDragging, setIsDragging] = useState(false); // for not clicking open other product when using slider
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchDetailProduct = async () => {
        setLoading(true)
        const res = await fetch(`/api/product/getEachProduct/${productId}`, {
            method: "GET"
        });
        const data = await res.json();
        if (!res.ok) {
            console.error(data.message);
            return;
        } else {
            setDetailProduct(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDetailProduct();
        fetchRecommendProduct();
    }, [productId]);

    useEffect(() => {
        if (detailProduct.listingPhotoPaths && detailProduct.listingPhotoPaths.length > 0) {
            setShowImage(detailProduct.listingPhotoPaths[0]);
        }
    }, [detailProduct])

    const handleDecreaseQuantity = () => {
        if (showQuantity > 1) {
            setShowQuantity(showQuantity - 1);
        }
    }

    // Handle fetch recommend product
    const [recommendProduct, setReCommendProduct] = useState([]);
    const [loadingRecommentProduct, setLoadingRecommentProduct] = useState(false);

    const fetchRecommendProduct = async () => {
        setLoadingRecommentProduct(true);
        const res = await fetch(`/api/product/getRecentProduct/8`, {
            method: "GET"
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
        } else {
            setReCommendProduct(data);
            setLoadingRecommentProduct(false);
        }
    }

    // add to cart
    const [openBox, setOpenBox] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleShowSucccessMessage = (message) => {
        toast.success(message)
    }

    const handleAddToCart = async () => {
        if (!currentUser) {
            navigate('/signIn');
            return;
        }

        const addForm = {
            userId: currentUser._id,
            productId: detailProduct._id,
            quantity: showQuantity,
            color: showColor,
            size: showSize
        };

        if (addForm.color === '' && addForm.size === '') {
            handleShowErrorMessage('Vui lòng chọn màu sắc và kích thước mong muốn');
            return;
        } else if (addForm.color === '') {
            handleShowErrorMessage('Vui lòng chọn màu sắc mong muốn');
            return;
        } else if (addForm.size === '') {
            handleShowErrorMessage('Vui lòng chọn kích thước mong muốn');
            return;
        }
        try {
            const res = await fetch(`/api/cart/addToCart`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addForm)
            });
            const data = await res.json();
            if (!res.ok) {
                handleShowErrorMessage("Thêm vào giỏ hàng thất bại !")
            } else {
                setOpenBox(false);
                navigate('/cart');
            }
        } catch (error) {

        }
    }

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(recommendProduct.length, 6),
        slidesToScroll: Math.min(recommendProduct.length, 6),
        arrows: true,
        beforeChange: () => setIsDragging(true),
        afterChange: () => setIsDragging(false),
        responsive: [
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: Math.min(recommendProduct.length, 4),
                    slidesToScroll: Math.min(recommendProduct.length, 4)
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(recommendProduct.length, 3),
                    slidesToScroll: Math.min(recommendProduct.length, 3)
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: Math.min(recommendProduct.length, 2),
                    slidesToScroll: Math.min(recommendProduct.length, 2)
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: Math.min(recommendProduct.length, 1),
                    slidesToScroll: Math.min(recommendProduct.length, 1)
                }
            }
        ]
    };

    return (
        <Wrapper>
            <Navigation />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className='relative py-[20px] px-[70px] max-md:p-[10px]'>
                    <ToastContainer />
                    {/* PRODUCT */}
                    <div className='box2 h-[700px] max-md:h-full '>
                        {/* IMAGES */}
                        <div className='h-[500px] overflow-y-scroll  flex max-md:flex-col max-md:p-[10px] gap-[10px] animate__animated animate__fadeInLeft '>
                            {/* list images */}
                            <div className='flex flex-col max-md:flex-row gap-[10px]'>
                                {detailProduct?.listingPhotoPaths?.map((photo, index) => (
                                    <div onClick={() => setShowImage(photo)} key={index} className='w-[50px] h-[70px] '>
                                        <img src={photo} alt="" className='w-full h-full object-cover animate__animated animate__zoomIn ' />
                                    </div>
                                ))}
                            </div>
                            {/* show image */}
                            <img src={showImage} alt="" className='w-full h-full object-cover rounded-[10px] animate__animated animate__fadeIn ' />
                        </div>
                        {/* DETAIL */}
                        <div className='flex flex-col max-md:p-[10px] h-[700px] max-md:h-screen overflow-y-scroll hide-scrollbar animate__animated animate__fadeInRight'>
                            <h3 className='text-[30px] font-semibold '>{detailProduct?.name}</h3>
                            <p className='text-gray-600 whitespace-pre-wrap'>{detailProduct?.description}</p>
                            <p className='font-semibold py-[10px]'>{detailProduct?.price}&#8363;</p>
                            <p> Miễn phí giao hàng | Giao hàng 1-2 ngày - Hà Nội & TP. Hồ Chí Minh</p>
                            <div className='flex flex-col gap-[10px] pt-[10px]'>
                                <p>Màu sắc: {showColor}</p>
                                <div className='flex gap-[10px]'>
                                    {detailProduct?.colors?.map((color, index) => (
                                        <div
                                            onClick={(e) => setShowColor(color)}
                                            key={index}
                                            id='color'
                                            className={`w-[20px] h-[20px] rounded-[50%] border-[2px] cursor-pointer ${showColor === color ? 'border-red-400' : 'border-black'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                        </div>
                                    ))}
                                </div>
                                <p>Kích thước: {showSize}</p>
                                <div className='flex gap-[10px]'>
                                    {detailProduct?.sizes?.map((size, index) => (
                                        <div
                                            onClick={(e) => setShowSize(size)}
                                            key={index}
                                            id='sizes'
                                            className="w-[80px] h-[40px] rounded-[10px] text-center border border-black py-[10px] px-[20px] cursor-pointer hover:bg-gray-100"
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                                <p>Tồn kho: {detailProduct.stock}</p>
                                <div className='w-[100px] border border-black p-[10px] rounded-[20px] flex justify-between items-center text-center'>
                                    <CiCircleMinus className='text-[20px] cursor-pointer' onClick={handleDecreaseQuantity} />
                                    <p className='text-[18px]'>
                                        {showQuantity}
                                    </p>
                                    <CiCirclePlus className='text-[20px] cursor-pointer' onClick={() => setShowQuantity(showQuantity + 1)} />
                                </div>
                                <div className='grid grid-cols-2 gap-[20px] mt-[10px]'>
                                    <div className='flex gap-[10px] items-center border shadow-lg rounded-[20px] p-[10px]'>
                                        <LuRefreshCcw />
                                        <p>Đổi trả cực dễ chỉ cần số điện thoại </p>
                                    </div>
                                    <div className='flex gap-[10px] items-center border shadow-lg rounded-[20px] p-[10px]'>
                                        <LuRefreshCcw />
                                        <p>60 ngày đổi trả vì bất kỳ lý do gì </p>
                                    </div>
                                    <div className='flex gap-[10px] items-center border shadow-lg rounded-[20px] p-[10px]'>
                                        <FiPhoneCall />
                                        <p>Hotline 1900.27.27.37 hỗ trợ từ 8h30 - 22h mỗi ngày </p>
                                    </div>
                                    <div className='flex gap-[10px] items-center border shadow-lg rounded-[20px] p-[10px]'>
                                        <FiPhoneCall />
                                        <p>Đến tận nơi nhận hàng trả, hoàn tiền trong 24h </p>
                                    </div>
                                </div>
                                <hr className='border-[2px] my-[20px]' />

                            </div>
                        </div>
                    </div>

                    {/* RECOMMEND */}
                    <div className='mt-[100px] mb-[50px] animate__animated animate__fadeInDown'>
                        <h3 className='text-center text-[30px] uppercase font-semibold mb-[40px]'>Gợi ý sản phẩm</h3>
                        {loadingRecommentProduct ? (
                            <Loader />
                        ) : (
                            <div className='mt-[20px] max-md:ml-[40px]'>
                                <Slider {...settings}>
                                    {recommendProduct?.map((product, index) => (
                                        <div onClick={() => {
                                            if (!isDragging) {
                                                navigate(`/productDetail/${product._id}`)
                                            }
                                        }}
                                            key={index}
                                            className='flex flex-col gap-[10px]'>
                                            <div className='w-[300px] h-[400px] overflow-hidden'>
                                                <img src={product?.listingPhotoPaths[0]} alt="image" className='w-full h-full object-cover rounded-[10px] transform transition-transform ease-in hover:scale-110 cursor-pointer' />
                                            </div>
                                            <div className='flex flex-col my-[10px]'>
                                                <span>{product.name}</span>
                                                <span className='font-semibold text-[12px]'>{product.price}&#8363;</span>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        )}
                    </div>

                    {/* Add item to cart */}
                    {openBox ? (
                        <div className='fixed  bottom-[10px] right-[10px] w-[400px] rounded-[20px] shadow-xl z-20 bg-gray-100 border px-[10px] py-[30px] flex flex-col gap-[20px] animate__animated animate__rotateInUpRight'>
                            <BsArrowsCollapse onClick={() => setOpenBox(false)} className='absolute top-[10px] right-[10px] cursor-pointer hover:text-red-400 text-[20px]' />
                            <div className='flex flex-wrap gap-[10px]'>
                                <p> Sản phẩm:</p>
                                <p className='font-semibold'>{detailProduct?.name}</p>
                            </div>
                            <div className='flex flex-wrap gap-[10px]'>
                                <p> Màu sắc:</p>
                                <p className='font-semibold'>{showColor}</p>
                            </div>
                            <div className='flex flex-wrap gap-[10px]'>
                                <p> Kích thước:</p>
                                <p className='font-semibold'>{showSize}</p>
                            </div>
                            <div className='flex flex-wrap gap-[10px]'>
                                <p> Số lượng:</p>
                                <p className='font-semibold'>{showQuantity}</p>
                            </div>
                            <div onClick={handleAddToCart} className='w-full h-[50px] bg-red-400 text-white rounded-[30px] flex items-center justify-center cursor-pointer hover:bg-opacity-70 hover:text-black'>
                                Thêm vào giỏ hàng
                            </div>
                        </div>
                    ) : (
                        <div className='fixed border bottom-[10px] right-[10px] w-[50px] h-[50px] rounded-[20px] shadow-xl z-20 bg-gray-100 p-[10px] flex justify-center items-center '>
                            <BsArrowsExpand onClick={() => setOpenBox(true)} className='cursor-pointer hover:text-red-400 text-[20px]' />
                        </div>
                    )}



                </div>
            )}
            <Footer />
        </Wrapper>
    )
}

const Wrapper = styled.section`

    .box2 {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 20px;
    }

    @media (max-width: 600px) {
        .box2 {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    }
`

export default ProductDetail
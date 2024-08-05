import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from "../components/Navigation";
import Navbar from "../components/Navbar";
import Loader from '../components/Loader';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { LuRefreshCcw } from "react-icons/lu";
import { FiPhoneCall } from "react-icons/fi";

import styled from 'styled-components';

const ProductDetail = () => {

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: true,
        beforeChange: () => setIsDragging(true),
        afterChange: () => setIsDragging(false),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const { productId } = useParams();
    const [detailProduct, setDetailProduct] = useState({});
    const [showImage, setShowImage] = useState('');
    const [showColor, setShowColor] = useState('');
    const [showSize, setShowSize] = useState('');
    const [showQuantity, setShowQuantity] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchDetailProduct = async () => {
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

    const fetchRecommendProduct = async () => {
        const res = await fetch(`/api/product/getRecentProduct/4`, {
            method: "GET"
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
        } else {
            setReCommendProduct(data);
        }
    }

    return (
        <Wrapper>
            <Navigation />
            <Navbar />
            {loading ? (
                <Loader />
            ) : (
                <div className='py-[20px] px-[70px] max-md:p-[0px]'>
                    <div className='box2 h-[600px] max-md:h-screen'>
                        {/* IMAGES */}
                        <div className='h-[500px] flex max-md:flex-col max-md:p-[10px] gap-[10px]'>
                            {/* list images */}
                            <div className='flex flex-col max-md:flex-row gap-[10px]'>
                                {detailProduct?.listingPhotoPaths?.map((photo, index) => (
                                    <div onClick={() => setShowImage(photo)} key={index} className='w-[50px] h-[70px]'>
                                        <img src={photo} alt="" className='w-full h-full object-cover' />
                                    </div>
                                ))}
                            </div>
                            {/* show image */}
                            <img src={showImage} alt="" className='w-full h-full object-cover rounded-[10px]' />
                        </div>
                        {/* DETAIL */}
                        <div className='flex flex-col max-md:p-[10px] h-[700px] max-md:h-screen overflow-y-scroll'>
                            <h3 className='text-[30px] font-semibold'>{detailProduct?.name}</h3>
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
                                            className={`w-[20px] h-[20px] rounded-[50%] border-[2px] ${showColor === color ? 'border-red-400' : 'border-black'}`}
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
                                            className="w-[80px] h-[40px] rounded-[10px] text-center border border-black py-[10px] px-[20px]"
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>
                                <p>Tồn kho: {detailProduct.stock}</p>
                                <div className='w-[100px] border border-black p-[10px] rounded-[20px] flex justify-between items-center text-center'>
                                    <CiCircleMinus className='text-[20px]' onClick={handleDecreaseQuantity} />
                                    <p className='text-[18px]'>
                                        {showQuantity}
                                    </p>
                                    <CiCirclePlus className='text-[20px]' onClick={() => setShowQuantity(showQuantity + 1)} />
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
                    <div className='mt-[100px]'>
                        <h3 className='text-center text-[30px] uppercase font-semibold mb-[40px]'>Gợi ý sản phẩm</h3>
                        <div>
                            <Slider {...settings}>
                                {recommendProduct?.map((product, index) => (
                                    <div onClick={() => {
                                        if (!isDragging) {
                                            navigate(`/productDetail/${product._id}`)
                                        }
                                    }}
                                        key={index}
                                        className='flex flex-col gap-[10px]'>
                                        <div className='w-[300px] h-[400px]'>
                                            <img src={product?.listingPhotoPaths[0]} alt="image" className='w-full h-full object-cover rounded-[5px]' />
                                        </div>
                                        <div className='flex flex-col my-[10px]'>
                                            <span>{product.name}</span>
                                            <span className='font-semibold text-[12px]'>{product.price}&#8363;</span>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            )}
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
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoPricetagOutline } from "react-icons/io5";
import Skeleton from '@mui/material/Skeleton';

// ANIMATE
import 'animate.css';

const RecentProduct = () => {

    const navigate = useNavigate();

    const [recentProducts, setRecentProducts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchRecentProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getRecentProduct/6`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setRecentProducts(data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }
    }

    useEffect(() => {
        fetchRecentProduct();
    }, []);

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(recentProducts.length, 6),
        slidesToScroll: Math.min(recentProducts.length, 6),
        arrows: true,
        beforeChange: () => setIsDragging(true),
        afterChange: () => setIsDragging(false),
        responsive: [
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: Math.min(recentProducts.length, 4),
                    slidesToScroll: Math.min(recentProducts.length, 4)
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(recentProducts.length, 3),
                    slidesToScroll: Math.min(recentProducts.length, 3)
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: Math.min(recentProducts.length, 2),
                    slidesToScroll: Math.min(recentProducts.length, 2)
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: Math.min(recentProducts.length, 1),
                    slidesToScroll: Math.min(recentProducts.length, 1)
                }
            }
        ]
    };

    return (
        <div className='container mx-auto overflow-x-clip'>
            <div className='p-[20px]'>
                <div className='rounded-[20px] w-[200px] max-md:w-[150px] text-[20px] max-md:text-[14px] border border-black px-[10px] py-[5px] text-center font-semibold'>Sản phẩm mới</div>
                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-4 ml-[40px] gap-[40px] max-md:gap-[5px] items-center'>
                        <Skeleton width={300} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                        <Skeleton width={300} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                    </div>
                ) : (
                    <div className='mt-[20px] ml-[40px] max-w-full'>
                        <Slider {...settings}>
                            {recentProducts?.map((product, index) => (
                                <div
                                    onClick={() => {
                                        if (!isDragging) { navigate(`/productDetail/${product._id}`) }
                                    }}
                                    key={index}
                                    className='flex flex-col px-[10px] gap-[10px] animate__animated animate__fadeIn'>
                                    <div className='w-[300px] h-[400px] overflow-hidden'>
                                        <img src={product?.listingPhotoPaths[0]} alt="image" loading="lazy" className='w-full h-full object-cover rounded-[10px] transform transition-transform ease-in hover:scale-110 cursor-pointer' />
                                    </div>
                                    <div className='flex flex-col w-[300px] my-[20px] gap-[10px]'>
                                        <span>{product.name}</span>
                                        <span className='font-semibold text-[12px]'>{product.price}&#8363;</span>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RecentProduct
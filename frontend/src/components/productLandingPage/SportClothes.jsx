import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Loader from '../Loader';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

// ANIMATE
import 'animate.css';

const SportClothes = () => {

    const name = "sport";
    const category = "sport";

    const [loadingProduct, setLoadingProduct] = useState(false);
    const [products, setProducts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const [heroImage, setHeroImage] = useState('');

    const findCategoryByName = async () => {
        setLoadingImage(true);
        try {
            const res = await fetch(`/api/category/getCategoryByName/${name}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setHeroImage(data.heroImage);
                setLoadingImage(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const fetchProductByCategory = async () => {
        setLoadingProduct(true);
        try {
            const res = await fetch(`/api/product/getByCategory/${category}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setProducts(data.findProductByCategory);
                setLoadingProduct(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        findCategoryByName();
        fetchProductByCategory();
    }, [])

    const [loadingImage, setLoadingImage] = useState(false);

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(products.length, 6),
        slidesToScroll: Math.min(products.length, 6),
        arrows: true,
        beforeChange: () => setIsDragging(true),
        afterChange: () => setIsDragging(false),
        responsive: [
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: Math.min(products.length, 4),
                    slidesToScroll: Math.min(products.length, 4)
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: Math.min(products.length, 3),
                    slidesToScroll: Math.min(products.length, 3)
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: Math.min(products.length, 2),
                    slidesToScroll: Math.min(products.length, 2)
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: Math.min(products.length, 1),
                    slidesToScroll: Math.min(products.length, 1)
                }
            }
        ]
    };

    return (
        <div className='my-[20px]'>
            <div className='w-screen max-h-[500px] max-md:h-[200px] mb-[20px] md:mb-[50px] 3xl:mb-[200px]'>
                {
                    loadingImage ? (
                        <Loader />
                    ) : (
                        <div className='relative'>
                            <img src={heroImage} alt="hero image" className='w-full h-full object-cover ' />
                            <div className='absolute bottom-[30%] left-[50px] max-md:left-[20px] flex flex-col gap-[20px]'>
                                <h2 className='uppercase text-[50px] font-semibold max-md:text-[14px]'>đồ chạy bộ</h2>
                                <div className='w-[200px] max-md:w-[150px] rounded-[20px] bg-blue-500 text-white text-[16px] max-md:text-[12px] p-[10px] text-center hover:bg-opacity-70 cursor-pointer hover:text-black'>Khám phá ngay</div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className='p-[20px]'>
                <div className='rounded-[20px] w-[250px] max-md:w-[200px] text-[20px] max-md:text-[14px] border border-black px-[10px] py-[5px] text-center font-semibold'>Sản phẩm thể thao</div>
                {loadingProduct ? (
                    <Loader />
                ) : (
                    <div className='mt-[20px] ml-[40px]'>
                        <Slider {...settings}>
                            {products?.map((product, index) => (
                                <div onClick={() => {
                                    if (!isDragging) {
                                        navigate(`/productDetail/${product._id}`)
                                    }
                                }}
                                    key={index}
                                    className='flex flex-col gap-[10px] px-[10px] animate__animated animate__zoomIn'>
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
        </div>
    )
}

export default SportClothes
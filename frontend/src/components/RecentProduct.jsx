import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const RecentProduct = () => {

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
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
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

    const navigate = useNavigate();

    const [recentProducts, setRecentProducts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRecentProduct = async () => {
        const res = await fetch(`/api/product/getRecentProduct/4`, {
            method: "GET"
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
        } else {
            setRecentProducts(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecentProduct();
    }, []);

    return (
        <div className='p-[20px]'>
            <div className='rounded-[20px] w-[150px] border border-black px-[10px] py-[5px] text-center font-semibold'>Sản phẩm mới</div>
            {loading ? (
                <Loader />
            ) : (
                <div className='mt-[20px] max-md:ml-[40px]'>
                    <Slider {...settings}>
                        {recentProducts?.map((product, index) => (
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
            )}
        </div>
    )
}

export default RecentProduct
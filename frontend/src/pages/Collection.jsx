import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loader from '../components/Loader'
import ProductCard from '../components/ProductCard'

import 'animate.css'
import Skeleton from '@mui/material/Skeleton';

const Collection = () => {

    const { category, subcategory } = useParams();
    const navigate = useNavigate();

    const [productsData, setProductsData] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(false);

    const [categoryInfo, setCategoryInfo] = useState({});
    const [loadingCategory, setLoadingCategory] = useState(false);

    const handleFetchCategory = async () => {
        setLoadingCategory(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/category/getCategoryByName/${category}`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setCategoryInfo(data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingCategory(false);
        }
    }

    const [page, setPage] = useState(1);

    const handleFetchProductsByCategory = async (page) => {
        setLoadingProduct(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getByCategory/${category}?page=${page}&limit=10`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setProductsData(data);
                setProductsByCategory(data.findProductByCategory);
                setPage(data.currentPage);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingProduct(false);
            }, 1000);
        }
    }

    const [productsBySubCategory, setProductsBySubCategory] = useState([]);
    const [subProductInfo, setSubProductInfo] = useState({});

    const handleFetchSubCategory = async (page) => {
        setProductsBySubCategory([]);
        setLoadingProduct(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getByCategory/${subcategory}?page=${page}&limit=10`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setSubProductInfo(data);
                setProductsBySubCategory(data.findProductByCategory);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingProduct(false);
            }, 1000)
        }
    }

    useEffect(() => {
        handleFetchProductsByCategory(1);
        handleFetchCategory();
        handleFetchSubCategory();
    }, [category, subcategory])

    const handleClickSubCategory = (item) => {
        navigate(`/collections/${category}/${item}`);
    }

    const handleNextPage = () => {
        if (page < productsData?.totalPages) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                handleFetchProductsByCategory(newPage);
                return newPage;
            })
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => {
                const newPage = prevPage - 1;
                handleFetchProductsByCategory(newPage);
                return newPage;
            })
        }
    }

    return (
        <>
            <Navigation />
            <Navbar />
            <div className=''>
                <div className='w-full'>
                    <img src={categoryInfo.heroImage} alt="image" className='w-full h-full object-cover' />
                </div>
                <div className='p-[20px]'>

                    <h3 className='text-[20px] font-semibold uppercase'>{categoryInfo.title}</h3>
                    <div className='flex gap-[20px] w-full overflow-x-scroll my-[20px] animate__animated animate__fadeInRight'>
                        {
                            loadingCategory ? (
                                <Loader />
                            ) : (
                                <>
                                    {categoryInfo.description && categoryInfo.description.length > 0 && (
                                        categoryInfo.description.map((item, index) => (
                                            <div onClick={() => handleClickSubCategory(item)} key={index} className='text-[18px] max-md:text-[12px] cursor-pointer bg-gray-50 max-md:bg-transparent hover:bg-opacity-70 hover:text-red-500 border rounded-[20px] max-md:rounded-[10px] p-[10px] min-w-[200px] text-center'>
                                                {item}
                                            </div>
                                        ))
                                    )}
                                </>
                            )
                        }
                    </div>

                    {
                        loadingProduct ? (
                            <div className='flex ml-[40px] gap-[20px] items-center'>
                                <Skeleton width={200} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                                <Skeleton width={200} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                                <Skeleton width={200} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                                <Skeleton width={200} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                                <Skeleton width={200} height={400} animation="wave" sx={{ bgcolor: 'grey.100' }} />
                            </div>
                        ) : (
                            <>
                                {
                                    !subcategory ? (
                                        <>
                                            <p className='text-gray-500 text-[14px]'> Tìm thấy {productsData?.totalNumber} sản phẩm!</p>
                                            <div className='w-full flex flex-wrap gap-[30px] animate__animated animate__fadeIn mt-[40px] '>
                                                {
                                                    productsByCategory && productsByCategory.length > 0 && (
                                                        productsByCategory.map((product, index) => (
                                                            <div
                                                                onClick={() => { navigate(`/productDetail/${product._id}`) }}
                                                                key={index}
                                                                className='flex flex-col px-[10px] gap-[10px] animate__animated animate__zoomIn'>
                                                                <div className='w-[300px] h-[400px] overflow-hidden'>
                                                                    <img src={product?.listingPhotoPaths[0]} alt="image" className='w-full h-full object-cover rounded-[10px] transform transition-transform ease-in hover:scale-110 cursor-pointer' />
                                                                </div>
                                                                <div className='flex flex-col my-[20px] gap-[10px]'>
                                                                    <span>{product.name}</span>
                                                                    <span className='font-semibold text-[12px]'>{product.price}&#8363;</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )
                                                }
                                            </div>
                                            <div className='flex justify-center mx-auto items-center gap-[10px] my-[40px]'>
                                                <button onClick={handlePreviousPage} disabled={page === 1}>{`<`}</button>
                                                <p>{productsData?.currentPage}/{productsData?.totalPages}</p>
                                                <button onClick={handleNextPage} disabled={productsData?.currentPage === productsData?.totalPages}>{`>`}</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {
                                                !subProductInfo?.totalNumber ? (
                                                    <p className='text-gray-500 text-[14px]'> Không tìm thấy sản phẩm!</p>
                                                ) : (
                                                    <p className='text-gray-500 text-[14px]'> Tìm thấy {subProductInfo?.totalNumber} sản phẩm!</p>
                                                )
                                            }
                                            <div className='w-full flex flex-wrap gap-[30px] animate__animated animate__fadeIn mt-[40px] '>
                                                {
                                                    productsBySubCategory && productsBySubCategory.length > 0 && (
                                                        productsBySubCategory.map((product, index) => (
                                                            <ProductCard product={product} key={index} />
                                                        ))
                                                    )
                                                }
                                            </div>
                                        </>
                                    )
                                }
                            </>
                        )
                    }

                </div>
            </div>
            <Footer />
        </>
    )
}

export default Collection
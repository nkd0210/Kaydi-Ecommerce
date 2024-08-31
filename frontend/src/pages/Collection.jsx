import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loader from '../components/Loader'
import 'animate.css'
import ProductCard from '../components/ProductCard'

const Collection = () => {

    const { category, subcategory } = useParams();
    const navigate = useNavigate();

    const [productsByCategory, setProductsByCategory] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [totalNumber, setTotalNumber] = useState(0);

    const handleFetchProductsByCategory = async () => {
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
                setProductsByCategory(data.findProductByCategory);
                setTotalNumber(data.totalNumber)
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    const [categoryInfo, setCategoryInfo] = useState({});
    const [loadingCategory, setLoadingCategory] = useState(false);

    const handleFetchCategory = async () => {
        setLoadingCategory(true);
        try {
            const res = await fetch(`/api/category/getCategoryByName/${category}`, {
                method: "GET"
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

    const [productsBySubCategory, setProductsBySubCategory] = useState([]);
    const [subProductInfo, setSubProductInfo] = useState({});

    const handleFetchSubCategory = async () => {
        setProductsBySubCategory([]);
        setLoadingProduct(true);
        try {
            const res = await fetch(`/api/product/getByCategory/${subcategory}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setSubProductInfo(data);
                setProductsBySubCategory(data.findProductByCategory)
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    useEffect(() => {
        handleFetchProductsByCategory();
        handleFetchCategory();
        handleFetchSubCategory();
    }, [category, subcategory])

    const handleClickSubCategory = (item) => {
        navigate(`/collections/${category}/${item}`);
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
                            <Loader />
                        ) : (
                            <>
                                {
                                    !subcategory ? (
                                        <>
                                            <p className='text-gray-500 text-[14px]'> Tìm thấy {totalNumber} sản phẩm!</p>
                                            <div className='w-full flex flex-wrap gap-[30px] animate__animated animate__fadeInUp mt-[40px] animate__animated animate__fadeInUp'>
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
                                            <div className='w-full flex flex-wrap gap-[30px] animate__animated animate__fadeInUp mt-[40px] animate__animated animate__fadeInUp'>
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
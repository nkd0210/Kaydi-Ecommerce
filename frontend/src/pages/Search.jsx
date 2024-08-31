import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loader from '../components/Loader'
import 'animate.css'
import Filter from '../components/Filter'
import ProductCard from '../components/ProductCard'


const Search = () => {

    const { currentUser } = useSelector((state) => state.user);
    const { searchKey } = useParams();

    const [newSearchKey, setNewSearchKey] = useState(searchKey);

    const navigate = useNavigate();

    // FILTER
    const [showType, setShowType] = useState('grid');
    const [sortType, setSortType] = useState('');

    // SHOW PRODUCTS
    const [allProducts, setAllProducts] = useState([]);
    const [loadingProducts, setLoadingProduct] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [productCount, setProductCount] = useState(0);

    const handleFetchProductsPagination = async (page) => {
        setLoadingProduct(true);
        setTotalPage(1);
        setProductCount(0);
        setAllProducts([]);
        try {
            const res = await fetch(`/api/product/getProductPagination?page=${page}&limit=10`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.listProducts);
                setTotalPage(data.totalPages);
                setProductCount(data.totalNumber);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    const handleNextPage = () => {
        if (page < totalPage) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                if (selectCategory === 'all') {
                    handleFetchProductsPagination(newPage);
                } else if (selectCategory && selectCategory !== 'all') {
                    handleFetchProductByCategory(selectCategory, newPage);
                } else if (!selectCategory && newSearchKey) {
                    handleFetchProductBySearchKey(newPage);
                }
                return newPage;
            });
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => {
                const newPage = prevPage - 1;
                if (selectCategory === 'all') {
                    handleFetchProductsPagination(newPage);
                } else if (selectCategory && selectCategory !== 'all') {
                    handleFetchProductByCategory(selectCategory, newPage); // Pass category and page
                } else if (!selectCategory && newSearchKey) {
                    handleFetchProductBySearchKey(newPage); // Pass page for search
                }
                return newPage;
            });
        }
    };



    // const handleFetchAllProducts = async () => {
    //     setLoadingProduct(true);
    //     try {
    //         const res = await fetch(`/api/product/getAllProduct`, {
    //             method: "GET"
    //         });
    //         const data = await res.json();
    //         if (!res.ok) {
    //             console.log(data.message);
    //             return;
    //         } else {
    //             setAllProducts(data.allProducts);
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //     } finally {
    //         setLoadingProduct(false);
    //     }
    // }

    const [allCategories, setAllCategories] = useState([]);
    const [loadingCategory, setLoadingCategory] = useState(false);

    const handleFetchAllCategories = async () => {
        setLoadingCategory(true);
        try {
            const res = await fetch(`/api/category/getAllCategories`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllCategories(data.allCategories);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingCategory(false);
        }
    }

    useEffect(() => {
        handleFetchAllCategories();
    }, [])

    const handleFetchProductBySearchKey = async (page) => {
        setLoadingProduct(true);
        setTotalPage(1);
        setProductCount(0);
        setAllProducts([]);
        try {
            const res = await fetch(`/api/product/getProductBySearch/${searchKey}?page=${page}&limit=10`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.findProducts);
                setTotalPage(data.totalPages);
                setProductCount(data.totalNumber);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    useEffect(() => {
        if (searchKey) {
            setPage(1);
            setSelectCategory('');
            handleFetchProductBySearchKey(1);
        }
    }, [searchKey])

    const [selectCategory, setSelectCategory] = useState('');

    const handleFetchProductByCategory = async (categoryName, page) => {
        setLoadingProduct(true);
        setTotalPage(1);
        setProductCount(0);
        setAllProducts([]);
        try {
            const res = await fetch(`/api/product/getByCategory/${categoryName}?page=${page}&limit=10`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.findProductByCategory);
                setTotalPage(data.totalPages);
                setProductCount(data.totalNumber);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    const handleClickCategory = (categoryName) => {
        setNewSearchKey('');
        setSelectCategory(categoryName);
        setPage(1);
        handleFetchProductByCategory(categoryName, page);
    }

    const handleClickAll = () => {
        setNewSearchKey('');
        setSelectCategory('all');
        setPage(1);
        handleFetchProductsPagination(page);
    }

    const handleFilterProduct = async () => {
        setLoadingProduct(true);
        try {
            const res = await fetch(`/api/product/getProductByFilter/${sortType}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    products: allProducts
                })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data);
            }

        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingProduct(false);
        }
    }

    useEffect(() => {
        if (sortType) {
            handleFilterProduct();
        }
    }, [sortType])

    return (
        <>
            <Navigation />
            <Navbar />
            <div className='h-screen overflow-y-scroll w-full p-[20px] flex flex-col gap-[40px]'>
                <Filter newSearchKey={newSearchKey} setNewSearchKey={setNewSearchKey} showType={showType} setShowType={setShowType} sortType={sortType} setSortType={setSortType} productCount={productCount} handleFetchProductBySearchKey={handleFetchProductBySearchKey} />
                <div className='flex max-md:flex-col gap-[30px]'>
                    {/* SIDE BAR */}
                    <div className='w-[250px]'>
                        <h3 className='text-[20px] font-semibold mb-[20px]'>Danh mục</h3>
                        {
                            loadingCategory ? (
                                <Loader />
                            ) : (
                                <div className='flex flex-col max-md:flex-row max-md:flex-wrap max-md:items-center gap-[20px] animate__animated animate__fadeInUp '>
                                    <p onClick={() => handleClickAll('all')} className={` cursor-pointer ${selectCategory === 'all' ? 'text-red-400 font-semibold underline' : ''}`}>Tất cả</p>
                                    {
                                        allCategories?.map((category, index) => (
                                            <p key={index} onClick={() => handleClickCategory(category.name)} className={`cursor-pointer ${selectCategory === category.name ? 'text-red-400 font-semibold underline' : ""}`}>{category.title}</p>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>

                    {/* SHOW PRODUCTS */}
                    <>
                        {
                            loadingProducts ? (
                                <Loader />
                            ) : !Array.isArray(allProducts) || allProducts.length === 0 ? (
                                <p>Không tìm thấy sản phẩm nào!</p>
                            ) : (
                                <div className='flex-1'>
                                    {
                                        showType === 'grid' ? (
                                            <div className='flex flex-wrap flex-1 gap-[20px] mb-[40px]'>
                                                {allProducts?.map((product, index) => (
                                                    <ProductCard key={index} product={product} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='flex flex-col gap-[20px]'>
                                                {allProducts?.map((product, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => { navigate(`/productDetail/${product._id}`) }}
                                                        className='flex gap-[10px] animate__animated animate__zoomIn cursor-pointer'>
                                                        <div className='w-[300px] h-[400px] overflow-hidden'>
                                                            <img src={product?.listingPhotoPaths[0]} alt="image" className='w-full h-full object-cover rounded-[10px] transform transition-transform ease-in hover:scale-110' />
                                                        </div>
                                                        <div className='flex flex-col w-[300px] gap-[10px]'>
                                                            <span>{product.name}</span>
                                                            <span className='font-semibold text-[12px]'>{product.price}&#8363;</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    }
                                    <div className='flex justify-center items-center gap-[10px] mb-[40px]'>
                                        <button onClick={handlePreviousPage} disabled={page === 1}>{`<`}</button>
                                        <p>{page}/{totalPage}</p>
                                        <button onClick={handleNextPage} disabled={page === totalPage}>{`>`}</button>
                                    </div>
                                </div>
                            )
                        }
                    </>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Search
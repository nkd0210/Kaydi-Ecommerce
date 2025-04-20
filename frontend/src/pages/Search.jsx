import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import Filter from "../components/Filter";
import ProductCard from "../components/ProductCard";

import "animate.css";
import Skeleton from "@mui/material/Skeleton";
import SearchSidebar from "../components/SearchSidebar";

const Search = () => {
    const { currentUser } = useSelector((state) => state.user);
    const { searchKey } = useParams();

    const [newSearchKey, setNewSearchKey] = useState("");

    const navigate = useNavigate();

    const [allProducts, setAllProducts] = useState([]);
    const [loadingProducts, setLoadingProduct] = useState(false);

    const [allCategories, setAllCategories] = useState([]);
    const [loadingCategory, setLoadingCategory] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [productCount, setProductCount] = useState(0);

    const [selectCategory, setSelectCategory] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [showType, setShowType] = useState("grid");
    const [sortType, setSortType] = useState("");

    // lay tat ca product (default vua vao trang search se goi ham nay luon)
    const handleFetchProductsPagination = async (page) => {
        setLoadingProduct(true);
        setTotalPage(1);
        setProductCount(0);
        setAllProducts([]);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getProductPagination?page=${page}&limit=12`,
                {
                    method: "GET",
                    credentials: 'include',
                }
            );
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
            setTimeout(() => {
                setLoadingProduct(false);
            }, 1000);
        }
    };

    // lay tat ca category (default vua vao trang search se goi ham nay luon)
    const handleFetchAllCategories = async () => {
        setLoadingCategory(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/category/getAllCategories`, {
                method: "GET",
                credentials: 'include',
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
            setTimeout(() => {
                setLoadingCategory(false);
            }, 1000);
        }
    };

    // xu ly khi an sang trang khac
    const handleNextPage = () => {
        if (page < totalPage) {
            setPage((prevPage) => {
                const newPage = prevPage + 1;
                if (selectCategory === "all") {
                    handleFetchProductCombination(selectCategory, minPrice, maxPrice, newPage);
                } else if (selectCategory && selectCategory !== "all") {
                    handleFetchProductCombination(selectCategory, minPrice, maxPrice, newPage);
                } else if (!selectCategory && newSearchKey) {
                    handleFetchProductBySearchKey(newPage);
                }
                return newPage;
            });
        }
    };

    // xu ly khi an quay lai trang truoc
    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prevPage) => {
                const newPage = prevPage - 1;
                if (selectCategory === "all") {
                    handleFetchProductCombination(selectCategory, minPrice, maxPrice, newPage);
                } else if (selectCategory && selectCategory !== "all") {
                    handleFetchProductCombination(selectCategory, minPrice, maxPrice, newPage);
                } else if (!selectCategory && newSearchKey) {
                    handleFetchProductBySearchKey(newPage);
                }
                return newPage;
            });
        }
    };

    // xu ly khi thay doi category
    const handleCategoryCheckChange = (categoryName) => {
        setNewSearchKey("");
        setPage(1);
        if (categoryName === "all") {
            setSelectCategory("all");
            handleFetchProductCombination(categoryName, minPrice, maxPrice, 1);
        } else {
            setSelectCategory(categoryName);
            handleFetchProductCombination(categoryName, minPrice, maxPrice, 1);
        }
    };

    // xu ly khi co gia tri searchKey
    const handleFetchProductBySearchKey = async (page, searchKey) => {
        setLoadingProduct(true);
        setTotalPage(1);
        setProductCount(0);
        setAllProducts([]);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getProductBySearch/${searchKey}?page=${page}&limit=10`,
                {
                    method: "GET",
                    credentials: 'include',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.findProducts || []);
                setTotalPage(data.totalPages || 1);
                setProductCount(data.totalNumber || 0);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingProduct(false);
            }, 1000);
        }
    };

    // xu ly khi thay doi gia tri filter(sap xep theo sortType: gia/ten)
    const handleFilterProduct = async () => {
        setLoadingProduct(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getProductByFilter/${sortType}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    products: allProducts,
                }),
                credentials: 'include',
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
    };

    // xu ly khi tick vao o check box phan price hoac category
    const handleFetchProductCombination = async (categoryName, minPrice, maxPrice, page) => {
        setLoadingProduct(true);
        setTotalPage(1);
        setProductCount(0);
        setAllProducts([]);

        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/product/getProductCombination/${categoryName}?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&limit=8`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.products);
                setTotalPage(data.totalPages);
                setProductCount(data.totalNumber);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setTimeout(() => {
                setLoadingProduct(false);
            }, 1000);
        }
    }

    // ham nay duoc goi 1 lan khi vua vao trang Search
    useEffect(() => {
        setSelectCategory("all");
        handleFetchAllCategories();
        if (!searchKey || searchKey === null || searchKey === undefined) {
            if (!selectCategory || selectCategory === 'all') {
                handleFetchProductsPagination(1);
            }
        }
    }, []);

    // ham nay duoc goi khi thay doi gia tri searchKey hoac thay doi gia tri sortType(sap xep theo ten/gia)
    useEffect(() => {
        if (searchKey) {
            setPage(1);
            setSelectCategory("");
            setMinPrice(null);
            setMaxPrice(null);
            setSelectedPriceRange("")
            handleFetchProductBySearchKey(1, searchKey);
        }
        if (sortType && sortType !== "default") {
            handleFilterProduct();
        }
    }, [searchKey, sortType]);

    // ham nay duoc goi khi gia tri minPrice hoac maxPrice thay doi
    useEffect(() => {
        let tempCategory = '';
        if (selectCategory) {
            tempCategory = selectCategory;
            if (minPrice > 0 || maxPrice > 0) {
                handleFetchProductCombination(tempCategory, minPrice, maxPrice, 1);
            }
        } else {
            tempCategory = 'all';
            if (minPrice > 0 || maxPrice > 0) {
                handleFetchProductCombination(tempCategory, minPrice, maxPrice, 1);
            }
        }
    }, [minPrice, maxPrice])

    return (
        <>
            <Navigation />
            <Navbar />
            <div className="container mx-auto overflow-x-clip">
                <div className="h-screen overflow-y-scroll w-full p-[20px] flex flex-col gap-[40px]">
                    <Filter
                        selectCategory={selectCategory}
                        newSearchKey={newSearchKey}
                        setNewSearchKey={setNewSearchKey}
                        showType={showType}
                        setShowType={setShowType}
                        sortType={sortType}
                        setSortType={setSortType}
                        productCount={productCount}
                        handleFetchProductBySearchKey={handleFetchProductBySearchKey}
                    />
                    <div className="flex max-md:flex-col gap-[30px]">
                        {/* SIDE BAR */}
                        <SearchSidebar
                            allCategories={allCategories}
                            selectCategory={selectCategory}
                            handleCategoryCheckChange={handleCategoryCheckChange}
                            loadingCategory={loadingCategory}
                            setMinPrice={setMinPrice}
                            setMaxPrice={setMaxPrice}
                            selectedPriceRange={selectedPriceRange}
                            setSelectedPriceRange={setSelectedPriceRange}
                            setSelectCategory={setSelectCategory}
                        />

                        {/* SHOW PRODUCTS */}
                        <>
                            {loadingProducts ? (
                                <div className="flex gap-[10px] items-center">
                                    <Skeleton
                                        width={300}
                                        height={400}
                                        animation="wave"
                                        sx={{ bgcolor: "grey.100" }}
                                    />
                                    <Skeleton
                                        width={300}
                                        height={400}
                                        animation="wave"
                                        sx={{ bgcolor: "grey.100" }}
                                    />
                                    <Skeleton
                                        width={300}
                                        height={400}
                                        animation="wave"
                                        sx={{ bgcolor: "grey.100" }}
                                    />
                                    <Skeleton
                                        width={300}
                                        height={400}
                                        animation="wave"
                                        sx={{ bgcolor: "grey.100" }}
                                    />
                                    <Skeleton
                                        width={300}
                                        height={400}
                                        animation="wave"
                                        sx={{ bgcolor: "grey.100" }}
                                    />
                                </div>
                            ) : !Array.isArray(allProducts) || allProducts.length === 0 ? (
                                <p>Không tìm thấy sản phẩm nào!</p>
                            ) : (
                                <div className="flex-1 ">
                                    {showType === "grid" ? (
                                        <div className="flex flex-wrap flex-1 gap-[20px] mb-[40px]">
                                            {allProducts?.map((product, index) => (
                                                <ProductCard key={index} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-[20px]">
                                            {allProducts?.map((product, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        navigate(`/productDetail/${product._id}`);
                                                    }}
                                                    className="flex gap-[10px] animate__animated animate__fadeIn cursor-pointer border rounded-[20px] p-[10px] bg-gray-50"
                                                >
                                                    <div className="w-[150px] h-[200px] overflow-hidden">
                                                        <img
                                                            src={product?.listingPhotoPaths[0]}
                                                            alt="image"
                                                            className="w-full h-full object-cover rounded-[20px] transform transition-transform ease-in hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-[300px] gap-[10px]">
                                                        <span>{product.name}</span>
                                                        <span className="font-semibold text-[12px]">
                                                            {product.price}&#8363;
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex justify-center items-center gap-[10px] my-[40px]">
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={page === 1}
                                        >{`<`}</button>
                                        <p>
                                            {page}/{totalPage}
                                        </p>
                                        <button
                                            onClick={handleNextPage}
                                            disabled={page === totalPage}
                                        >{`>`}</button>
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Search;

import React, { useState, useEffect } from "react";
import Logo from "/Kaydi.png";
import Logo2 from "/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import styled from "styled-components";

import { setCartStart, setCartSuccess } from "../redux/cart/cartSlice";

import { CiSettings } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import { ImReply } from "react-icons/im";
import { MdOutlinePolicy } from "react-icons/md";
import { FaRocketchat } from "react-icons/fa6";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

import Drawer from "@mui/material/Drawer";

import 'animate.css'

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { items, cartCount } = useSelector((state) => state.cart);

    const [categories, setCategories] = useState([]);

    const handleFetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/category/getAllCategories`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setCategories(data.allCategories);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const [userModal, setUserModal] = useState(false);

    const toggleUser = (booleanOpen) => {
        setUserModal(booleanOpen);
    };

    const [userCart, setUserCart] = useState({}); // contain the data of the cart in redux

    const handleFetchUserCart = async () => {
        dispatch(setCartStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cart/getUserCart/${currentUser._id}`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserCart(data);
                dispatch(setCartSuccess(data));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        handleFetchCategories();
        if (currentUser) {
            handleFetchUserCart();
        }
    }, []);

    const handleClickCategory = async (category, subcategory = '') => {
        const path = subcategory ? `/collections/${category}/${subcategory}` : `/collections/${category}`;
        navigate(path);
    }

    const [isScroll, setIsScroll] = useState(false);

    // const handleScroll = () => {
    //     if (window.scrollY > 42) {
    //         setIsScroll(true);
    //     } else {
    //         setIsScroll(false);
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [])

    // CSS: className={`fixed transition-all duration-300 ${isScroll ? 'top-[0px]' : 'top-[42px]'} w-full z-[50]`}

    const [searchValue, setSearchValue] = useState('');

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    }


    return (
        <Wrapper >
            <div className="relative w-full flex justify-between items-center px-[20px] bg-[#212121] text-white">
                {/* LOGO */}
                <div onClick={() => navigate("/")} className="w-[80px] h-[80px]">
                    <img src={Logo2} alt="logo" className="w-full h-full object-cover cursor-pointer" loading="lazy" />
                </div>

                {/* CATEGORY */}
                <div className="max-md:hidden">
                    <ul className="flex ">
                        {categories?.map((category, index) => (
                            <li className="group px-[20px] py-[30px] cursor-pointer hover:bg-[#505050]" key={index}>
                                <div onClick={() => { handleClickCategory(category.name) }} className="cursor-pointer hover:font-semibold uppercase text-[16px] max-lg:text-[14px]">
                                    {category.title}
                                </div>
                                {/* expand */}
                                <div className="absolute bottom-[-200px] text-black p-[20px] left-1/2 transform -translate-x-1/2 bg-white border rounded-b-[10px] h-[200px] w-[1000px] shadow-xl hidden group-hover:block z-[10] animate__animated animate__fadeIn">
                                    <div className="flex gap-[20px]">
                                        <div className="w-[600px]">
                                            <h3 className="text-[20px] text-red-400 uppercase font-semibold pb-[10px] border-b-[2px] border-black w-[120px]">Bộ sưu tập</h3>
                                            <div className="flex gap-[20px]">
                                                <div className="flex flex-wrap border-black gap-[30px] pt-[20px]">
                                                    {category.description.map((item, index) => (
                                                        <p key={index} className="cursor-pointer text-[18px] hover:font-semibold" onClick={() => handleClickCategory(category.name, item)}>
                                                            {item}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            category.heroImage && (
                                                <div className="w-[400px] h-[150px] border shadow-md">
                                                    <img src={category.heroImage} alt="hero" className="w-full h-full object-cover" />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SEARCH + USER + CART */}
                <div className="flex gap-[20px] justify-end items-center ">
                    <div className="border rounded-[20px] w-[200px] p-[10px] bg-white flex gap-[10px]">
                        <div>
                            <CiSearch className="text-gray-600 text-[20px] cursor-pointer" onClick={() => navigate(`/search/${searchValue}`)} />
                        </div>
                        <input
                            value={searchValue}
                            onChange={handleChange}
                            type="text"
                            placeholder="Tìm kiếm sản phẩm"
                            className="w-full text-gray-600"
                        />
                    </div>
                    <div>
                        {currentUser ? (
                            <FaRegUser
                                onClick={() => toggleUser(true)}
                                className="text-[20px] cursor-pointer"
                            />
                        ) : (
                            <Link to="/signIn">
                                <FaRegUser className="text-[20px]" />
                            </Link>
                        )}
                    </div>
                    <div>
                        {currentUser ? (
                            <div className="relative">
                                <HiOutlineShoppingBag onClick={() => navigate('/cart')} className="text-[30px] cursor-pointer" />
                                <div className="absolute top-[-5px] right-[-4px] font-semibold text-white text-[12px] rounded-[50%] px-[5px] cursor-pointer bg-red-400">{cartCount}</div>
                            </div>
                        ) : (
                            <Link to="/signIn">
                                <HiOutlineShoppingBag className="text-[20px]" />
                            </Link>
                        )}
                    </div>
                </div>

                <Drawer anchor="right" open={userModal} onClose={() => toggleUser(false)}>
                    <div className="w-[400px] max-md:w-[200px] h-full bg-white shadow-lg p-6 text-black">
                        <h2>Hi, {currentUser?.username}</h2>
                        <hr className="w-full mt-[20px] h-[2px] bg-gray-200" />
                        <div className="flex flex-wrap gap-[20px] ">
                            <div
                                onClick={() => navigate("/profile/account")}
                                className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                            >
                                <CiSettings className="text-[20px]" />
                                <h3 className="text-[12px]">Cài đặt tài khoản</h3>
                            </div>
                            <div
                                onClick={() => navigate("/profile/history")}
                                className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                            >
                                <FaHistory className="text-[20px]" />
                                <h3 className="text-[12px]">Lịch sử đơn hàng</h3>
                            </div>
                            <div
                                onClick={() => navigate("/profile/address")}
                                className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                            >
                                <FaAddressBook className="text-[20px]" />
                                <h3 className="text-[12px]">Sổ địa chỉ</h3>
                            </div>
                            <div
                                onClick={() => navigate("/profile/reply")}
                                className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                            >
                                <ImReply className="text-[20px]" />
                                <h3 className="text-[12px]">Đánh giá </h3>
                            </div>
                            <div
                                onClick={() => navigate("/profile/policy")}
                                className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                            >
                                <MdOutlinePolicy className="text-[20px]" />
                                <h3 className="text-[12px]">FAQ & Chính sách</h3>
                            </div>
                            <div
                                onClick={() => navigate("/chat")}
                                className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                            >
                                <FaRocketchat className="text-[20px]" />
                                <h3 className="text-[12px]">Nhắn tin</h3>
                            </div>
                            {
                                currentUser?.isAdmin && (
                                    <div
                                        onClick={() => navigate("/admin")}
                                        className="cursor-pointer hover:bg-opacity-70 flex flex-col justify-center items-center w-[100px] h-[80px] text-center border bg-gray-200 rounded-[10px] mt-[10px] p-[10px]"
                                    >
                                        <MdOutlineAdminPanelSettings className="text-[20px]" />
                                        <h3 className="text-[12px]"> Dashboard</h3>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </Drawer>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section``;

export default Navbar;

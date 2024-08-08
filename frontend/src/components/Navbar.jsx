import React, { useState, useEffect } from "react";
import Logo from "/Kaydi.png";
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

import Drawer from "@mui/material/Drawer";


const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { items, cartCount } = useSelector((state) => state.cart);

    const [categories, setCategories] = useState([]);

    const handleFetchCategories = async () => {
        try {
            const res = await fetch('/api/category/getAllCategories', {
                method: "GET",
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
            const res = await fetch(`/api/cart/getUserCart/${currentUser._id}`, {
                method: "GET",
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
        handleFetchUserCart();
    }, []);

    // console.log(userCart)

    return (
        <Wrapper>
            <div className="flex justify-between items-center px-[20px] bg-[#000] text-white">
                {/* LOGO */}
                <div onClick={() => navigate("/")} className="w-[80px] h-[80px]">
                    <img src={Logo} alt="logo" className="w-full h-full object-cover cursor-pointer" />
                </div>

                {/* CATEGORY */}
                <div className="max-md:hidden">
                    <ul className="flex gap-[20px]">
                        {categories?.map((category, index) => (
                            <li className="relative group" key={index}>
                                {category.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SEARCH + USER + CART */}
                <div className="flex gap-[20px] justify-end items-center ">
                    <div className="border rounded-[20px] w-[200px] p-[10px] bg-white flex gap-[10px]">
                        <div>
                            <CiSearch className="text-gray-600 text-[20px]" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm"
                            className="w-full text-gray-600"
                        />
                    </div>
                    <div>
                        {currentUser ? (
                            <FaRegUser
                                onClick={() => toggleUser(true)}
                                className="text-[24px] cursor-pointer"
                            />
                        ) : (
                            <Link to="/signIn">
                                <FaRegUser className="text-[24px]" />
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
                    <div className="w-[400px] bg-white shadow-lg p-6 text-black">
                        <h2>Hi, {currentUser?.username}</h2>
                        <hr className="w-full mt-[20px] h-[2px] bg-gray-200" />
                        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[10px] ">
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
                        </div>
                    </div>
                </Drawer>
            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section``;

export default Navbar;

import React, { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import { useSelector, useDispatch } from 'react-redux'
import { setCartStart, setCartSuccess } from "../redux/cart/cartSlice";
import Loader from '../components/Loader';

import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

const UserCart = () => {

    const { currentUser } = useSelector((state) => state.user);
    const { items, cartCount } = useSelector((state) => state.cart);

    const [userCart, setUserCart] = useState({}); // contain the data of the cart
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleFetchUserCart = async () => {
        dispatch(setCartStart());
        setLoading(true);
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
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchUserCart();
    }, []);

    const handleIncrease = async (item) => {
        if (item) {
            const formToggle = {
                productId: item.productId,
                color: item.color,
                size: item.size,
                quantity: 1,
                actionType: "inc"
            };
            setLoading(true);
            try {
                const res = await fetch(`/api/cart/updateUserCart/${currentUser._id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formToggle)
                });
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                } else {
                    setUserCart(data);
                    dispatch(setCartSuccess(data));
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }

        }
    }
    const handleDecrease = async (item) => {
        if (item) {
            const formToggle = {
                productId: item.productId,
                color: item.color,
                size: item.size,
                quantity: 1,
                actionType: "dec"
            };
            setLoading(true);
            try {
                const res = await fetch(`/api/cart/updateUserCart/${currentUser._id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formToggle)
                });
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                } else {
                    setUserCart(data);
                    dispatch(setCartSuccess(data));
                    setLoading(false);
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div>
            <Navigation />
            <Navbar />
            <div className='p-[20px] max-md:p-[10px] w-full overflow-x-scroll'>
                <h1 className='text-center text-[24px] font-semibold'>Your Shopping Cart</h1>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {Object.keys(items).length === 0 ? (
                            <div className='flex justify-center items-center mt-[200px] max-md:mt-[100px] border rounded-[5px] w-[300px] h-[100px] text-[20px] text-red-400 mx-auto text-center shadow-lg'>
                                Giỏ hàng trống ! <br /> Vui lòng thêm sản phẩm
                            </div>
                        ) : (
                            <div className="w-full max-md:w-[500px] mt-[20px]">
                                <table className='w-full border-collapse'>
                                    <thead>
                                        <tr className="border-b-[2px] ">
                                            <th className="p-[10px] text-left">#</th>
                                            <th className="p-[10px] text-left">Name</th>
                                            <th className="p-[10px] text-left">Image</th>
                                            <th className="p-[10px] text-left">Color</th>
                                            <th className="p-[10px] text-left">Size</th>
                                            <th className="p-[10px] text-left">Price</th>
                                            <th className="p-[10px] text-left">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index} className="border-b-[2px]">
                                                <td className="p-[10px]">{index + 1}</td>
                                                <td className="p-[10px]">{item.name}</td>
                                                <td className="p-[10px]">
                                                    <img src={item.image} alt="" className="w-[50px] h-[50px] object-cover" />
                                                </td>
                                                <td className="p-[10px]">{item.color}</td>
                                                <td className="p-[10px]">{item.size}</td>
                                                <td className="p-[10px]">{item.price}</td>
                                                <td className="p-[10px]">
                                                    <div className='flex gap-[5px] items-center'>
                                                        <CiCircleMinus className='text-[20px]' onClick={() => handleDecrease(item)} />
                                                        {item.quantity}
                                                        <CiCirclePlus className='text-[20px]' onClick={() => handleIncrease(item)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    )
}

export default UserCart
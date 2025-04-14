import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import { useSelector, useDispatch } from 'react-redux'
import { setCartStart, setCartSuccess } from "../redux/cart/cartSlice";
import Loader from '../components/Loader';
import { setClearOrder, setOrderStart } from '../redux/order/orderSlice';

import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt } from "react-icons/fa";
import 'animate.css'

const UserCart = () => {

    const { currentUser } = useSelector((state) => state.user);
    const { items, cartCount } = useSelector((state) => state.cart);

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFetchUserCart = async () => {
        dispatch(setCartStart());
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cart/getUserCart/${currentUser._id}`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
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

    const handleIncrease = async (item, e) => {
        e.stopPropagation();
        if (item) {
            const formToggle = {
                productId: item.productId,
                color: item.color,
                size: item.size,
                quantity: 1,
                actionType: "inc"
            };
            // setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cart/updateUserCart/${currentUser._id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formToggle),
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                } else {
                    dispatch(setCartSuccess(data));
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }

        }
    }
    const handleDecrease = async (item, e) => {
        e.stopPropagation();
        if (item) {
            const formToggle = {
                productId: item.productId,
                color: item.color,
                size: item.size,
                quantity: 1,
                actionType: "dec"
            };
            // setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cart/updateUserCart/${currentUser._id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formToggle),
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                } else {
                    dispatch(setCartSuccess(data));
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleRemoveItem = async (item, e) => {
        e.stopPropagation();
        if (item) {
            const formRemove = {
                userId: currentUser._id,
                productId: item.productId,
                color: item.color,
                size: item.size
            };
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/cart/removeFromCart`, {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formRemove),
                    credentials: 'include',
                });
                const data = await res.json();
                if (!res.ok) {
                    console.log(data.message);
                } else {
                    dispatch(setCartSuccess(data));
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }

    }


    // order item
    const [chooseItems, setChooseItems] = useState([]);

    const handleChooseItem = (e, item) => {
        const isChecked = e.target.checked;

        setChooseItems(prevItems => {
            if (isChecked) {
                if (!prevItems.find(i => i.productId === item.productId && i.color === item.color && i.size === item.size)) {
                    return [...prevItems, item];
                }
            } else {
                return prevItems.filter(i => !(i.productId === item.productId && i.color === item.color && i.size === item.size));
            }
            return prevItems;
        })
    }

    const handleShowErrorMessage = (message) => {
        toast.error(message)
    }

    const handleClickBuy = async () => {

        dispatch(setClearOrder());

        const totalPrice = chooseItems.reduce(
            (total, item) => total + item.quantity * item.price, 0
        )

        const formOrder = {
            items: chooseItems,
            totalPrice: totalPrice
        }

        if (formOrder.items.length === 0) {
            handleShowErrorMessage('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }
        try {
            dispatch(setOrderStart(formOrder));
            navigate('/order')
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div>
            <Navigation />
            <Navbar />
            <div className='p-[20px] max-md:p-[10px] w-full overflow-x-scroll h-[400px] max-md:h-[600px] overflow-y-scroll'>
                <h1 className='text-center text-[24px] font-semibold'>Your Shopping Cart</h1>
                <ToastContainer />
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
                                <table className='w-full border-collapse overflow-y-scroll animate__animated animate__fadeInUp'>
                                    <thead>
                                        <tr className="border-b-[2px] ">
                                            <th className="p-[10px] text-left"> <input type="checkbox" className='w-[20px] h-[20px]' /></th>
                                            <th className="p-[10px] text-left">#</th>
                                            <th className="p-[10px] text-left">Name</th>
                                            <th className="p-[10px] text-left">Image</th>
                                            <th className="p-[10px] text-left">Color</th>
                                            <th className="p-[10px] text-left">Size</th>
                                            <th className="p-[10px] text-left">Price</th>
                                            <th className="p-[10px] text-left">Quantity</th>
                                            <th className="p-[10px] text-left">Option</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr onClick={() => navigate(`/productDetail/${item?.productId}`)} key={index} className="border-b-[2px] cursor-pointer">
                                                <td className="p-[10px]">
                                                    <input
                                                        type="checkbox"
                                                        className='w-[20px] h-[20px]'
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => handleChooseItem(e, item)}
                                                        checked={chooseItems.some(i => i.productId === item.productId && i.color === item.color && i.size === item.size)}
                                                    />
                                                </td>
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
                                                        <CiCircleMinus className='text-[20px]' onClick={(e) => handleDecrease(item, e)} />
                                                        {item.quantity}
                                                        <CiCirclePlus className='text-[20px]' onClick={(e) => handleIncrease(item, e)} />
                                                    </div>
                                                </td>
                                                <td className='p-[10px]'>
                                                    <FaTrashAlt onClick={(e) => handleRemoveItem(item, e)} className='text-center text-[18px] hover:text-red-500 cursor-pointer' />
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

            <div className='fixed bottom-0 overflow-y-scroll w-full h-[200px] bg-gray-100 p-[20px] max-md:p-[10px] animate__animated animate__fadeInUp'>
                <h3 className='pb-[20px] font-semibold text-[20px]'>Thanh toán: </h3>
                {chooseItems.map((chooseItem, index) => (
                    <div key={index} className='flex justify-between max-md:flex-col max-md:gap-[20px] border-b-[2px] py-[20px] animate__animated animate__fadeInUp'>
                        <div className='flex'>
                            <p className='w-[40px]'>{`${index + 1})`}</p>
                            <div className='flex flex-col gap-[10px] w-[400px]'>
                                <p className='uppercase'>{chooseItem.name}</p>
                                <p className='uppercase'>{chooseItem.color} / {chooseItem.size}</p>
                            </div>
                        </div>
                        <div className='flex gap-[10px] w-[100px]'>
                            <p className='uppercase'>Số lượng: </p>
                            <p className='font-semibold'>{chooseItem.quantity}</p>
                        </div>
                        <div className='flex gap-[10px] w-[200px]'>
                            <p className='uppercase'>Giá sản phẩm:  </p>
                            <p className='font-semibold'>{chooseItem.price}&#8363;</p>
                        </div>

                    </div>
                ))}
                <div className='flex flex-col items-end py-[20px] gap-[10px] '>
                    <div className='w-[200px] flex'>
                        <p className='uppercase mr-[10px]'>Tổng tiền: </p>
                        <p className='font-semibold text-red-400'>
                            {
                                chooseItems.reduce(
                                    (total, item) => total + item.quantity * item.price, 0
                                )
                            }
                            &#8363;
                        </p>
                    </div>
                    <div onClick={handleClickBuy} className='w-[200px] bg-red-400 text-center rounded-[10px] py-[5px] text-white hover:text-black cursor-pointer'>
                        Mua hàng
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCart
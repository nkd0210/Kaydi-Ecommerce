import { useState, useEffect, useRef } from 'react'


import { MdDashboard } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { SiVirustotal } from "react-icons/si";
import { FaGripLinesVertical } from "react-icons/fa";

import EditCategory from './category/EditCategory';
import SingleOrder from './order/SingleOrder';
import Loader from '../Loader';

const Order = () => {

    const [allOrders, setAllOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState([]);
    const [lastWeekOrders, setLastWeekOrders] = useState([]);
    const [lastMonthOrders, setLastMonthOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const handleFetchOrder = async () => {
        setLoadingOrders(true);
        try {
            const res = await fetch(`/api/order/getAllOrders`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllOrders(data.findOrder);
                setLastMonthOrders(data.lastMonthOrder);
                setLastWeekOrders(data.lastWeekOrder);
                setTotalOrders(data.numberOfOrder);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingOrders(false);
        }
    }

    useEffect(() => {
        handleFetchOrder();
    }, [])

    const [orderType, setOrderType] = useState('all')


    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll bg-gray-100'>
            {
                loadingOrders ? (
                    <Loader />
                ) : (
                    <>

                        <div className='flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                            <div className='flex gap-[20px] items-center'>
                                <MdDashboard className='text-[30px]' />
                                <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Order Dashboard</h1>
                            </div>
                            <div className='flex gap-[20px] items-center max-md:flex-col max-md:items-start'>
                                <div className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                    <IoIosPrint className='text-[20px]' />
                                    <p className='text-[16px]'>Print Excel</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-[10px] mt-[20px] items-center'>
                            <FaBusinessTime className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>Business Overview</h3>
                        </div>

                        <div className='flex max-md:flex-wrap justify-center max-md:justify-start items-center gap-[20px] py-[30px] animate__animated animate__fadeIn'>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <SiVirustotal className='text-[20px]' />
                                    <span>Total order: </span>
                                </div>
                                <p>{totalOrders}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <LiaCalendarWeekSolid className='text-[20px]' />
                                    <span>Last week order: </span>
                                </div>
                                <p>{lastWeekOrders}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <MdCalendarMonth className='text-[20px]' />
                                    <span>Last month order: </span>
                                </div>
                                <p>{lastMonthOrders}</p>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <MdCategory className='text-[20px]' />
                            <h3 onClick={() => setOrderType('all')} className={`text-[16px] ${orderType === 'all' ? 'text-red-500' : ''} font-semibold cursor-pointer hover:text-red-500`}>All Orders</h3>
                            <FaGripLinesVertical className='text-[20px]' />
                            <h3 onClick={() => setOrderType('customer')} className={`text-[16px] ${orderType === 'customer' ? 'text-red-500' : ''} font-semibold cursor-pointer hover:text-red-500`}>Customer Orders</h3>

                        </div>

                        <div className='border rounded-[20px] mt-[20px] p-[10px] bg-white max-h-full max-w-full overflow-x-scroll overflow-y-scroll'>
                            {Object.keys(allOrders).length === 0 ? (
                                <div>Empty order! </div>
                            ) : (
                                <div className='flex flex-col gap-[40px]'>
                                    {orderType === 'all' ? (
                                        <>
                                            {
                                                allOrders?.map((order, index) => (
                                                    <SingleOrder key={index} order={order} handleFetchOrder={handleFetchOrder} />
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <>
                                            {

                                            }
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Order
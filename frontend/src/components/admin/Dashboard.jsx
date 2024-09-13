import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// CHART
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

import 'animate.css';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Dashboard = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [categoriesInfo, setCategoriesInfo] = useState({});
    const [productsInfo, setProductsInfo] = useState({});
    const [usersInfo, setUsersInfo] = useState({});
    const [loading, setLoading] = useState(false);


    const handleFetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/category/getAllCategories`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setCategoriesInfo(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/product/getAllProduct`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setProductsInfo(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/user/getallusers`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUsersInfo(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const [orderInfo, setOrderInfo] = useState([]);
    const [order, setOrder] = useState([]);

    const handleFetchOrders = async () => {
        try {
            const res = await fetch(`/api/order/getAllOrders`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderInfo(data);
                setOrder(data?.findOrder);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const [orderPerDay, setOrderPerDay] = useState([]);

    const handleFetchTotalAmountPerDay = async () => {
        try {
            const res = await fetch(`/api/order/getTotalAmountPerDay`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderPerDay(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const [voucherInfo, setVoucherInfo] = useState({});
    const [vouchers, setVouchers] = useState([]);

    const handleFetchVouchers = async () => {
        try {
            const res = await fetch(`/api/voucher/getAllVouchers/${currentUser._id}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setVoucherInfo(data);
                setVouchers(data?.vouchers);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        handleFetchCategories();
        handleFetchProducts();
        handleFetchUsers();
        handleFetchOrders();
        handleFetchTotalAmountPerDay();
        handleFetchVouchers();
    }, [])


    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll'>
            <h1 className='uppercase font-semibold text-[22px]'>Admin Dashboard</h1>

            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[20px] uppercase'>Overview</h2>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px] animate__animated animate__fadeInRight'>
                    <h2 className='text-[18px]'>User</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total users:</span>
                            {usersInfo?.userCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week users created:</span>
                            {usersInfo?.lastWeekUsersCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month users created:</span>
                            {usersInfo?.lastMonthUsersCount}
                        </div>
                    </div>
                </div>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px] animate__animated animate__fadeInRight'>
                    <h2 className='text-[18px]'>Category</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total categories:</span>
                            {categoriesInfo?.totalCategory}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week categories created:</span>
                            {categoriesInfo?.lastWeekCategoryCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month categories created:</span>
                            {categoriesInfo?.lastMonthCategoryCount}
                        </div>
                    </div>
                </div>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px] animate__animated animate__fadeInRight'>
                    <h2 className='text-[18px]'>Product</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total products:</span>
                            {productsInfo?.totalNumber}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week products created:</span>
                            {productsInfo?.lastWeekProductCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month products created:</span>
                            {productsInfo?.lastMonthProductCount}
                        </div>
                    </div>
                </div>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px] animate__animated animate__fadeInRight'>
                    <h2 className='text-[18px]'>Order</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total orders:</span>
                            {orderInfo?.numberOfOrder}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week orders created:</span>
                            {orderInfo?.lastWeekOrder}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month orders created:</span>
                            {orderInfo?.lastMonthOrder}
                        </div>
                    </div>
                </div>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px] animate__animated animate__fadeInRight'>
                    <h2 className='text-[18px]'>Voucher</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total vouchers:</span>
                            {voucherInfo?.totalVouchers}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week vouchers created:</span>
                            {voucherInfo?.lastWeekVouchersCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month vouchers created:</span>
                            {voucherInfo?.lastMonthVouchersCount}
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[20px] uppercase'>Diagram</h2>

                <div className='chart flex flex-col gap-[50px] py-[20px] animate__animated animate__fadeInUp'>
                    {/* BAR CHART */}
                    <div>
                        <h3 className='uppercase mb-[20px] text-[18px] font-semibold'>order bar chart</h3>
                        <div className='w-[full] h-[350px] rounded-[10px] border border-black mb-[20px] p-[20px]'>
                            <Bar
                                data={{
                                    labels: orderPerDay?.map((data) => data._id),
                                    datasets: [
                                        {
                                            label: "Total price per day",
                                            data: orderPerDay?.map((data) => data.totalAmount),
                                            borderRadius: 10,
                                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                                            borderColor: "rgba(75, 192, 192, 1)",
                                            borderWidth: 1,
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>

                    {/* LINE CHART */}
                    <div>
                        <h3 className='uppercase mb-[20px] text-[18px] font-semibold'>order line chart</h3>
                        <div className='w-[full] h-[350px] rounded-[10px] border border-black mb-[20px] p-[20px]'>
                            <Line
                                data={{
                                    labels: orderPerDay?.map((data) => data._id),
                                    datasets: [
                                        {
                                            label: "Total price per day",
                                            data: orderPerDay?.map((data) => data.totalAmount),
                                            borderRadius: 10,
                                            borderColor: "rgba(255, 157, 116, 0.8)",
                                            borderWidth: 2,
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>

                    {/* PIE CHART */}
                    <div>
                        <h3 className='uppercase mb-[20px] text-[18px] font-semibold'>voucher chart</h3>
                        <div className='w-[full] h-[350px] rounded-[10px] border border-black mb-[20px] p-[20px]'>
                            <Pie
                                data={{
                                    labels: vouchers?.map((data) => data.code),
                                    datasets: [
                                        {
                                            label: "Voucher used",
                                            data: vouchers?.map((data) => data.usedCount),
                                            borderRadius: 10,
                                            borderColor: "rgba(87, 246, 230, 0.8)",
                                            backgroundColor: vouchers?.map((data, index) => {
                                                const colors = [
                                                    "rgba(255, 99, 132, 0.6)", // Red
                                                    "rgba(54, 162, 235, 0.6)", // Blue
                                                    "rgba(255, 206, 86, 0.6)",  // Yellow
                                                    "rgba(75, 192, 192, 0.6)",  // Green
                                                    "rgba(153, 102, 255, 0.6)", // Purple
                                                    "rgba(255, 159, 64, 0.6)"   // Orange
                                                ];
                                                return colors[index % colors.length]; // Cycle through the colors
                                            }),
                                        }
                                    ]
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
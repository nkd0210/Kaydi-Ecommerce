import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
// CHART
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

import 'animate.css';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

import { MdOutlinePendingActions } from "react-icons/md";
import { FcProcess } from "react-icons/fc";
import { FcShipped } from "react-icons/fc";
import { IoMdDoneAll } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";
import { FcMoneyTransfer } from "react-icons/fc";
import { FaSackDollar } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FcBullish } from "react-icons/fc";
import { FcBearish } from "react-icons/fc";

const Dashboard = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [orderPerDay, setOrderPerDay] = useState([]);
    const [orderPerMonth, setOrderPerMonth] = useState([]);
    const [orderStatus, setOrderStatus] = useState({});
    const [orderRevenue, setOrderRevenue] = useState({});


    const [vouchers, setVouchers] = useState([]);
    const [voucherCount, setVoucherCount] = useState({});

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

    const handleFetchTotalAmountPerMonth = async () => {
        try {
            const res = await fetch(`/api/order/getTotalAmountPerMonth`, {
                method: "GET",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderPerMonth(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

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
                setVouchers(data?.vouchers);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFetchAllOrderStatus = async () => {
        try {
            const res = await fetch(`/api/order/getAllOrderStatus`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderStatus(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFetchVoucherStatistic = async (req, res, next) => {
        try {
            const res = await fetch(`/api/voucher/getVoucherStatistic`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setVoucherCount(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleFetchOrderRevenue = async (req, res, next) => {
        try {
            const res = await fetch(`/api/order/getOrderRevenue`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderRevenue(data);
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    useEffect(() => {
        handleFetchTotalAmountPerDay();
        handleFetchTotalAmountPerMonth();
        handleFetchVouchers();
        handleFetchAllOrderStatus();
        handleFetchVoucherStatistic();
        handleFetchOrderRevenue();
    }, [])


    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll'>
            <div className='flex gap-[20px] items-center'>
                <MdDashboard className='text-[30px]' />
                <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Admin Dashboard</h1>
            </div>

            {/* OVERVIEW */}
            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[20px] mb-[20px] uppercase'>Overview</h2>
                <div className='flex flex-col max-md:flex-wrap gap-[40px] border rounded-[10px] p-[20px] animate__animated animate__fadeInRight w-full'>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px] h-[100px] rounded-[10px] shadow-lg  flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <FaSackDollar className='text-[46px] text-yellow-500' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderRevenue?.totalRevenue}&#8363;</p>
                                <p className='text-[16px] text-gray-600'>Total Revenue</p>
                            </div>
                        </div>
                        <div className='border w-[300px] h-[100px] rounded-[10px] shadow-lg  flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <MdCalendarMonth className='text-[46px] text-blue-500' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderRevenue?.lastMonthRevenue}&#8363;</p>
                                <p className='text-[16px] text-gray-600'>Last Month Revenue</p>
                            </div>
                        </div>
                        <div className='border w-[300px] h-[100px] rounded-[10px] shadow-lg  flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <FcMoneyTransfer className='text-[46px]' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderRevenue?.thisMonthRevenue}&#8363;</p>
                                <p className='text-[16px] text-gray-600'>Current Month Revenue</p>
                            </div>
                        </div>
                        <div className='w-[100px] h-[100px] rounded-[50%] border p-[10px]'>
                            {
                                orderRevenue?.thisMonthRevenue > orderRevenue?.lastMonthRevenue ? (
                                    <div className='flex w-full h-full items-center justify-center'>
                                        <FcBullish className='text-[50px] text-center' />
                                    </div>
                                ) : (
                                    <div className='flex w-full h-full items-center justify-center'>
                                        <FcBearish className='text-[50px] text-center' />
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* BAR CHART */}
                    <div className='max-w-full max-md:w-full h-[350px] rounded-[10px] border border-black mb-[20px] p-[20px]'>
                        <Bar
                            data={{
                                labels: orderPerMonth?.map((data) => data._id),
                                datasets: [
                                    {
                                        label: "Total price per month",
                                        data: orderPerMonth?.map((data) => data.totalAmount),
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
            </div>

            {/* ORDER */}
            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[20px] mb-[20px] uppercase'>Order Status</h2>
                <div className='flex flex-col max-md:flex-wrap gap-[40px] border rounded-[10px] p-[20px] animate__animated animate__fadeInRight w-full'>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[250px] h-[100px] rounded-[10px] shadow-lg bg-red-300 flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <MdOutlinePendingActions className='text-[46px] text-red-700' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderStatus?.pending}</p>
                                <p className='text-[16px] text-gray-600'>Pending</p>
                            </div>
                        </div>
                        <div className='border w-[250px] h-[100px] rounded-[10px] shadow-lg bg-yellow-300 flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <FcProcess className='text-[46px]' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderStatus?.processing}</p>
                                <p className='text-[16px] text-gray-600'>Processing</p>
                            </div>
                        </div>
                        <div className='border w-[250px] h-[100px] rounded-[10px] shadow-lg bg-blue-300 flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <FcShipped className='text-[46px]' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderStatus?.shipped}</p>
                                <p className='text-[16px] text-gray-600'>Shipped</p>
                            </div>
                        </div>
                        <div className='border w-[250px] h-[100px] rounded-[10px] shadow-lg bg-green-300 flex gap-[20px] justify-center items-center'>
                            <div className='flex justify-center items-center gap-[10px]'>
                                <IoMdDoneAll className='text-[46px] text-green-700' />
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[20px]'>{orderStatus?.delivered}</p>
                                <p className='text-[16px] text-gray-600'>Delivered</p>
                            </div>
                        </div>
                    </div>

                    {/* LINE CHART */}
                    <div className='max-w-full max-md:w-full h-[350px] rounded-[10px] border border-black mb-[20px] p-[20px]'>
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

            </div>

            {/* VOUCHER */}
            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[20px] mb-[20px] uppercase'>Voucher Statistic</h2>
                <div className='flex max-md:flex-col gap-[20px] animate__animated animate__fadeInRight w-full'>
                    <div className='w-[700px] h-[350px] max-md:w-full border shadow-lg rounded-[10px] p-[20px]'>
                        <div className='flex flex-col gap-[20px]'>
                            <h2 className='text-[16px] font-semibold'>Most Used</h2>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Voucher Code</th>
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Discount Percentage</th>
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Used Count</th>
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="pr-[20px] py-3 text-gray-800">{voucherCount?.mostUsed?.code}</td>
                                        <td className="pr-[20px] py-3 text-gray-800">{voucherCount?.mostUsed?.discount}%</td>
                                        <td className="pr-[20px] py-3 text-gray-800">{voucherCount?.mostUsed?.usedCount}</td>
                                        <td className={`pr-[20px] py-3  capitalize ${voucherCount?.mostUsed?.status === 'active'
                                            ? 'text-green-400'
                                            : voucherCount?.mostUsed?.status === 'expired'
                                                ? 'text-red-400'
                                                : 'text-gray-800'}`}>{voucherCount?.mostUsed?.status}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                        <div className='flex flex-col gap-[20px] mt-[30px]'>
                            <h2 className='text-[16px] font-semibold'>Least Used</h2>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Voucher Code</th>
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Discount Percentage</th>
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Used Count</th>
                                        <th className="pr-[20px] text-left py-2 font-normal text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="pr-[20px] py-3 text-gray-800">{voucherCount?.leastUsed?.code}</td>
                                        <td className="pr-[20px] py-3 text-gray-800">{voucherCount?.leastUsed?.discount}%</td>
                                        <td className="pr-[20px] py-3 text-gray-800">{voucherCount?.leastUsed?.usedCount}</td>
                                        <td className={`pr-[20px] py-3  capitalize ${voucherCount?.leastUsed?.status === 'active'
                                            ? 'text-green-400'
                                            : voucherCount?.leastUsed?.status === 'expired'
                                                ? 'text-red-400'
                                                : 'text-gray-800'}`}>{voucherCount?.leastUsed?.status}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    {/* PIE CHART */}
                    <div className='w-[500px] max-md:w-full'>
                        <div className='w-[full] h-[350px] rounded-[10px] border shadow-lg mb-[20px] p-[20px]'>
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
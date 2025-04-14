import { useState, useEffect, useRef } from 'react'


import { MdDashboard } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { SiVirustotal } from "react-icons/si";
import { FaGripLinesVertical } from "react-icons/fa";
import { GoSearch } from "react-icons/go";

import EditCategory from './category/EditCategory';
import SingleOrder from './order/SingleOrder';
import Loader from '../Loader';
import CustomerOrder from './order/CustomerOrder';


import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

const Order = () => {

    const [orderData, setOrderData] = useState({})
    const [allOrders, setAllOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);


    const handleFetchOrder = async (page) => {
        setLoadingOrders(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/getAllOrders?page=${page}&limit=5`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setOrderData(data)
                setAllOrders(data.findOrder);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            // setLoadingOrders(false);
        }
    }



    const [orderType, setOrderType] = useState('all')

    const [page, setPage] = useState(1);

    const handleNextPage = () => {
        if (page < orderData?.totalPages) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                handleFetchOrder(newPage);
                return newPage;
            })
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => {
                const newPage = prevPage - 1;
                handleFetchOrder(newPage);
                return newPage;
            })
        }
    }

    const [customerOrders, setCustomerOrders] = useState([]);
    const [loadingCustomerOrder, setLoadingCustomerOrder] = useState(false);

    const handleFetchCustomerOrders = async (page) => {
        setLoadingCustomerOrder(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/getAllOrdersOfCustomer?page=${page}&limit=10`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log("fetching all order of customer failed")
            } else {
                setCustomerOrders(data);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingCustomerOrder(false);
        }
    }

    const [pageCustomer, setPageCustomer] = useState(1);

    const handleNextPageCustomer = () => {
        if (pageCustomer < customerOrders?.totalPages) {
            setPageCustomer(prevPage => {
                const newPage = prevPage + 1;
                handleFetchCustomerOrders(newPage);
                return newPage;
            })
        }
    }

    const handlePreviousPageCustomer = () => {
        if (pageCustomer > 1) {
            setPageCustomer(prevPage => {
                const newPage = prevPage - 1;
                handleFetchCustomerOrders(newPage);
                return newPage;
            })
        }
    }

    useEffect(() => {
        handleFetchOrder(1);
        handleFetchCustomerOrders(1);
    }, [])

    const handleExportExcel = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/exportOrders`, {
                method: "GET",
                credentials: 'include',
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = 'orders.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.log("export orders failed");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const [openModalSearch, setOpenModalSearch] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [findOrders, setFindOrders] = useState([]);

    const handleChange = (e) => {
        setSearchKey(e.target.value);
    }

    const handleSearchOrderAdmin = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/order/searchOrderAdmin/${searchKey}`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            }
            setFindOrders(data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleClickSearch = async () => {
        if (searchKey === "" || searchKey === undefined || searchKey === null) {
            setSearchKey('');
            setFindOrders([]);
        } else {
            handleSearchOrderAdmin();
        }
    }



    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll bg-gray-100'>
            <>
                <div className='flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                    <div className='flex gap-[20px] items-center'>
                        <MdDashboard className='text-[30px]' />
                        <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Order Dashboard</h1>
                    </div>
                    <div className='flex gap-[20px] items-center max-md:flex-col max-md:items-start'>
                        <div onClick={() => setOpenModalSearch(true)} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                            <GoSearch className='text-[20px]' />
                            <p className='text-[16px]'>Search Order</p>
                        </div>
                        <div onClick={handleExportExcel} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
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
                        <p>{orderData?.numberOfOrder}</p>
                    </div>
                    <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                        <div className='flex gap-[5px]'>
                            <LiaCalendarWeekSolid className='text-[20px]' />
                            <span>Last week order: </span>
                        </div>
                        <p>{orderData?.lastWeekOrder}</p>
                    </div>
                    <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                        <div className='flex gap-[5px]'>
                            <MdCalendarMonth className='text-[20px]' />
                            <span>Last month order: </span>
                        </div>
                        <p>{orderData?.lastMonthOrder}</p>
                    </div>
                </div>

                <div className='flex gap-[10px] items-center'>
                    <MdCategory className='text-[20px]' />
                    <h3 onClick={() => setOrderType('all')} className={`text-[16px] ${orderType === 'all' ? 'text-red-500' : ''} font-semibold cursor-pointer hover:text-red-500`}>All Orders</h3>
                    <FaGripLinesVertical className='text-[20px]' />
                    <h3 onClick={() => setOrderType('customer')} className={`text-[16px] ${orderType === 'customer' ? 'text-red-500' : ''} font-semibold cursor-pointer hover:text-red-500`}>Customer Orders</h3>

                </div>

                <div className='border rounded-[20px] mt-[20px] p-[10px] bg-white max-w-full overflow-x-scroll '>
                    <div className='flex flex-col gap-[40px]'>
                        {orderType === 'all' ? (
                            <>
                                {
                                    allOrders?.map((order, index) => (
                                        <SingleOrder key={index} order={order} handleFetchOrder={handleFetchOrder} />
                                    ))
                                }
                                <div className='flex justify-center mx-auto items-center gap-[10px] my-[40px]'>
                                    <button onClick={handlePreviousPage} disabled={page === 1}>{`<`}</button>
                                    <p>{orderData?.currentPage} / {orderData?.totalPages}</p>
                                    <button onClick={handleNextPage} disabled={orderData?.currentPage === orderData?.totalPages}>{`>`}</button>
                                </div>
                            </>
                        ) : (
                            <>
                                {
                                    customerOrders?.ordersByEachUser?.map((order, index) => (
                                        <CustomerOrder key={index} order={order} />
                                    ))
                                }
                                <div className='flex justify-center mx-auto items-center gap-[10px] my-[40px]'>
                                    <button onClick={handlePreviousPageCustomer} disabled={pageCustomer === 1}>{`<`}</button>
                                    <p>{customerOrders?.currentPage} / {customerOrders?.totalPages}</p>
                                    <button onClick={handleNextPageCustomer} disabled={customerOrders?.currentPage === customerOrders?.totalPages}>{`>`}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>

            <Modal
                open={openModalSearch}
                onClose={() => { setOpenModalSearch(false) }}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1200px] max-md:w-[400px] bg-white text-black h-[600px] overflow-y-scroll rounded-[20px] flex flex-col gap-[20px] p-[20px] max-md:p-[10px] '>
                    <>
                        <IoIosCloseCircleOutline onClick={() => { setOpenModalSearch(false); setSearchKey(''); setFindOrders([]) }} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                        <h2 className='text-center text-[20px] font-semibold'>Search Order</h2>
                        <div className='w-full flex flex-col gap-[20px]'>
                            <div className='flex gap-[10px] items-center justify-start'>
                                <div className='w-[500px] h-[30px] border bg-gray-50 text-black rounded-[5px]'>
                                    <input onChange={handleChange} value={searchKey} type="text" placeholder='Search order by id or name ...' className='w-full rounded-[5px] border px-[10px] py-[5px] bg-gray-50' />
                                </div>
                                <div onClick={handleClickSearch} className='w-[50px] h-[30px] bg-gray-50 border rounded-[10px] flex justify-center items-center cursor-pointer hover:bg-gray-200'>
                                    <GoSearch className='text-[20px]' />
                                </div>
                            </div>
                            {findOrders?.findOrder?.length > 0 ? (
                                findOrders.findOrder.map((order, index) => (
                                    <SingleOrder key={index} order={order} />
                                ))
                            ) : (
                                <p>No orders found.</p>
                            )}
                        </div>
                    </>
                </div>
            </Modal>
        </div >
    )
}

export default Order
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import CreateProduct from './product/CreateProduct';
import ShowProduct from './product/ShowProduct';
import EditProduct from './product/EditProduct';

import { MdDashboard } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { SiVirustotal } from "react-icons/si";
import { FaGripLinesVertical } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";

import 'animate.css';

const Products = () => {

    const [openCreate, setOpenCreate] = useState(false);
    const [openShow, setOpenShow] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);

    const [productId, setProductId] = useState('');

    const [allProductsCount, setAllProductsCount] = useState('');
    const [weekCount, setWeekCount] = useState('');
    const [monthCount, setMonthCount] = useState('');

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleFetchProductsDashboard = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/product/getAllProduct`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                setAllProducts(data.allProducts);
                setAllProductsCount(data.totalNumber);
                setWeekCount(data.lastWeekProductCount);
                setMonthCount(data.lastMonthProductCount);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchProductsDashboard();
    }, [])

    const handleExportExcel = async () => {
        try {
            const res = await fetch(`/api/product/exportProducts`, {
                method: "GET"
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = 'products.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.log("export products failed");
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <Wrapper className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll bg-gray-100'>

            <div className='w-full flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                {/* HEADER */}
                <div className='flex gap-[20px] items-center'>
                    <MdDashboard className='text-[30px]' />
                    <h1 className='font-semibold text-[20px] max-md:text-[18px]'>Products Dashboard</h1>
                </div>
                <div className='flex gap-[20px] items-center max-md:flex-col max-md:items-start'>
                    <div onClick={() => setOpenCreate(true)} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                        <CiCirclePlus className='text-[20px]' />
                        <p className='text-[16px]'>Create product</p>
                    </div>
                    <div onClick={handleExportExcel} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                        <IoIosPrint className='text-[20px]' />
                        <p className='text-[16px]'>Print Excel</p>
                    </div>
                </div>
            </div>
            {/* OVERVIEW */}
            <div className='w-full flex gap-[10px] mt-[20px] items-center'>
                <FaBusinessTime className='text-[20px]' />
                <h3 className='text-[16px] font-semibold'>Business Overview</h3>
            </div>

            <div className='w-full flex max-md:flex-wrap justify-center max-md:justify-start items-center gap-[20px] py-[30px] animate__animated animate__fadeIn'>
                <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                    <div className='flex gap-[5px]'>
                        <SiVirustotal className='text-[20px]' />
                        <span>Total products: </span>
                    </div>
                    <p>{allProductsCount}</p>
                </div>
                <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                    <div className='flex gap-[5px]'>
                        <LiaCalendarWeekSolid className='text-[20px]' />
                        <span>Last week create: </span>
                    </div>
                    <p>{weekCount}</p>
                </div>
                <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                    <div className='flex gap-[5px]'>
                        <MdCalendarMonth className='text-[20px]' />
                        <span>Last month create: </span>
                    </div>
                    <p>{monthCount}</p>
                </div>
            </div>

            <div className='flex gap-[10px] items-center'>
                <MdCategory className='text-[20px]' />
                <h3 className='text-[16px] font-semibold'>Products</h3>
            </div>


            <div className='flex items-center gap-[10px] py-[20px] animate__animated animate__fadeInRight '>
                <h1 className='ml-[10px] text-[16px]'>Create Product</h1>
                {openCreate ? (
                    <div onClick={() => setOpenCreate(false)}><CiCircleMinus className='text-[20px] text-blue-500' /></div>
                ) : (
                    <div onClick={() => setOpenCreate(true)}><IoIosArrowDropdown className='text-[20px] text-blue-500' /></div>
                )}
            </div>
            {openCreate && (
                <CreateProduct setOpenCreate={setOpenCreate} setOpenShow={setOpenShow} handleFetchProductsDashboard={handleFetchProductsDashboard} />
            )}

            <hr className='my-[20px] border-gray-400' />

            <div className='flex items-center gap-[10px] py-[20px] animate__animated animate__fadeInUp'>
                <h1 className='ml-[10px] text-[16px]'>Show All Products</h1>
                {openShow ? (
                    <div onClick={() => setOpenShow(false)}><CiCircleMinus className='text-[20px] text-blue-500' /></div>
                ) : (
                    <div onClick={() => setOpenShow(true)}><IoIosArrowDropdown className='text-[20px] text-blue-500' /></div>
                )}
            </div>
            <div className='3xl:w-full w-[1300px] max-md:w-full'>
                {
                    openShow && (
                        <ShowProduct loading={loading} allProducts={allProducts} setOpenShow={setOpenShow} setOpenEdit={setOpenEdit} setProductId={setProductId} />
                    )
                }
            </div>

            <hr className='my-[20px] border-gray-400' />

            <div className='flex items-center gap-[10px] py-[20px] animate__animated animate__fadeInRight'>
                <h1 className='ml-[10px] text-[16px]'>Edit Product</h1>
                {openEdit ? (
                    <div onClick={() => setOpenEdit(false)}><CiCircleMinus className='text-[20px] text-blue-500' /></div>
                ) : (
                    <div onClick={() => setOpenEdit(true)}><IoIosArrowDropdown className='text-[20px] text-blue-500' /></div>
                )}
            </div>
            {
                openEdit && (
                    <EditProduct setOpenEdit={setOpenEdit} productId={productId} setOpenShow={setOpenShow} handleFetchProductsDashboard={handleFetchProductsDashboard} />
                )
            }

        </Wrapper>
    )
}

const Wrapper = styled.section`
    
`

export default Products
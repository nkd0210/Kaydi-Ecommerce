import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Dashboard = () => {

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

    useEffect(() => {
        handleFetchCategories();
        handleFetchProducts();
        handleFetchUsers();
    }, [])


    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] h-full overflow-y-scroll'>
            <h1 className='uppercase font-semibold text-[20px]'>Admin Dashboard</h1>

            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[18px] uppercase'>Overview</h2>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px]'>
                    <h2>User</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total users:</span>
                            {usersInfo?.userCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week user created:</span>
                            {usersInfo?.lastWeekUsersCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month user created:</span>
                            {usersInfo?.lastMonthUsersCount}
                        </div>
                    </div>
                </div>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px]'>
                    <h2>Category</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total categories:</span>
                            {categoriesInfo?.totalCategory}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week category created:</span>
                            {categoriesInfo?.lastWeekCategoryCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month category created:</span>
                            {categoriesInfo?.lastMonthCategoryCount}
                        </div>
                    </div>
                </div>
                <div className='border-b-[2px] py-[20px] flex flex-col gap-[20px]'>
                    <h2>Product</h2>
                    <div className='flex max-md:flex-wrap gap-[30px]'>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-red-400 flex gap-[10px] justify-center'>
                            <span>Total products:</span>
                            {productsInfo?.totalNumber}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-blue-400 flex gap-[10px] justify-center'>
                            <span>Last week product created:</span>
                            {productsInfo?.lastWeekProductCount}
                        </div>
                        <div className='border w-[300px]  py-[5px] rounded-[10px] shadow-lg bg-green-400 flex gap-[10px] justify-center'>
                            <span>Last month product created:</span>
                            {productsInfo?.lastMonthProductCount}
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-[20px]'>
                <h2 className='font-semibold text-[18px] uppercase'>Diagram</h2>

            </div>
        </div>
    )
}

export default Dashboard
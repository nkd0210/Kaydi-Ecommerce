import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BiTrash } from 'react-icons/bi';
import Loader from '../Loader';

import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";

import { CiCirclePlus } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { LiaCalendarWeekSolid } from "react-icons/lia";
import { SiVirustotal } from "react-icons/si";
import { GoSearch } from "react-icons/go";
import ShowUser from './user/ShowUser';
import EachUser from './user/EachUser';



const User = () => {

    const [loadingUser, setLoadingUser] = useState(false);

    const [usersInfo, setUsersInfo] = useState({});
    const [allUsers, setAllUsers] = useState([]);

    const handleFetchUsersInfo = async (page) => {
        setLoadingUser(true);
        try {
            const res = await fetch(`/api/user/getallusers?page=${page}&limit=10`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUsersInfo(data);
                setAllUsers(data.users);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoadingUser(false);
        }
    }

    useEffect(() => {
        handleFetchUsersInfo(1);
    }, []);

    const [openEdit, setOpenEdit] = useState(false);
    const [userId, setUserId] = useState('');


    const handleExportExcel = async () => {
        try {
            const res = await fetch(`/api/user/exportUser`, {
                method: "GET"
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = 'users.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.log("export users failed");
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const [searchKey, setSearchKey] = useState('');

    const handleChange = (e) => {
        setSearchKey(e.target.value);
    }

    const handleSearchProduct = async () => {
        try {
            const res = await fetch(`/api/user/searchUserAdmin/${searchKey}`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            }
            setAllUsers(data);
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleClickSearch = () => {
        if (searchKey === null || searchKey === "" || searchKey === undefined) {
            handleFetchUsersInfo();
        } else {
            handleSearchProduct();
        }
    }

    return (
        <div className='py-[20px] px-[40px] max-md:px-[10px] max-w-full h-full overflow-x-scroll overflow-y-scroll bg-gray-100'>
            {
                loadingUser ? (
                    <Loader />
                ) : (
                    <div className='flex flex-col gap-[20px] max-w-full overflow-x-scroll'>

                        <div className='flex justify-between max-md:flex-col max-md:flex-start max-md:my-[20px]'>
                            <div className='flex gap-[20px] items-center'>
                                <MdDashboard className='text-[30px]' />
                                <h1 className='font-semibold text-[20px] max-md:text-[18px]'>User Dashboard</h1>
                            </div>

                            <div onClick={handleExportExcel} className='flex gap-[10px] rounded-[10px] p-[10px] items-center border bg-white w-[250px] mt-[20px] justify-center shadow-lg cursor-pointer hover:bg-red-400'>
                                <IoIosPrint className='text-[20px]' />
                                <p className='text-[16px]'>Print Excel</p>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <FaBusinessTime className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>Business Overview</h3>
                        </div>

                        <div className='flex max-md:flex-wrap justify-center max-md:justify-start items-center gap-[20px] py-[30px] animate__animated animate__fadeIn'>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <SiVirustotal className='text-[20px]' />
                                    <span>Total users: </span>
                                </div>
                                <p>{usersInfo?.userCount}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <LiaCalendarWeekSolid className='text-[20px]' />
                                    <span>Last week user: </span>
                                </div>
                                <p>{usersInfo?.lastWeekUsersCount}</p>
                            </div>
                            <div className='bg-white rounded-[10px] p-[20px] flex items-center justify-center gap-[20px] w-[300px] shadow-md'>
                                <div className='flex gap-[5px]'>
                                    <MdCalendarMonth className='text-[20px]' />
                                    <span>Last month user: </span>
                                </div>
                                <p>{usersInfo?.lastMonthUsersCount}</p>
                            </div>
                        </div>

                        <div className='flex gap-[10px] items-center'>
                            <MdCategory className='text-[20px]' />
                            <h3 className='text-[16px] font-semibold'>All User</h3>
                        </div>

                        <div className='flex gap-[10px] items-center justify-start animate__animated animate__fadeInUp'>
                            <div className='w-[500px] h-[30px] border bg-white text-black rounded-[5px]'>
                                <input onChange={handleChange} value={searchKey} type="text" placeholder='Search user name ...' className='w-full rounded-[5px] px-[10px] py-[5px]' />
                            </div>
                            <div onClick={handleClickSearch} className='w-[50px] h-[30px] bg-white rounded-[10px] flex justify-center items-center cursor-pointer hover:bg-gray-200'>
                                <GoSearch className='text-[20px]' />
                            </div>
                        </div>

                        <div className='3xl:w-full w-[1300px] overflow-x-scroll max-md:w-full'>
                            <ShowUser allUsers={allUsers} openEdit={openEdit} setOpenEdit={setOpenEdit} setUserId={setUserId} />
                        </div>

                    </div>
                )
            }

            {/* CREATE MODAL */}
            <Modal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
            >
                <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[1150px] h-[700px] overflow-y-scroll max-md:w-[400px] bg-white text-black  rounded-[10px] '>
                    <IoIosCloseCircleOutline onClick={() => setOpenEdit(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
                    <EachUser userId={userId} />
                </div>

            </Modal>
        </div>
    )
}

export default User
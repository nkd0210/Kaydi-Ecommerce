import React from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { signOutSuccess } from '../redux/user/userSlice';

const LeftSideBar = () => {

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    console.log(params)
    const handleLogout = async () => {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/signout`, {
            method: "POST",
            credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
        } else {
            dispatch(signOutSuccess());
            navigate('/');
        }
    }

    return (
        <div className='flex flex-col justify-between items-center p-[20px] gap-[20px] h-screen w-[200px] text-[18px] bg-black text-white max-md:hidden'>
            <div className='w-[80px] h-[80px]'>
                <img src={currentUser?.profilePic} alt="" className='w-full h-full object-cover rounded-[50%]' />
            </div>
            <div className='flex flex-col gap-[50px]'>
                <Link to='/admin' className={`cursor-pointer hover:text-red-400`}>Dashboard</Link>
                <Link to='/admin/:product' className={`cursor-pointer hover:text-red-400`}>Products</Link>
                <Link to='/admin/:category' className={`cursor-pointer hover:text-red-400`}>Category</Link>
                <Link to='/admin/:order' className={`cursor-pointer hover:text-red-400`}>Order</Link>
            </div>
            <div onClick={handleLogout} className={`cursor-pointer hover:text-red-400`}> Log out</div>
        </div>
    )
}

export default LeftSideBar
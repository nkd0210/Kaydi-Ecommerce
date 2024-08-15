import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";

import 'animate.css'

import { updateSuccess } from '../redux/user/userSlice';

// MODAL
import Modal from '@mui/material/Modal';
import { IoIosCloseCircleOutline } from "react-icons/io";
// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiTrash } from 'react-icons/bi';
import Loader from './Loader';

const Address = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const dispatch = useDispatch();

  const fetchUserInfo = async () => {
    setLoadingUserInfo(true);
    try {
      const res = await fetch(`/api/user/getuser/${currentUser._id}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
        return;
      } else {
        setUserInfo(data);
        setAddressList(data.addressList);
        setLoadingUserInfo(false);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingUserInfo(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      fetchUserInfo();
    }
  }, []);

  const [editModal, setEditModal] = useState(false);
  const [findAddress, setFindAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleClickEdit = (addressIndex) => {
    setFindAddress(addressList[addressIndex]);
    setNewAddress(addressList[addressIndex])
    setEditModal(true);
  }

  const [loadingEdit, setLoadingEdit] = useState(false);

  const handleChange = (e) => {
    setNewAddress(e.target.value);
  }

  const handleShowErrorMessage = (message) => {
    toast.error(message)
  }

  const handleShowSucccessMessage = (message) => {
    toast.success(message)
  }

  const handleEditAddress = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    try {

      const updatedAddressList = [...addressList];
      const addressIndex = addressList.findIndex(address => address === findAddress);
      if (addressIndex !== -1) {
        updatedAddressList[addressIndex] = newAddress;
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          addressList: updatedAddressList
        })
      });
      const data = await res.json();
      if (!res.ok) {
        handleShowErrorMessage("Cập nhật thất bại. Vui lòng thử lại");
        return;
      } else {
        dispatch(updateSuccess(data))
        setEditModal(false);
        handleShowSucccessMessage("Cập nhật địa chỉ thành công");
        setAddressList(updatedAddressList);
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingEdit(false);
    }
  }



  return (
    <div className='w-full h-[600px] overflow-y-scroll bg-gray-50 p-[20px] rounded-[10px]'>
      <h2 className="text-[24px] font-semibold mb-[20px] animate__animated animate__fadeInDown">Sổ địa chỉ</h2>
      <ToastContainer />
      <div className='flex flex-col gap-[20px]'>
        {addressList.map((address, index) => (
          <div onClick={() => handleClickEdit(index)} key={index} className='rounded-[10px] h-[100px] w-[500px] max-md:w-full p-[10px] flex justify-between items-center bg-white cursor-pointer shadow-md animate__animated animate__fadeInRight'>
            <p>
              {address}
            </p>
            <div className='flex gap-[10px]'>
              <CiEdit className='text-[18px] text-gray-500 cursor-pointer hover:text-black' />
              <CiTrash className='text-[18px] text-gray-500 cursor-pointer hover:text-black' />
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        className="z-40"
      >
        <div className='absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] shadow-lg w-[600px] max-md:w-[300px] h-[300px] overflow-y-scroll bg-white text-black rounded-[20px]'>
          <IoIosCloseCircleOutline onClick={() => setEditModal(false)} className='absolute top-[10px] right-[10px] text-[30px] cursor-pointer hover:text-red-[400]' />
          {
            loadingEdit ? (
              <Loader />
            ) : (
              <div className='p-[20px] flex flex-col gap-[20px]'>
                <h3 className='text-center text-[20px]'>Chỉnh sửa địa chỉ</h3>
                <form className='flex flex-col gap-[20px]'>
                  <input onChange={handleChange} type="text" value={newAddress} className='bg-transparent w-[300px] border p-[10px] rounded-[10px]' />
                  <div className='flex gap-[10px]'>
                    <div onClick={handleEditAddress} className='flex justify-center items-center w-[200px] bg-red-400 cursor-pointer p-[10px] rounded-[20px] hover:opacity-70'>Xác nhận</div>
                    <div onClick={() => setEditModal(false)} className='flex justify-center items-center w-[200px] bg-blue-400 cursor-pointer p-[10px] rounded-[20px] hover:opacity-70'>Hủy</div>
                  </div>
                </form>
              </div>
            )
          }
        </div>
      </Modal>
    </div>
  )
}

export default Address
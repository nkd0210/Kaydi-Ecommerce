import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Loader from '../components/Loader'
import 'animate.css'
import { BsFillGridFill, BsList } from 'react-icons/bs'
import { CiSearch } from "react-icons/ci";

const Filter = ({ newSearchKey, setNewSearchKey, showType, setShowType, sortType, setSortType, productCount, handleFetchProductBySearchKey }) => {

    const navigate = useNavigate();


    const handleKeyChange = (e) => {
        setNewSearchKey(e.target.value);
    }

    const handleClickSearch = () => {
        navigate(`/search/${newSearchKey}`);
        handleFetchProductBySearchKey(1, newSearchKey);
    }

    return (
        <div className='w-full flex max-md:flex-col items-center max-md:items-start gap-[30px]'>
            <div className='flex items-center max-md:items-start gap-[30px]'>
                <div className='flex justify-between gap-[10px] items-center border rounded-[5px] bg-gray-100 w-[250px] px-[10px] py-[5px]'>
                    <input
                        type="text"
                        value={newSearchKey}
                        onChange={handleKeyChange}
                        className='bg-transparent w-full'
                        placeholder='Search'
                    />
                    <CiSearch className="text-gray-600 text-[20px] cursor-pointer" onClick={handleClickSearch} />

                </div>
                <div className='flex gap-[10px] items-center'>
                    <BsFillGridFill onClick={() => setShowType('grid')} className={`text-[30px] cursor-pointer border rounded-[5px] p-[5px] ${showType === 'grid' ? 'bg-gray-200' : ''}`} />
                    <BsList onClick={() => setShowType('list')} className={`text-[30px] cursor-pointer border rounded-[5px] p-[5px] ${showType === 'list' ? 'bg-gray-200' : ''}`} />
                </div>
            </div>
            <p>{productCount || 0} sản phẩm tìm thấy</p>
            <hr className='w-[500px] max-md:hidden' />
            <form className='flex items-center gap-[20px]'>
                <label htmlFor='sort'>Sắp xếp</label>
                <select
                    name='sort'
                    id='sort'
                    value={sortType}
                    className='w-[200px] px-[10px] py-[5px] rounded-[5px]'
                    onChange={(e) => setSortType(e.target.value)}
                >
                    <option value="priceLowToHigh">Giá (thấp nhất) </option>
                    <option value="priceHighToLow">Giá (cao nhất) </option>
                    <option value="nameAZ">Tên (a-z) </option>
                    <option value="nameZA">Tên (z-a) </option>
                </select>
            </form>
        </div>
    )
}

export default Filter
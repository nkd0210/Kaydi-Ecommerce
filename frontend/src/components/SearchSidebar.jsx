import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import 'animate.css'
import Skeleton from '@mui/material/Skeleton';

const SearchSidebar = ({
    allCategories,
    selectCategory,
    handleCategoryCheckChange,
    loadingCategory,
    setMinPrice,
    setMaxPrice,
    selectedPriceRange,
    setSelectedPriceRange
}) => {

    const handleCheckBoxChange = (range) => {
        setSelectedPriceRange(range);
        if (range === "below100000") {
            setMinPrice(null);
            setMaxPrice(100000);
        } else if (range === "above2000000") {
            setMinPrice(2000000);
            setMaxPrice(null);
        } else {
            const [min, max] = range.split("-").map(Number);
            setMinPrice(min);
            setMaxPrice(max);
        }
    }

    return (
        <div className='flex flex-col gap-[20px] min-w-[250px]'>

            <div className='border rounded-[5px] animate__animated animate__fadeInUp p-[10px]'>
                <h3 className='text-[20px] font-semibold mb-[20px]'>Giá thành</h3>
                {
                    loadingCategory ? (
                        <div className='flex flex-col gap-[20px]'>
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                        </div>
                    ) : (
                        <div className='flex flex-col max-md:flex-row max-md:flex-wrap max-md:items-center gap-[20px] '>
                            <div className='flex items-center gap-[10px]'>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange === "below100000"}
                                    onChange={() => handleCheckBoxChange("below100000")}
                                />
                                <p>Giá dưới 100000</p>
                            </div>
                            <div className='flex items-center gap-[10px]'>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange === "100000-200000"}
                                    onChange={() => handleCheckBoxChange("100000-200000")}
                                />
                                <p>100000-200000</p>
                            </div>
                            <div className='flex items-center gap-[10px]'>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange === "200000-500000"}
                                    onChange={() => handleCheckBoxChange("200000-500000")}
                                />
                                <p>200000-500000</p>

                            </div>
                            <div className='flex items-center gap-[10px]'>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange === "500000-1000000"}
                                    onChange={() => handleCheckBoxChange("500000-1000000")}
                                />
                                <p>500000-1000000</p>
                            </div>
                            <div className='flex items-center gap-[10px]'>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange === "1000000-2000000"}
                                    onChange={() => handleCheckBoxChange("1000000-2000000")}
                                />
                                <p>1000000-2000000</p>
                            </div>
                            <div className='flex items-center gap-[10px]'>
                                <input
                                    type="checkbox"
                                    checked={selectedPriceRange === "above2000000"}
                                    onChange={() => handleCheckBoxChange("above2000000")}
                                />
                                <p>Giá trên 2000000</p>
                            </div>
                        </div>
                    )
                }
            </div>

            <div className='border rounded-[5px] animate__animated animate__fadeInUp p-[10px]'>
                <h3 className='text-[20px] font-semibold mb-[20px]'>Danh mục</h3>
                {
                    loadingCategory ? (
                        <div className='flex flex-col gap-[20px]'>
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', bgcolor: 'grey.200' }} />
                        </div>
                    ) : (
                        <div className='flex flex-col max-md:flex-row max-md:flex-wrap max-md:items-center gap-[20px]  '>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="checkbox"
                                    checked={selectCategory === "all"}
                                    onChange={() => handleCategoryCheckChange("all")}
                                />
                                <p>Tất cả</p>
                            </div>
                            {
                                allCategories?.map((category, index) => (
                                    <div className="flex items-center gap-[10px]" key={index}>
                                        <input
                                            type="checkbox"
                                            checked={selectCategory === category.name}
                                            onChange={() => handleCategoryCheckChange(category.name)}
                                        />
                                        <p>{category.title}</p>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default SearchSidebar
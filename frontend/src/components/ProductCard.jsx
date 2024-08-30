import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => { navigate(`/productDetail/${product._id}`) }}
            className='flex flex-col px-[10px] gap-[10px] animate__animated animate__zoomIn cursor-pointer'>
            <div className='w-[300px] h-[400px] overflow-hidden'>
                <img src={product?.listingPhotoPaths[0]} alt="image" className='w-full h-full object-cover rounded-[10px] transform transition-transform ease-in hover:scale-110' />
            </div>
            <div className='flex flex-col w-[300px] my-[20px] gap-[10px]'>
                <span>{product.name}</span>
                <span className='font-semibold text-[12px]'>{product.price}&#8363;</span>
            </div>
        </div>
    )
}

export default ProductCard
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import CreateProduct from './product/CreateProduct';
import ShowProduct from './product/ShowProduct';
import EditProduct from './product/EditProduct';

const Products = () => {

    const [openCreate, setOpenCreate] = useState(false);
    const [openShow, setOpenShow] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [productId, setProductId] = useState('');

    return (
        <Wrapper className='h-screen overflow-y-scroll'>
            <div className='flex items-center gap-[10px] py-[20px]'>
                <h1 className='ml-[10px]'>Create Product</h1>
                {openCreate ? (
                    <div onClick={() => setOpenCreate(false)}><CiCircleMinus className='text-[20px]' /></div>
                ) : (
                    <div onClick={() => setOpenCreate(true)}><CiCirclePlus className='text-[20px]' /></div>
                )}
            </div>
            {openCreate && (
                <CreateProduct setOpenCreate={setOpenCreate} setOpenShow={setOpenShow} />
            )}

            <hr className='my-[20px] border-gray-400' />

            <div className='flex items-center gap-[10px] py-[20px]'>
                <h1 className='ml-[10px]'>Show All Products</h1>
                {openShow ? (
                    <div onClick={() => setOpenShow(false)}><CiCircleMinus className='text-[20px]' /></div>
                ) : (
                    <div onClick={() => setOpenShow(true)}><CiCirclePlus className='text-[20px]' /></div>
                )}
            </div>
            {
                openShow && (
                    <ShowProduct setOpenShow={setOpenShow} setOpenEdit={setOpenEdit} setProductId={setProductId} />
                )
            }

            <hr className='my-[20px] border-gray-400' />

            <div className='flex items-center gap-[10px] py-[20px]'>
                <h1 className='ml-[10px]'>Edit Product</h1>
                {openEdit ? (
                    <div onClick={() => setOpenEdit(false)}><CiCircleMinus className='text-[20px]' /></div>
                ) : (
                    <div onClick={() => setOpenEdit(true)}><CiCirclePlus className='text-[20px]' /></div>
                )}
            </div>
            {
                openEdit && (
                    <EditProduct setOpenEdit={setOpenEdit} productId={productId} setOpenShow={setOpenShow} />
                )
            }

        </Wrapper>
    )
}

const Wrapper = styled.section`
    
`

export default Products
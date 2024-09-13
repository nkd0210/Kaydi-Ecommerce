import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Loader from '../../Loader';
import 'animate.css';

const ShowProduct = ({ allProducts, setOpenShow, setOpenEdit, setProductId, loading }) => {

    const columns = [
        { name: 'ID', selector: row => row._id },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Description', selector: row => row.description },
        { name: 'Price', selector: row => row.price, sortable: true },
        { name: 'Stock', selector: row => row.stock },
        { name: 'Categories', selector: row => row.categories.join(', '), sortable: true },
        { name: 'Sizes', selector: row => row.sizes.join(', ') },
        { name: 'Colors', selector: row => row.colors.join(', ') },
        { name: 'Created At', selector: row => new Date(row.createdAt).toLocaleString(), sortable: true }
    ];

    const sortedProducts = allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleRowClick = (id) => {
        setProductId(id);
        setOpenShow(false);
        setOpenEdit(true)
    }


    return (
        <div className='w-full overflow-x-scroll overflow-scroll animate__animated animate__fadeInUp'>
            {loading ? (
                <Loader />
            ) : (
                <DataTable
                    columns={columns}
                    data={sortedProducts}
                    pagination
                    selectableRows
                    highlightOnHover
                    onRowClicked={(row) => handleRowClick(row._id)}
                />
            )}
        </div>
    )
}

export default ShowProduct
import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Loader from '../../Loader';

const ShowProduct = ({ setOpenShow, setOpenEdit, setProductId }) => {

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleFetchAllProducts = async () => {
        try {
            const res = await fetch(`/api/product/getAllProduct`, {
                method: "GET"
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setAllProducts(data.allProducts);
                setLoading(false);
            }
        } catch (error) {
            console(error.message);
        }
    }

    useEffect(() => {
        handleFetchAllProducts();
    }, []);

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
        <div className='max-md:w-[500px] w-[1400px]  overflow-scroll'>
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
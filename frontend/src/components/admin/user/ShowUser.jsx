import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Loader from '../../Loader';
import 'animate.css';

const ShowUser = ({ allUsers, openEdit, setOpenEdit, setUserId }) => {
    const columns = [
        { name: 'ID', selector: row => row._id },
        { name: 'Username', selector: row => row.username },
        { name: 'Email', selector: row => row.email },
        // { name: 'Profile Picture', selector: row => <img src={row.profilePic} alt="Profile" width={50} height={50} /> },
        { name: 'Gender', selector: row => row.gender },
        { name: 'Phone Number', selector: row => row.phoneNumber },
        { name: 'Date of Birth', selector: row => row.dateOfBirth },
        { name: 'Addresses', selector: row => row.addressList.join(', ') },
        { name: 'Admin Status', selector: row => row.isAdmin ? 'Yes' : 'No' }
    ];

    const sortedUsers = allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleRowClick = (id) => {
        setOpenEdit(true);
        setUserId(id);
    }

    return (
        <div className='w-full overflow-x-scroll overflow-scroll animate__animated animate__fadeInUp'>
            <DataTable
                columns={columns}
                data={sortedUsers}
                pagination
                selectableRows
                highlightOnHover
                onRowClicked={(row) => handleRowClick(row._id)}
            />
        </div>
    )
}

export default ShowUser
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import { useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'

const Collection = () => {
    return (
        <>
            <Navigation />
            <Navbar />
            <div className='p-[20px]'>
                test
            </div>
        </>
    )
}

export default Collection
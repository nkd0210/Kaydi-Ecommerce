import React from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import AdminDashBoard from '../components/AdminDashBoard'

import { useSelector } from 'react-redux'

const Home = () => {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      {
        currentUser?.isAdmin ? (
          <>
            <Navigation />
            <AdminDashBoard />
          </>
        ) : (
          <>
            <Navigation />
            <Navbar />
            <Hero />
          </>
        )
      }
    </>
  )
}

export default Home
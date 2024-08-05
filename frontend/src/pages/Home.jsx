import React from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'

import { useSelector } from 'react-redux'
import RecentProduct from '../components/RecentProduct'

const Home = () => {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <>
      <>
        <Navigation />
        <Navbar />
        <Hero />
        <RecentProduct />
      </>
    </>
  )
}

export default Home
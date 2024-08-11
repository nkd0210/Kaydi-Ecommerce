import React from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import RecentProduct from '../components/RecentProduct'

const Home = () => {

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
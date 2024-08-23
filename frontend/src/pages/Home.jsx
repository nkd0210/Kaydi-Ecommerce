import React from 'react'
import Navbar from '../components/Navbar'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import RecentProduct from '../components/RecentProduct'
import SportClothes from '../components/productLandingPage/SportClothes'
import CasualClothes from '../components/productLandingPage/CasualClothes'
import UnderwearClothes from '../components/productLandingPage/UnderwearClothes'
import Footer from '../components/Footer'

const Home = () => {

  return (
    <>
      <>
        <Navigation />
        <Navbar />
        <Hero />
        <RecentProduct />
        <SportClothes />
        <CasualClothes />
        <UnderwearClothes />
        <Footer />
      </>
    </>
  )
}

export default Home
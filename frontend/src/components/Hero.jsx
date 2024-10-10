import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import hero1 from '/heroImage/hero1.webp'
import hero2 from '/heroImage/hero2.jpg'
import hero3 from '/heroImage/hero3.webp'
import hero4 from '/heroImage/hero4.webp'

const Hero = () => {

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplaySpeed: 3000,
    autoplay: true
  };

  return (
    <div className='max-w-full  h-[600px] max-md:h-[200px] mb-[50px] 3xl:mb-[300px]'>
      <Slider {...settings}>
        <div className='w-full h-full'>
          <img src={hero1} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='w-full h-full]'>
          <img src={hero2} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='w-full h-full'>
          <img src={hero3} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='w-full h-full'>
          <img src={hero4} alt="" className='w-full h-full object-cover' />
        </div>
      </Slider>
    </div>
  )
}

export default Hero
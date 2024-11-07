import React from 'react'

const Footer = () => {
    return (
        <div className='w-full px-[20px] bg-[#212121] text-white max-md:p-0'>
            <div className='flex flex-col gap-[20px] w-full'>

                <div className='border-gray-400 border-t-[1px] border-b-[1px]'>
                    <div className='flex justify-between max-md:flex-col gap-[20px] p-[20px] max-md:px-[40px]'>
                        <h3 className='font-semibold text-[20px] max-md:text-[14px]'>Join our newsletter to<br />keep up to date with us!</h3>
                        <div className='flex gap-[10px]'>
                            <input type="email" placeholder='Enter your email' className='border rounded-[20px] px-[10px] w-[200px] h-[50px]' />
                            <button className='rounded-[20px] px-[20px] h-[50px] bg-[#87db1c] cursor-pointer hover:bg-opacity-70 hover:text-black'>Subscribe</button>
                        </div>
                    </div>
                </div>

                <div className='border-gray-400 border-b-[1px]  '>
                    <div className='flex max-md:flex-col p-[20px] '>
                        {/* LOGO */}
                        <a href="/" className='w-[200px] h-[150px]'>
                            <img src="/logo/logo.png" alt="logo" loading="lazy" className='w-full h-full' />
                        </a>

                        <div className='flex max-md:flex-col gap-[20px] max-md:gap-[50px]'>
                            <div className='flex flex-col gap-[10px] px-[20px]'>
                                <h2 className='uppercase text-[16px] font-semibold'>chính sách</h2>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Chính sách đổi trả 60 ngày</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Chính sách khuyến mãi</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Chính sách bảo mật</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Chính sách giao hàng</h3>

                            </div>
                            <div className='flex flex-col gap-[10px] px-[20px]'>
                                <h2 className='uppercase text-[16px] font-semibold'>chăm sóc khách hàng</h2>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Trải nghiệm mua sắm 100% hài lòng</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Hỏi đáp - FAQs</h3>
                            </div>
                            <div className='flex flex-col gap-[10px] px-[20px]'>
                                <h2 className='uppercase text-[16px] font-semibold'>tuyển dụng</h2>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Tuyển dụng</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Đăng ký bản quyền</h3>
                            </div>
                            <div className='flex flex-col gap-[10px] px-[20px]'>
                                <h2 className='uppercase text-[16px] font-semibold'>kiến thức mặc đẹp</h2>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Hướng dẫn chọn size</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Blog</h3>
                            </div>
                            <div className='flex flex-col gap-[10px] px-[20px]'>
                                <h2 className='uppercase text-[16px] font-semibold'>về kaydi ecommerce</h2>
                                <h3 className='cursor-pointer hover:text-yellow-500'>DVXH xuất sắc</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Câu chuyện về kaydi ecommerce</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Nhà máy</h3>
                                <h3 className='cursor-pointer hover:text-yellow-500'>Care & Share</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between max-md:flex-col gap-[20px] p-[20px] max-md:px-[40px]'>
                    <p>&copy; {new Date().getFullYear()} Kaydi Ecommerce</p>
                    <div className='flex max-md:flex-col gap-[30px]'>
                        <h3 className='cursor-pointer font-semibold'>Terms Of Service</h3>
                        <h3 className='cursor-pointer font-semibold'>Privacy Policy</h3>
                        <h3 className='cursor-pointer font-semibold'> Cookies</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
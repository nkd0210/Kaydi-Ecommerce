import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navigation from "../components/Navigation";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import Account from '../components/Account';
import History from '../components/History';
import Address from '../components/Address';
import Reply from '../components/Reply';
import Policy from '../components/Policy';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

import "animate.css"

const Profile = () => {

    const { activeParam } = useParams();

    const [active, setActive] = useState(activeParam);

    const navigate = useNavigate();

    const handleSelectActive = (e) => {
        setActive(e.target.id);
        navigate(`/profile/${e.target.id}`)
    }

    return (
        <Wrapper>
            <Navigation />
            <Navbar />
            <div className="box">
                {/* MENU */}
                <div className="animate__animated animate__fadeInLeft">
                    <div onClick={handleSelectActive} id='account' className={`flex justify-between border p-[10px] ${active === 'account' ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer hover:bg-opacity-70`}>
                        Thông tin tài khoản
                        <FaLongArrowAltRight className="text-[20px]" />
                    </div>
                    <div onClick={handleSelectActive} id='history' className={`flex justify-between border p-[10px] ${active === 'history' ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer hover:bg-opacity-70`}>
                        Lịch sử đơn hàng
                        <FaLongArrowAltRight className="text-[20px]" />
                    </div>
                    <div onClick={handleSelectActive} id='address' className={`flex justify-between border p-[10px] ${active === 'address' ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer hover:bg-opacity-70`}>
                        Sổ địa chỉ
                        <FaLongArrowAltRight className="text-[20px]" />
                    </div>
                    <div onClick={handleSelectActive} id='reply' className={`flex justify-between border p-[10px] ${active === 'reply' ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer hover:bg-opacity-70`} >
                        Đánh giá và phản hồi
                        <FaLongArrowAltRight className="text-[20px]" />
                    </div>
                    <div onClick={handleSelectActive} id='policy' className={`flex justify-between border p-[10px] ${active === 'policy' ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer hover:bg-opacity-70`}>
                        Chính sách và câu hỏi thường gặp
                        <FaLongArrowAltRight className="text-[20px]" />
                    </div>
                </div>

                {/* DETAIL */}
                <div className="border rounded-[10px] animate__animated animate__fadeIn">
                    {active === 'account' && <Account />}
                    {active === 'history' && <History />}
                    {active === 'address' && <Address />}
                    {active === 'reply' && <Reply />}
                    {active === 'policy' && <Policy />}
                </div>

            </div>
        </Wrapper>
    );
};

const Wrapper = styled.section`
  .box {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 20px;
    padding: 20px;
  }

  @media (max-width: 500px) {
    .box {
        display: flex;
        flex-direction: column;
    }
  }
`

export default Profile;

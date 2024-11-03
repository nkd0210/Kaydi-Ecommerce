import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setClearOrder } from '../redux/order/orderSlice'
import { setCartSuccess } from '../redux/cart/cartSlice'
import "animate.css"

// TOAST
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentSuccess = () => {

    const { orderId } = useParams();
    const { products, totalPrice } = useSelector((state) => state.order);
    const { currentUser } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const hanldeUpdatePaymentCheck = async () => {
        const res = await fetch(`/api/order/updatePaymentCheck/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message)
        } else {
            dispatch(setClearOrder());
            navigate('/profile/history')
        }
    }

    const handleRemoveProductInCart = async () => {
        try {
            const res = await fetch(`/api/cart/removeItemsInCart`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUser?._id,
                    productsRemove: products
                })
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            } else {
                dispatch(setCartSuccess(data));
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    useEffect(() => {
        if (orderId) {
            handleRemoveProductInCart();
        }
    }, [orderId])

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className='flex max-md:flex-col gap-[20px] p-[30px] justify-center items-center  border border-[#1e894d] rounded-[20px] animate__animated animate__fadeInDown'>
                {/* left */}
                <div className='flex flex-col gap-[20px] w-[400px] max-md:justify-center max-md:items-center'>
                    <h2 className='text-[30px] font-semibold text-[#1e894d] animate__animated animate__bounceIn'>Thanh toán thành công!</h2>
                    <p>Cảm ơn vì đã chọn nhãn hàng của chúng tôi. Đơn hàng của bạn sẽ được giao trong vòng 1-2 ngày tới.</p>
                    <div onClick={hanldeUpdatePaymentCheck} className='rounded-[10px] py-[5px] px-[15px] bg-[#1e894d] text-white hover:opacity-80 cursor-pointer w-[200px] text-center'>Trở lại trang chủ </div>
                </div>

                {/* right */}
                <img src="/success.png" alt="success" className='w-[300px] h-[300px] object-cover animate__animated animate__tada' style={{ animationDuration: "2s", animationIterationCount: "3" }} />
            </div>
        </div>
    )
}

export default PaymentSuccess
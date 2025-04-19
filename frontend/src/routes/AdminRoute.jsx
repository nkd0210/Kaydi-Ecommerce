import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { clearCart } from '../redux/cart/cartSlice';
import { setClearOrder } from '../redux/order/orderSlice';

const AdminRoute = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const signOutIfNotAdmin = async () => {
        if (currentUser && !currentUser.isAdmin) {
            try {
                await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/signout`, {
                    method: 'POST',
                    credentials: 'include',
                });
            } catch (err) {
                console.error('Signout failed:', err);
            }
            dispatch(signOutSuccess());
            dispatch(clearCart());
            dispatch(setClearOrder());
            navigate('/signIn');
        }
    };

    useEffect(() => {
        signOutIfNotAdmin();
    }, [currentUser, dispatch, navigate]);

    if (!currentUser) return <Navigate to="/signIn" replace />;
    if (!currentUser.isAdmin) return null; // Wait for `useEffect` to run logout

    return children;
};

export default AdminRoute;

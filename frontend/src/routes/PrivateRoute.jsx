import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser ? <Outlet /> : <Navigate to="/signIn" replace />;
};

export default PrivateRoute;

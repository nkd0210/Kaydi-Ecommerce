import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import UserCart from './pages/UserCart';
import OrderPage from './pages/OrderPage';
import OrderDetail from './pages/OrderDetail';
import PaymentSuccess from './pages/PaymentSuccess';
import Collection from './pages/Collection';
import Review from './pages/Review';
import Search from './pages/Search';
import Chat from './pages/Chat';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/resetPassword' element={<ResetPassword />} />
        <Route path='/newPassword/:resetToken' element={<NewPassword />} />
        <Route path='/profile/:activeParam' element={<Profile />} />
        <Route path='/productDetail/:productId' element={<ProductDetail />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/cart' element={<UserCart />} />
        <Route path='/order' element={<OrderPage />} />
        <Route path='/orderDetail/:orderId' element={<OrderDetail />} />
        <Route path='/paymentSuccess/:orderId' element={<PaymentSuccess />} />
        <Route path='/collections/:category' element={<Collection />} />
        <Route path='/collections/:category/:subcategory' element={<Collection />} />
        <Route path='/review/:orderId' element={<Review />} />
        <Route path='/search/:searchKey?' element={<Search />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

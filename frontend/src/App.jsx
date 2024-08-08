import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import UserCart from './pages/UserCart';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/profile/:activeParam' element={<Profile />} />
        <Route path='/productDetail/:productId' element={<ProductDetail />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/cart' element={<UserCart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

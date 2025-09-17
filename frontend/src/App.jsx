import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './layouts/Layout';
import React from 'react';
import About from './pages/About';
import ProductView from './pages/ProductView';
import UserProfile from './pages/UserProfile';
import Bag from './pages/Bag';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import NotFound from './pages/NotFound';
import ValidateCategory from './pages/ValidateCategory';
import { Toaster } from 'react-hot-toast'
import Search from './pages/Search';
import Products from './pages/Products';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from './store/actions/userAction';
import EditAddress from './components/userProfile/EditAddress';
import Contact from './pages/Contact';
import ReturnsAndExchangePolicy from './pages/ReturnsAndExchangePolicy';
import ShippingAndDelivery from './pages/ShippingAndDelivery';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Protected from './components/common/Protected';

export default function App() {
  // const { isLoggedIn } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
  }, [])

  return (
    <Router>
      <Layout>
        <Toaster toastOptions={{ 
          removeDelay: 0,
          style: {
            borderRadius: '0',
            background: 'black',
            color: 'white',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '12px',
          } 
        }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* company pages routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* policy pages routes */}
          <Route path="/return-policy" element={<ReturnsAndExchangePolicy />} />
          <Route path="/shipping" element={<ShippingAndDelivery />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* protected routes */}
          <Route path="/profile" element={<Protected> <UserProfile /> </Protected>} />
          <Route path="/profile/edit-address" element={<Protected> <EditAddress /> </Protected>} />
          <Route path="/orders" element={<Protected> <Orders /> </Protected>} />
          <Route path="/orders/:orderId" element={<Protected> <OrderDetails /> </Protected>} />

          <Route path="/search" element={<Search />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductView />} />
          <Route path="/bag" element={<Bag />} />
          <Route path={`/collections/:category`} element={<ValidateCategory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
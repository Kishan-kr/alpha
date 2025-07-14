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

export default function App() {

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
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductView />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path={`/collections/:category`} element={<ValidateCategory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './layouts/Layout';
import React from 'react';
import About from './pages/About';
import ProductView from './pages/ProductView';
import UserProfile from './pages/UserProfile';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/:id" element={<ProductView />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}
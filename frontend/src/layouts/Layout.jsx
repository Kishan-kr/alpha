import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import React from 'react';
import Navbar from '../components/common/Navbar';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
import Header from '../components/Header';
import Footer from '../components/Footer';
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
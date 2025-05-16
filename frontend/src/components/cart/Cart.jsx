import { X } from 'lucide-react'
import React from 'react'
import Product from './Product'

// dummy data
const products = [
  { id: '1', title: 'Product 1', price: 10.99, size: 'M', quantity: 1 },
  { id: '2', title: 'Product 2', price: 9.99, size: 'L', quantity: 2 },
  { id: '3', title: 'Product 3', price: 12.99, size: 'S', quantity: 3 },
]

function Cart({ isOpen, closeCart = () => { } }) {
  const [cartItems, setCartItems] = React.useState(products);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item =>
      item.id !== id
    ));
  }

  const handleQuantityChange = (id, quantity) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  }

  return (
    <section className={`fixed top-0 right-0 h-screen bg-white max-w-96 md:max-w-[420px] shadow-lg transform transition-transform duration-500 z-50 ${isOpen ? 'translate-0' : 'translate-x-full'
      }`}>
      <div className='flex justify-between py-6 h-[80px] px-3 md:px-6'>
        <h4 className='text-2xl font-semibold text-[var(--color-black)]'>Cart <sup className='text-sm font-semibold text-gray-700 bg-gray-200 inline-block text-center rounded-full h-5 w-5'>{cartItems.length}</sup></h4>
        <button className='p-1 cursor-pointer' onClick={closeCart}><X className='w-6 h-6' /></button>
      </div>
      <hr className='h-px text-gray-300' />

      {/* products section  */}
      <ul className='flex flex-col gap-12 py-6 overflow-y-auto h-[calc(100vh-188px)] px-3 md:px-6'>{cartItems.map(product =>
        (<Product 
          key={product.id}
          product={product} 
          handleRemoveFromCart={handleRemoveItem}
          updateQuantity={handleQuantityChange}
        />)
      )}</ul>

      <hr className='h-px text-gray-300' />
      <div className='py-3 h-80 px-3 md:px-6'>
        <p className='mb-2'>Shipping and taxes calculated at checkout</p>
        <button className='uppercase w-full py-3 bg-[var(--olive-green)] text-white'>Buy Now</button>
      </div>
    </section>
  )
}

export default Cart
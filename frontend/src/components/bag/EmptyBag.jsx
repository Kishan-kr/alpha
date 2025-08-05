import React from 'react'
import { Link } from "react-router-dom";
import { ShoppingBag } from 'lucide-react';

function EmptyBag() {
  return (
    <div className='w-full sm:w-fit mx-auto flex flex-col items-center text-center py-6 xxs:px-6 mb-12 mt-9 md:mt-0 xxs:border xxs:border-hover-tint font-light'>
      <figure className='mt-10'>
        <ShoppingBag strokeWidth={1} size={24}/>
      </figure>
      <h3 className='text-sm text-dark uppercase mt-6'>Your bag is empty</h3>
      <p className='text-xs text-subtext mt-3'>Items you add will show up here</p>
      <Link to='/products' className='p-2 w-full sm:w-sm text-sm mt-11 bg-dark text-light px-12 uppercase'>Start shopping</Link>
    </div>
  )
}

export default EmptyBag
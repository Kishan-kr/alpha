import React from 'react'
import emptyBag from '../../assets/photos/emptyBag.png'
import { Link } from "react-router-dom";

function EmptyBag() {
  return (
    <div className='w-full flex flex-col items-center text-center pb-12'>
      <img src={emptyBag} alt="" className='w-52 text-shadow-2xs text-shadow-surface' />
      <h3 className='text-2xl text-light -mt-4'>Your bag is empty</h3>
      <p className='text-base text-subtext mt-1'>But your Tashn moment is just a click away.</p>
      <Link to='/' className='p-2 rounded-full mt-6 bg-light text-dark font-semibold shadow-md px-8 hover:bg-light/80 transition'>Pick your style</Link>
    </div>
  )
}

export default EmptyBag
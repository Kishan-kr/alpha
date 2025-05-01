import React from 'react'
import oversizedTshirt from '../assets/ProductCategories/oversizedTshirt.jpg'
import printedTshirt from '../assets/ProductCategories/printedTshirt.jpg'
import product3 from '../assets/ProductCategories/product3.jpg'
import product4 from '../assets/ProductCategories/product4.jpg'
import { Link } from 'react-router-dom'

const products = [
  {
    id: 1,
    image: oversizedTshirt,
    title: "Black Oversized Tee",
    discountedPrice: 799,
    originalPrice: 1299
  },
  {
    id: 2,
    image: printedTshirt,
    title: "Streetwear Graphic Tee",
    discountedPrice: 899,
    originalPrice: 1399
  },
  {
    id: 3,
    image: product3,
    title: "Muted Sand T-shirt",
    discountedPrice: 749,
    originalPrice: 1199
  },
  {
    id: 4,
    image: product4,
    title: "White Minimal Tee",
    discountedPrice: 699,
    originalPrice: 1099
  }
];

function LatestProducts() {
  return (
    <section className='w-full flex flex-col items-center'>
      <h3 className='text-xl tracking-widest font-bold text-center uppercase'>Latest Products</h3>
      {/* products list  */}
      <ul className='flex gap-8 justify-center my-12'>{products.map(product =>
        (Product({ product })))}
      </ul>

      {/* view all products link  */}
      <Link
        to="/products"
        className="relative group overflow-hidden inline-block py-3 px-6 text-sm font-semibold text-white uppercase border border-[#556B2F] tracking-widest transition-all duration-300"
      >
        <span className="relative z-10 transition-colors duration-300 group-hover:text-[#556B2F]">
          View All Products
        </span>
        <span className="absolute inset-0 bg-[#556B2F] transition-transform duration-300 group-hover:translate-x-full "></span>
      </Link>

    </section>
  )
}

function Product({ product }) {
  return (
    <li className='text-center'>
      <img src={product.image} width={"270px"} alt="Oversized T-shirts" />
      <p className='text-[var(--color-black)]/90 text-lg tracking-wider mt-2'>{product?.title}</p>
      <div className='flex gap-4 justify-center'>
        <span className='text-[#E4572E] text-lg tracking-widest'>₹{product.discountedPrice}</span>
        <span className='text-[var(--color-black)]/90 line-through text-lg'>₹{product.originalPrice}</span>
      </div>
    </li>
  )
}

export default LatestProducts
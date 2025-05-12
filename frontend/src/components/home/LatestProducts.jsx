import React from 'react'
import oversizedTshirt from '../../assets/ProductCategories/oversizedTshirt.jpg'
import printedTshirt from '../../assets/ProductCategories/printedTshirt.jpg'
import product3 from '../../assets/ProductCategories/product3.jpg'
import product4 from '../../assets/ProductCategories/product4.jpg'
import newArrivalCharacter from '../../assets/photos/newArrivalCharacter.png'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

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

function LatestProducts({ scrollRef }) {
  return (
    <section ref={scrollRef} id='latest-product' style={{ scrollMarginTop: "8rem" }} className='w-full py-16 flex flex-col'>
      <div className='px-4 w-full flex items-center gap-4 relative mt-8'>
        <h3 className='text-xl md:text-6xl text-nowrap text-white tracking-widest font-thin text-center uppercase'>New Arrivals</h3>

        <hr
          className='h-4 w-full text-white bg-linear-to-b from-white/60 from-0% via-surface via-5% to-90% to-white/60  ms-auto z-20'
          style={{
            backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(255,255,255,0.6) 0%,
        var(--color-surface) 10%,
        var(--color-surface) 90%,
        rgba(255,255,255,0.6) 100%
      )
    `
          }}
        />

        <img src={newArrivalCharacter} alt="" className='absolute h-36 md:h-60 right-0 md:right-4 -top-[90px] md:-top-[124px] z-30' />
      </div>
      {/* products list  */}

      <ul
        className="flex items-center overflow-x-auto w-full gap-8 my-12 px-4 snap-mandatory snap-x sm:snap-none"
      >
        {products.map(product => (
          <li key={product.id} className='snap-start'>
            <Product {...product} />
          </li>
        ))}
      </ul>

      {/* view all products link  */}
      <Link
        // to="/products"
        className="relative inline-block w-fit mx-auto overflow-hidden py-3 px-6 text-sm font-semibold uppercase tracking-widest text-white border border-white bg-dark group"
      >
        {/* Text + Arrow stays on top */}
        <span className="relative z-10 flex items-center transition-colors duration-300 group-hover:text-dark">
          View All Products
          <ArrowRight className="w-4 h-4 ml-2 transition group-hover:translate-x-2" />
        </span>

        {/* Sliding white panel */}
        <span className="absolute inset-0 bg-white transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0" />
      </Link>
    </section>
  )
}

function Product({
  id,
  image,
  title,
  discountedPrice,
  originalPrice,
}) {
  return (
    <article
      key={id}
      className="h-full group border border-border rounded-lg overflow-hidden transition-colors duration-300 hover:bg-hoverTint flex flex-col cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative bg-surface w-[290px] md:w-[280px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover transition duration-300 group-hover:scale-125"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 bg-surface h-fit flex flex-col">
        <h3 className="text-light text-lg font-semibold">
          {title}
        </h3>

        {/* Price */}
        <div className="mt-4 flex items-baseline space-x-2">
          <span className="text-light font-bold text-xl">
            ₹{discountedPrice}
          </span>
          <span className="text-subtext line-through text-sm">
            ₹{originalPrice}
          </span>
        </div>
      </div>
    </article>
  );
}


export default LatestProducts
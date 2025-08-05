import React from 'react'
import { Link } from 'react-router-dom'
import SizeSelectMenu from '../common/SizeSelector'
import { addToBagAndSync } from '../../utils/bagSync'
import { useDispatch, useSelector } from 'react-redux'
import getBagProductData from '../../utils/getBagProductData'
import { LOADING, NEW_ARRIVALS_SKELETON_COUNT } from '../../constants/appConstants'
import ProductCardSkeleton from './ProductCardSkeleton'

function LatestProducts({ scrollRef }) {
  const { isLoggedIn } = useSelector(state => state.user);
  const { status, items, error } = useSelector(state => state.home.newArrivals);
  const dispatch = useDispatch();

  const handleSizeSelect = (product, size) => {
    const bagItem = getBagProductData(product, size);
    addToBagAndSync(bagItem, dispatch, isLoggedIn);
  };

  const isLoading = status === LOADING;

  const LoadingScreen = (<>
    <ul
      className="flex flex-wrap items-center justify-between w-full gap-5 sm:gap-8 md:gap-15 my-8 md:my-10 snap-mandatory snap-y sm:snap-none"
    >
      {Array.from({ length: NEW_ARRIVALS_SKELETON_COUNT }).map((_, i) =>
        <ProductCardSkeleton key={i} />)}
    </ul>

    <div className="mx-auto h-3 w-44 bg-surface mt-8" />
  </>)

  const errorScreen = (
    <div className="flex justify-center py-24 mt-8">
      <p className="text-subtext text-center uppercase text-sm tracking-wide">{error}</p>
    </div>
  )


  return (
    <section ref={scrollRef} id='latest-product' style={{ scrollMarginTop: "0rem" }} className='bg-light w-full py-16 px-5 md:px-15 flex flex-col'>
      <div className='w-full flex items-center gap-4 relative mt-8'>
        <h3 className='text-xl md:text-2xl text-nowrap text-dark font-gfs-didot text-center uppercase'>New Arrivals</h3>
      </div>

      {isLoading ? LoadingScreen :
        error ? errorScreen :
          <>
            {/* products list  */}
            <ul
              className="flex flex-wrap items-center justify-between w-full gap-5 sm:gap-8 md:gap-15 my-8 md:my-10 snap-mandatory snap-y sm:snap-none"
            >
              {items.map(product => (
                <Product key={product._id} product={product} handleSizeSelect={handleSizeSelect} />
              ))}
            </ul>

            <Link
              to="/products"
              className="relative inline-block w-fit mx-auto overflow-hidden py-2 mt-8 text-sm font-light uppercase tracking-widest text-dark group"
            >
              {/* Text stays on top */}
              <span className="relative z-10 flex items-center">
                View All Products
              </span>

              {/* Expanding underline */}
              <span className="absolute bottom-2 left-0 h-px w-0 bg-border origin-left group-hover:w-full transition-all duration-300 z-0" />
            </Link>
          </>}

    </section>
  )
}

function Product({
  product,
  handleSizeSelect
}) {

  const {
    productId: _id,
    thumbnail,
    title,
    metaTitle,
    sizes,
    originalPrice,
    effectivePrice
  } = product;

  const availableSizes = sizes?.map(item => item.size);

  return (
    <article
      className="h-full basis-52 mx-auto max-w-60 grow shrink flex flex-col"
    >
      {/* Product Image */}
      <Link
        to={`/products/${metaTitle}`}
        className="relative group bg-surface overflow-hidden aspect-[2/3] cursor-pointer">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
        />
      </Link>

      {/* Product Info */}
      <div className="h-fit flex justify-between mt-2">
        <div className='flex flex-col'>
          <Link
            to={`/products/${metaTitle}`}
            className="text-dark text-xs font-light uppercase cursor-pointer hover:underline">
            {title}
          </Link>

          {/* Price */}
          <div className="mt-1 flex items-baseline space-x-2">
            {originalPrice !== effectivePrice ? (
              <>
                <span className="text-dark text-xs font-light uppercase line-through">
                  ₹ {originalPrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-dark bg-accent px-1 text-xs font-light uppercase">
                  ₹ {effectivePrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </>
            ) : (
              <span className="text-dark text-xs font-light uppercase">
                ₹ {effectivePrice?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
          </div>
        </div>

        {/* add to bag button */}
        <SizeSelectMenu
          sizes={availableSizes}
          onChange={(size) => { handleSizeSelect(product, size) }}
        >
          <button className='bg-surface h-7 w-7 p-1 text-xl font-thin flex items-center justify-center hover:border-subtext cursor-pointer'>+</button>
        </SizeSelectMenu>
      </div>
    </article>
  );
}


export default LatestProducts
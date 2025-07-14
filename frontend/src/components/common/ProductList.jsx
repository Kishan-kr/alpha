import React from 'react'
import ProductCard from './ProductCard';
import { addToBagAndSync } from '../../utils/bagSync';
import { useDispatch, useSelector } from 'react-redux';

// later we will add pagination here 
function ProductList({ title, products, isLoading, error, productCount }) {
  const { isLoggedIn } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSizeSelect = (product, size) => {
    addToBagAndSync({
      ...product,
      size,
      quantity: 1,
    }, dispatch, isLoggedIn);
  }

  return (
    <div className="bg-background text-dark px-6 sm:px-6 md:px-28 pt-20 pb-6 md:pt-26 md:pb-8">
      <div className='flex gap-2 items-center mb-8'>
        <h2 className="text-sm sm:text-base font-light uppercase">
          {title}
        </h2>

        <p className='text-subtext text-xs p-1 px-2 bg-surface'>{productCount} items</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24 mt-8">
          <p className='text-xs tracking-wider font-light uppercase animate-pulse'>Unfolding elegance...</p>
        </div>
      ) : products?.length === 0 || error ? (
        <div className="flex justify-center py-24 mt-8">
          {error ? <p className="text-subtext text-center uppercase text-sm tracking-wide">{error}</p> :
            <p className="text-subtext text-center uppercase text-sm tracking-wide">No matches found. Maybe try something else?</p>}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-6 slg:gap-15 gap-y-15">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} handleSizeSelect={handleSizeSelect}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList
import React from 'react'
import ProductCard from './ProductCard';
import { addToBagAndSync } from '../../utils/bagSync';
import { useDispatch, useSelector } from 'react-redux';
import getBagProductData from '../../utils/getBagProductData';

// later we will add pagination here 
function RelatedProducts({ title, products }) {
  const { isLoggedIn } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSizeSelect = (product, size) => {
    const bagItem = getBagProductData(product, size);
    addToBagAndSync(bagItem, dispatch, isLoggedIn);
  };

  return (
    <div className="bg-light text-dark">
      <div className='flex gap-2 items-center mb-8'>
        <h2 className="text-sm sm:text-base font-light uppercase">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-fr xs:gap-6 slg:gap-15 gap-y-15">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} handleSizeSelect={handleSizeSelect}/>
          ))}
        </div>
    </div>
  );
}

export default RelatedProducts
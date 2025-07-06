import React, { useEffect, useState } from 'react';
import ProductCard from '../components/category/ProductCard';
import { products as dummyProducts } from '../temp/productData';
const productCount = 8; // dummy data

export default function Category({ info }) {
  const { id: categoryId, name: categoryName } = info;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true);
    // fetch(`/api/products/category/${categoryId}`)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setProducts(data.products);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error('Failed to fetch category products', err);
    //     setLoading(false);
    //   });
    setLoading(false);
    setProducts(dummyProducts)
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-background text-dark px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className='flex gap-2 items-center mb-6'>
        <h1 className="text-xl sm:text-2xl font-semibold capitalize">
          {categoryName}
        </h1>

        <p className='text-subtext p-1 px-2 rounded bg-surface'>{productCount} items</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className='text-4xl'>Loading...</div> {/* Optional spinner component */}
        </div>
      ) : products.length === 0 ? (
        <p className="text-subtext text-center">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
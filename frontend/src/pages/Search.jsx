import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { LOADING, PRODUCTS_PER_PAGE } from '../constants/products';
import { fetchProducts } from '../store/actions/productAction';
import ProductList from '../components/common/ProductList';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim();
  const dispatch = useDispatch();

  // later we will add pagination 
  const { items, status, error, currentPage, totalCount, totalPages } = useSelector((state) => state.products);

  useEffect(() => {
    if (query) {
      const queryString = new URLSearchParams({
        search: query,
        limit: PRODUCTS_PER_PAGE,
        sortBy: 'createdAt',
        order: 'desc',
      }).toString();

      dispatch(fetchProducts(queryString));
    }
  }, [dispatch, query]);

  const isLoading = status === LOADING;

  return (
    <ProductList 
      title={query}
      products={items}
      productCount={totalCount}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default Search;
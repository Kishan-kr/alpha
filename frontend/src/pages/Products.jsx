import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { LOADING, PRODUCTS_PER_PAGE } from '../constants/appConstants';
import ProductList from '../components/common/ProductList';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../store/actions/productAction';

function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q')?.trim() || '';
  const dispatch = useDispatch();

  // later we will add pagination 
  const { items, status, error, currentPage, totalCount, totalPages } = useSelector((state) => state.products);
  const [queryParams, setQueryParams] = useState({
    search: searchQuery,
    limit: PRODUCTS_PER_PAGE,
    page: 1,
    sortBy: 'createdAt',
    order: 'desc',
  })

  useEffect(() => {
      const queryString = new URLSearchParams(queryParams).toString();
      dispatch(fetchProducts(queryString));
  }, [dispatch, queryParams]);

  const isLoading = status === LOADING;

  return (
    <ProductList 
      title={'Latest Products'}
      products={items}
      productCount={totalCount}
      isLoading={isLoading}
      error={error}
    />
  );
}

export default Products
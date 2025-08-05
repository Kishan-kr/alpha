import React, { useEffect, useState } from 'react';
import ProductList from '../components/common/ProductList';
import { LOADING, PRODUCTS_PER_PAGE } from '../constants/appConstants';
import { fetchProducts } from '../store/actions/productAction';
import { useDispatch, useSelector } from 'react-redux';

export default function Category({ info }) {
  const { id: categoryId, name: categoryName } = info;
  const { items, status, error, currentPage, totalCount, totalPages } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    const queryString = new URLSearchParams({
      category: categoryId,
      limit: PRODUCTS_PER_PAGE,
      sortBy: 'createdAt',
      order: 'desc',
    }).toString();

    dispatch(fetchProducts(queryString));
  }, [categoryId]);

  const isLoading = status === LOADING;

  return (
    <ProductList
      title={categoryName}
      products={items}
      productCount={totalCount}
      isLoading={isLoading}
      error={error}
    />
  );
}
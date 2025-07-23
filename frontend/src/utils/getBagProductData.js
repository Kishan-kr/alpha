
const getBagProductData = (product) => {
  const { _id, thumbnail, title, originalPrice, discountedPrice, effectivePrice } = product;
  const bagProductData = {
    productId: _id,
    thumbnail,
    title,
    discountedPrice,
    originalPrice,
    effectivePrice
  }

  return bagProductData;
}

export default getBagProductData;
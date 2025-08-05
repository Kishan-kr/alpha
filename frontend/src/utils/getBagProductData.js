
const getBagProductData = (product, size) => {
  const { _id, thumbnail, title, originalPrice, discountedPrice, effectivePrice, colors, sizes } = product;

  const sizeData = sizes?.find(s => s.size === size);
  const color = colors[0] || null
  const variantId = `${_id}_${size}_${color || ''}`

  const bagProductData = {
    productId: _id,
    variantId,
    thumbnail,
    title,
    discountedPrice,
    originalPrice,
    effectivePrice,
    color: colors?.[0] || null,
    size,
    quantity: 1,
    maxStock: sizeData?.quantity ?? 0
  };

  return bagProductData;
};

export default getBagProductData;
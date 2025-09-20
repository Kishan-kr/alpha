import React, { useEffect, useRef, useState } from "react";
import RelatedProducts from "../components/common/RelatedProducts";
import DescriptionAndCare from "../components/common/DescriptionAndCare";
import SizeSelectMenu from "../components/common/SizeSelector";
import { addToBagAndSync } from "../utils/bagSync";
import { useDispatch, useSelector } from "react-redux";
import getBagProductData from "../utils/getBagProductData";
import { useParams } from "react-router-dom";
import { fetchProductDetail, fetchProducts } from "../store/actions/productAction";
import { LOADING } from "../constants/appConstants";
import SizeChartModal from "../components/common/SizeChartModal";
import ResponsiveImage from "../components/common/ResponsiveImage";


const ProductView = () => {
  // get slug form url params 
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.user);
  const { product, status, error } = useSelector((state) => state.productDetail);
  const { items } = useSelector((state) => state.products);
  const [showSizeChartModal, setShowSizeChartModal] = useState(false)

  useEffect(() => {
    dispatch(fetchProductDetail(slug));

    // fetch more products 
    const queryString = new URLSearchParams({
      limit: 5,
      page: 1
    }).toString();
    dispatch(fetchProducts(queryString));
  }, [dispatch, slug]);

  const isLoading = status === LOADING;

  if (isLoading) {
    return (
      <section className="flex justify-center py-24 mt-20 md:mt-26">
        <p className='text-xs tracking-wider font-light uppercase animate-pulse'>Unfolding elegance...</p>
      </section>
    );
  }

  else if (error) {
    return (
      <div className="flex justify-center py-24 mt-20 md:mt-26">
        <p className="text-subtext text-center uppercase text-sm tracking-wide">{error}</p>
      </div>
    )
  }

  const {
    originalPrice,
    effectivePrice,
    images = [],
    title,
    description,
    story,
    sizes = [],
  } = product;

  const availableSizes = sizes?.filter(item => item.size && item.quantity > 0).map(item => item.size);

  const handleSizeSelect = (product, size) => {
    const bagItem = getBagProductData(product, size);
    addToBagAndSync(bagItem, dispatch, isLoggedIn);
  };

  // Replace with actual related products logic
  const moreProducts = items?.filter(item => item._id !== product._id);

  const openSizeChartModal = () => { setShowSizeChartModal(true) }
  const closeSizeChartModal = () => { setShowSizeChartModal(false) }

  return (
    <section className="bg-white text-dark px-6 sm:px-6 md:px-28 pt-20 pb-6 md:pt-26 md:pb-8">
      <article className="grid grid-cols-1 md:grid-cols-2 md:gap-x-15">

        <div className="grid grid-cols-1 gap-6 md:gap-y-15">
          {images.length > 0 && images.map((src, index) => (
            <figure key={index} className="overflow-hidden aspect-[2/3] bg-surface">
              {/* <img
                src={src}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover"
              /> */}

              <ResponsiveImage
                source={src}
                alt={`${title} – ${index + 1}`}
                className="w-full h-full object-cover"
                variants={["phone", "listing", "desktop"]} // include multiple responsive sizes
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
                defaultVariant="listing"
              />
            </figure>

          ))}

        </div>

        {/* Price, add to cart and other details */}
        <div className="mt-6 md:mt-28 md:px-6">

          {/* for larger screens only  */}
          <div className="hidden bg-light py-4 md:block mb-6">
            <div>
              <p className="text-base font-light uppercase">{title}</p>

              {/* Price */}
              <div className="mt-3 flex items-baseline space-x-2">
                {originalPrice !== effectivePrice ? (
                  <>
                    <span className="text-dark text-xxs xxs:text-sm font-light uppercase line-through">
                      ₹ {originalPrice?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-dark bg-accent px-1 text-xxs xxs:text-sm font-light uppercase">
                      ₹ {effectivePrice?.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </>
                ) : (
                  <span className="text-dark text-xxs xxs:text-sm font-light uppercase">
                    ₹ {effectivePrice?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}

                <button onClick={openSizeChartModal} className="ms-auto font-light uppercase text-xs underline text-subtext enabled:cursor-pointer">size chart</button>
              </div>
              <p className="mt-2 text-xs font-light text-border uppercase">MRP incl. of all taxes</p>
            </div>

            {/* add to bag button */}
            <SizeSelectMenu
              availableSizes={availableSizes}
              onChange={(size) => { handleSizeSelect(product, size) }}
            >
              <button className="text-dark block border border-border uppercase mt-4 md:mt-8 px-6 py-2 md:py-3 w-full text-sm font-medium enabled:cursor-pointer">
                Add to bag
              </button>
            </SizeSelectMenu>

          </div>

          <ul className="text-subtext font-light text-sm mb-6">{description?.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}</ul>
          <DescriptionAndCare description={story} />
        </div>

        {/* Sticky bottm bar on mobile, static on md+ */}
        <div className="sticky bottom-0 z-20 bg-light py-4 mt-4 md:hidden">
          <div>
            <p className="text-sm font-light uppercase">{title}</p>

            {/* Price */}
            <div className="mt-2 flex items-baseline space-x-2">
              {originalPrice !== effectivePrice ? (
                <>
                  <span className="text-dark text-xxs xxs:text-xs font-light uppercase line-through">
                    ₹ {originalPrice?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-dark bg-accent px-1 text-xxs xxs:text-xs font-light uppercase">
                    ₹ {effectivePrice?.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </>
              ) : (
                <span className="text-dark text-xxs xxs:text-xs font-light uppercase">
                  ₹ {effectivePrice?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}

              <button onClick={openSizeChartModal} className="ms-auto font-light uppercase text-xxs underline text-subtext">size chart</button>
            </div>
            <p className="mt-1.5 text-xxs font-light text-border uppercase">MRP incl. of all taxes</p>
          </div>
          <button className="bg-black text-white uppercase mt-4 px-6 py-2 w-full text-sm font-medium">
            Add to bag
          </button>
        </div>
      </article>

      {/* Related Products */}
      <div className="mt-15">
        <RelatedProducts products={moreProducts} title={'You May Also Like'} />
      </div>

      {/* size chart modal */}
      {showSizeChartModal && <SizeChartModal onClose={closeSizeChartModal} />}
    </section>
  );
};

export default ProductView;
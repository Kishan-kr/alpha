import React from 'react'
import oversizedTshirt from '../../assets/ProductCategories/oversizedTshirt.png'
import printedTshirt from '../../assets/ProductCategories/printedTshirt.png'
import product3 from '../../assets/ProductCategories/product3.png'
import product4 from '../../assets/ProductCategories/product4.png'
import { Link } from 'react-router-dom'
import SizeSelectMenu from '../common/SizeSelector'
import { addToBagAndSync } from '../../utils/bagSync'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { toggleLogin } from "../../store/slices/userSlice";

// dummy data
const products = [
  {
    "_id": "684f9d9e1055fb21a6ac6ba1",
    "title": "Denim Jacket",
    "categoryId": {
      "name": "Oversized Polo"
    },
    "images": [
      "https://picsum.photos/seed/prod1-65/500/800",
      "https://picsum.photos/seed/prod1-67/500/800"
    ],
    "thumbnail": product3,
    "originalPrice": 1999,
    "discountPrice": 1699,
    "sizes": [
      {
        "size": "M",
        "quantity": 4,
        "_id": "684f9d9e1055fb21a6ac6ba2"
      },
      {
        "size": "L",
        "quantity": 4,
        "_id": "684f9d9e1055fb21a6ac6ba3"
      },
      {
        "size": "XL",
        "quantity": 4,
        "_id": "684f9d9e1055fb21a6ac6ba4"
      }
    ],
    "colors": [
      "blue"
    ],
    "tags": [],
    "description": [
      "Timeless denim with modern cuts."
    ],
    "story": "Walk in style with this all-season denim jacket.",
    "adminId": {
      "_id": "6857d8e25700c4fde79cfdc2",
      "name": "Anuj",
      "email": "anuj@tashn.in",
      "role": "superAdmin",
      "__v": 0
    },
    "__v": 0,
    "createdAt": "2025-06-16T04:29:18.977Z",
    "updatedAt": "2025-06-16T04:29:18.977Z"
  },
  {
    "_id": "684f9d9e1055fb21a6ac6b9e",
    "title": "Hooded Sweatshirt",
    "categoryId": null,
    "images": [
      "https://picsum.photos/seed/prod1-73/500/800",
      "https://picsum.photos/seed/prod1-75/500/800"
    ],
    "thumbnail": product4,
    "originalPrice": 1599,
    "discountPrice": 1399,
    "sizes": [
      {
        "size": "L",
        "quantity": 6,
        "_id": "684f9d9e1055fb21a6ac6b9f"
      },
      {
        "size": "XL",
        "quantity": 5,
        "_id": "684f9d9e1055fb21a6ac6ba0"
      }
    ],
    "colors": [
      "navy"
    ],
    "tags": [
      "Oversized fit"
    ],
    "description": [
      "Warm fleece hoodie for cool weather."
    ],
    "story": "Comfort meets warmth in this classic hoodie.",
    "adminId": null,
    "__v": 0,
    "createdAt": "2025-06-16T04:29:18.977Z",
    "updatedAt": "2025-06-16T04:29:18.977Z"
  },
  {
    "_id": "684f9d9e1055fb21a6ac6b98",
    "title": "Classic Black Tee",
    "categoryId": {
      "name": "Oversized T-shirt"
    },
    "images": [
      "https://picsum.photos/seed/prod1-90/500/800",
      "https://picsum.photos/seed/prod1-91/500/800"
    ],
    "thumbnail": oversizedTshirt,
    "originalPrice": 999,
    "discountPrice": 799,
    "sizes": [
      {
        "size": "M",
        "quantity": 10,
        "_id": "684f9d9e1055fb21a6ac6b99"
      },
      {
        "size": "L",
        "quantity": 8,
        "_id": "684f9d9e1055fb21a6ac6b9a"
      }
    ],
    "colors": [
      "black"
    ],
    "tags": [
      "Oversized fit"
    ],
    "description": [
      "High-quality black cotton t-shirt"
    ],
    "story": "This black tee has a legacy of comfort and simplicity.",
    "adminId": null,
    "__v": 0,
    "createdAt": "2025-06-16T04:29:18.976Z",
    "updatedAt": "2025-06-16T04:29:18.976Z"
  },
  {
    "_id": "684f9d9e1055fb21a6ac6b9b",
    "title": "White Graphic Tee",
    "categoryId": null,
    "images": [
      "https://picsum.photos/seed/prod1-80/500/800",
      "https://picsum.photos/seed/prod1-81/500/800"
    ],
    "thumbnail": printedTshirt,
    "originalPrice": 899,
    "discountPrice": 699,
    "sizes": [
      {
        "size": "S",
        "quantity": 15,
        "_id": "684f9d9e1055fb21a6ac6b9c"
      },
      {
        "size": "M",
        "quantity": 10,
        "_id": "684f9d9e1055fb21a6ac6b9d"
      }
    ],
    "colors": [
      "white"
    ],
    "tags": [],
    "description": [
      "Artistic print for bold expression."
    ],
    "story": "Wear your thoughts with our expressive graphic tees.",
    "adminId": null,
    "__v": 0,
    "createdAt": "2025-06-16T04:29:18.976Z",
    "updatedAt": "2025-06-16T04:29:18.976Z"
  }
];

function LatestProducts({ scrollRef }) {
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
    <section ref={scrollRef} id='latest-product' style={{ scrollMarginTop: "0rem" }} className='bg-light w-full py-16 px-5 md:px-15 flex flex-col'>
      <div className='w-full flex items-center gap-4 relative mt-8'>
        <h3 className='text-xl md:text-2xl text-nowrap text-dark font-gfs-didot text-center uppercase'>New Arrivals</h3>
      </div>

      {/* products list  */}
      <ul
        className="flex flex-wrap items-center justify-between w-full gap-5 sm:gap-8 md:gap-15 my-8 md:my-10 snap-mandatory snap-y sm:snap-none"
      >
        {products.map(product => (
          <Product key={product._id} {...product} handleSizeSelect={handleSizeSelect} />
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

    </section>
  )
}

function Product({
  _id,
  thumbnail,
  title,
  discountedPrice,
  originalPrice,
  effectivePrice,
  tags,
  sizes,
  categoryId,
  handleSizeSelect
}) {

  const product = {
    productId: _id,
    thumbnail,
    title,
    discountedPrice,
    originalPrice,
    effectivePrice
  }

  const availableSizes = sizes?.map(item => item.size);

  return (
    <article
      className="h-full basis-52 mx-auto max-w-60 grow shrink flex flex-col"
    >
      {/* Product Image */}
      <Link
        to={`/product/${_id}`}
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
            to={`/product/${_id}`}
            className="text-dark text-xs font-light uppercase cursor-pointer hover:underline">
            {title}
          </Link>

          {/* Price */}
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-dark text-xs font-light uppercase line-through">
              ₹ {originalPrice?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-dark bg-accent px-1 text-xs font-light uppercase">
              ₹ {discountedPrice?.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
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
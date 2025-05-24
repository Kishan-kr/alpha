import { X } from 'lucide-react';
import React from 'react'

// function CheckoutProductCard({title, category, thumbnail, originalPrice, discountPrice, size, qty}) {
//   return (
//     <div className="flex items-center gap-4 mb-4">
//       <img src={thumbnail} alt="item" className="rounded" />
//       <div className="flex-1">
//         <div className="font-medium">{title}</div>
//         <div className="text-sm text-gray-400">{category} • {color}</div>
//           <div className="text-sm text-gray-400 mt-1">Qty <select className="bg-transparent border border-gray-700 rounded px-2 ml-2">
//             <option>1</option>
//             <option>2</option>
//           </select></div>
//       </div>
//       <div>$499.99</div>
//     </div>
//   )
// }

const CheckoutProductCard = ({ product, onRemove }) => (
  <div className="flex gap-4 items-center border border-border rounded-xl p-3 bg-muted text-light relative">
    <img src={product.thumbnail} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
    <div className="flex justify-between flex-grow">
      <div className=''>
        <h3 className="font-semibold text-base text-light">{product.title}</h3>
        <p className="text-sm text-subtext">{product.category} • {product.color}</p>
        <div className='flex gap-x-2'>
          <p className="text-xs text-light bg-surface w-fit rounded p-1 px-2 mt-1">
            <span className='text-subtext me-1'>Qty</span> {product.quantity}
          </p>
          <p className="text-xs text-light bg-surface w-fit rounded p-1 px-2 mt-1">
            {product.selectedSize}
          </p>
        </div>
      </div>
      <p className="text-light font-semibold self-end">${product.originalPrice.toFixed(2)}</p>
    </div>
    <button onClick={onRemove} className="absolute top-2 right-2 text-subtext hover:text-light">
      <X size={16} />
    </button>
  </div>
);

export default CheckoutProductCard
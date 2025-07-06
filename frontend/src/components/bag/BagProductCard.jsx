import { Trash2, Plus, Minus, X } from "lucide-react";
import React from "react";
import SizeSelector from "../common/SizeSelector";


const BagProductCard = ({ product, onIncrease, onDecrease, onRemove, onSizeChange }) => {
  return (
    <div className="relative flex sm:items-center justify-between last:border-none border-b border-border py-8 pt-4">
      <div className="flex items-center sm:items-start gap-4 w-full">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-24 h-28 sm:w-24 sm:h-28 aspect-[4/5] rounded-md object-cover"
        />
        <div>
          <h4 className="text-dark font-semibold uppercase tracking-wider">{product.title}</h4>

          {/* <p className="text-sm text-subtext my-2 mt-1">{product.category} • {product.color}</p> */}

          {/* caategory and color together on small screens only */}
          <p className="sm:hidden text-sm text-subtext my-2 mt-1">{product.category} • {product.color}</p>

          {/* caategory and color in lines on large screens only */}
          <p className="hidden sm:block text-sm text-subtext mt-1">{product.category}</p>
          <p className="hidden sm:block text-sm text-subtext my-2 mt-1">{product.color}</p>

          <div className="text-subtext text-sm w-fit items-center">
            <SizeSelector
              selectedSize={product.selectedSize}
              sizes={product.availableSizes}
              onChange={(size) => onSizeChange(product.id, size)}
            />
          </div>

          {/* price visible in small mobile screen only  */}
          <p className="sm:hidden text-dark font-semibold mt-2">₹{product.originalPrice}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:self-end">
        {/* price visible in medium and large screen only */}
        <p className="text-dark font-semibold hidden sm:block">₹{product.originalPrice}</p>

        <div className="flex flex-col-reverse w-9 sm:w-auto xs:scale-100 sm:scale-100 sm:flex-row items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => onDecrease(product.id)}
            className="px-3 py-2 text-dark enabled:hover:bg-border enabled:cursor-pointer"
          >
            <Minus size={16} />
          </button>
          <span className="px-3 py-1 text-dark">{product.quantity}</span>
          <button
            onClick={() => onIncrease(product.id)}
            className="px-3 py-2 text-dark enabled:hover:bg-border enabled:cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* delete button visible on medium and large screen only */}
        <button
          onClick={() => onRemove(product.id)}
          className="hidden sm:block p-1 text-red-500 hover:text-red-400 enabled:cursor-pointer"
        >
          <Trash2 size={18} />
        </button>

        {/* delete button visible on small screen only at top right corner */}
        <button
          onClick={() => onRemove(product.id)}
          className="absolute sm:hidden top-0 right-0 text-subtext hover:text-dark"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default BagProductCard;
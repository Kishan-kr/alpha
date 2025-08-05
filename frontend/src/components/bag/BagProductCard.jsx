import { Trash2, Plus, Minus, X } from "lucide-react";
import React from "react";
import SizeSelector from "../common/SizeSelector";


const BagProductCard = ({ product, onIncrease, onDecrease, onRemove }) => {
 
  return (
    <div className="relative flex sm:items-center justify-between">
      <div className="flex items-center sm:items-start gap-4 xxs:gap-6 md:gap-16 w-full">
        <figure className="w-48 min-w-36 md:min-w-44 md:w-44 overflow-hidden aspect-[2/3] bg-surface">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full object-cover"
          />
        </figure>

        <div className="py-4 md:py-0 font-light relative">
          <h4 title={product.title} className="text-dark uppercase font-light text-sm md:text-base max-w-48 md:max-w-fit md:pe-8 line-clamp-2">{product.title}</h4>
          {/* caategory and color together on small screens only */}
          <p className="text-xs text-subtext mt-3 uppercase">{product.category}</p>

          {/* size and color */}
          <p className="text-xs text-subtext mt-3 uppercase">{product.size} | {product.color}</p>

          {/* price */}
          <p className="text-dark text-base mt-8">₹ {product.originalPrice}</p>

          {/* quantity manager  */}
          <div className="bg-surface w-max flex items-center text-xs overflow-hidden mt-3">
            <button
              onClick={() => onDecrease(product)}
              disabled={product.quantity <= 1}
              className="px-2 py-1.5 text-subtext disabled:text-hover-tint enabled:hover:text-dark enabled:cursor-pointer"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 py-1 text-dark min-w-10 text-center">{product.quantity}</span>
            <button
              onClick={() => onIncrease(product)}
              className="px-2 py-1.5 text-subtext enabled:hover:text-dark enabled:cursor-pointer"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* delete button for small screens only  */}
          <button
            onClick={() => onRemove(product)}
            title="Remove"
            className="sm:hidden mt-4 text-xs block underline text-subtext hover:text-dark enabled:cursor-pointer"
          >Remove
          </button>

        </div>

        {/* delete button visible on medium and large screen only */}
        <button
          onClick={() => onRemove(product)}
          title="Remove"
          className="hidden sm:block absolute top-0 right-0 p-1 text-subtext hover:text-dark enabled:cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default BagProductCard;
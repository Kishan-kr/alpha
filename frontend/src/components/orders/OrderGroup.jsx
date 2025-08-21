import React from 'react';
import ProductCard from './OrderCard';
import { formatToRelativeDate } from '../../utils/dateFormatter';
import { orderStatusValues } from '../../constants/valueMaps';
import { productStatusBeforeStyles, productStatusBgStyles, productStatusStyles } from '../../constants/styleMaps';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function OrderGroup({ order }) {
  return (
    <div className="border border-light/20 bg-light shadow-sm">
      {/* Order Header */}
      <div className="flex justify-between items-start px-6 py-5 border-b border-light/20">
        <div>
          {/* Status */}
          <div className={`flex items-center gap-2 ${productStatusBgStyles[order.orderStatus]} px-3 py-1`}>
            <span className={`${productStatusBeforeStyles[order.orderStatus]} w-2 h-2 rounded-full`} />
            <span className={`text-sm font-medium ${productStatusStyles[order.orderStatus]}`}>
              {orderStatusValues[order.orderStatus]}
            </span>
          </div>

          <p className="mt-2 text-xs text-subtext">
            Placed on {formatToRelativeDate(order.createdAt)}
          </p>
        </div>

        <div className="text-xs">
          <span className="text-subtext">Order No:</span>{" "}
          <span className="font-medium">{order.orderNumber}</span>
        </div>
      </div>

      {/* Products */}
      <div className="px-6 py-5 divide-y divide-light/20">
        {order.products.map(product => (
          <div key={product._id} className="py-4 first:pt-0 last:pb-0">
            <ProductCard product={product} orderStatus={order.orderStatus} />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-light/20 text-right">
        <Link
          to={order._id}
          className="inline-flex items-center gap-1 text-sm font-medium text-dark hover:underline"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
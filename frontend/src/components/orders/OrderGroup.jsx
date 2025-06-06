import React from 'react';
import ProductCard from './OrderCard';
import { formatToRelativeDate } from '../../utils/dateFormatter';
import { orderStatusValues } from '../../constants/valueMaps';
import { productStatusBeforeStyles, productStatusBgStyles, productStatusStyles } from '../../constants/styleMaps';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function OrderGroup({ order }) {
  return (
    <div className="mb-8 rounded-xl p-4 bg-dark border border-light/10 shadow-sm">
      <div className='flex gap-3 justify-between'>
        <div>
          {/* status  */}
          <div className={`flex gap-2 items-center w-fit ${productStatusBgStyles[order.orderStatus]} px-4 rounded-full`}>
            <span className={`${productStatusBeforeStyles[order.orderStatus]} block w-2 h-2 rounded-full`}></span>
            <h3
              className={`text-lg font-semibold ${productStatusStyles[order.orderStatus] || 'text-subtext'}`}
            >{orderStatusValues[order.orderStatus]}</h3>
          </div>
          
          {/* placed on date  */}
          <p className="mt-1 ms-1 text-xs text-subtext font-medium mb-2"> Placed on {formatToRelativeDate(order.createdAt)}</p>
        </div>

        {/* order number  */}
        <span
          className={`py-1 h-fit text-xs font-medium`}
        >
          <span className='text-subtext me-1 font-normal'>Order No:</span>{order.orderNumber}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-4">
        {order.products.map(product => (
          <ProductCard key={product._id} product={product} orderStatus={order.orderStatus}/>
        ))}
      </div>

      {/* view details button  */}
      <Link to={order._id} className='mt-4 flex gap-1 items-center justify-center w-fit ms-auto p-2 px-4 text-dark bg-light rounded-md group'>
        View Details 
        <ChevronRight className='w-5 h-5 group-hover:translate-x-1 transition-transform'/>
      </Link>
    </div>
  );
}
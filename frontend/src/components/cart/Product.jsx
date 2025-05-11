import React, { useEffect } from 'react'
import sample from '../../assets/photos/cartSample.jpg'
import { Minus, Plus } from 'lucide-react'

function Product({product, updateQuantity, handleRemoveFromCart}) {
  const {id, title, price, image, quantity, size} = product;
  const [quantityValue, setQuantityValue] = React.useState(quantity);

  // effect to handle actual quantity change 
  useEffect(() => {
    setQuantityValue(quantity)
  }, [quantity])

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      return
    }
    updateQuantity(id, quantity - 1)
  }

  const increaseQuantity = () =>{
    updateQuantity(id, quantity + 1)
  }

  const handleQuantityChange = (e) => {
    const value = e.target.value;
  
    // Allow only digits
    const numericValue = value.replace(/\D/g, '');
  
    setQuantityValue(numericValue);
  };  

  const handleBlur = () => {
    // Convert to number safely or fallback to 1
    const quantity = parseInt(quantityValue, 10);
    updateQuantity(id, isNaN(quantity) || quantity <= 0 ? 1 : quantity);
  };

  return (
    <li className='flex gap-6'>
      <div className='shrink-0'>
        <img src={sample} alt="" className='w-32 object-cover'/>
      </div>
      <div className='flex flex-col gap-2 py-3 tracking-wider justify-center  flex-1 min-w-0'>
        <p title={title} className='font-semibold uppercase truncate whitespace-nowrap overflow-hidden'>{title}</p>
        <span className='text-base uppercase p-1 px-2 bg-gray-100 w-fit'>{size}</span>
        <span className='font-semibold text-base tracking-widest'>$ {price}</span>
        <div className='flex gap-3 mt-4'>
          <div className='border-2 rounded-b-xs border-gray-200 py-1 flex gap-0 items-center justify-center'>
            <button 
              disabled={quantity <= 1} 
              onClick={decreaseQuantity}
              className={`p-1 enabled:cursor-pointer disabled:text-gray-400`}>
              <Minus className='h-4 w-4'/>
            </button>

            <input 
              type="text" 
              min={1} 
              max={99} 
              value={quantityValue} 
              onChange={handleQuantityChange}
              onBlur={handleBlur}
              className='w-11 p-1 text-center outline-none' 
            />

            <button onClick={increaseQuantity} className='p-1 enabled:cursor-pointer'>
              <Plus  className='h-4 w-4'/>
            </button>
          </div>
          <button onClick={() => handleRemoveFromCart(id)} className='p-1 tracking-wide cursor-pointer uppercase underline text-red-800 text-sm font-light'>Remove</button>
        </div>
      </div>
    </li>
  )
}

export default Product
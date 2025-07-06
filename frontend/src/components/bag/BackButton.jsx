import { ChevronLeft } from 'lucide-react'
import React from 'react'

function BackButton({handleClick, className }) {
  return (
    <button onClick={handleClick} className={`text-subtext hover:text-dark hover:bg-surface p-2 h-fit rounded-full cursor-pointer ${className}`}>
      <ChevronLeft className='h-5 w-5'/>
    </button>
  )
}

export default BackButton
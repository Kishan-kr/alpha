import { LoaderCircle } from 'lucide-react'
import React from 'react'

function LoadingScreen() {
  return (
    <div className="flex justify-center py-24 mt-8">
      <p className='text-xs tracking-wider font-light uppercase animate-spin'><LoaderCircle /></p>
    </div>
  )
}

export default LoadingScreen;
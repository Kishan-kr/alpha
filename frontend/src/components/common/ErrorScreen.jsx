import React from 'react'

function ErrorScreen({error}) {
  return (
    <div className="flex justify-center py-24 mt-8">
      <p className="text-subtext text-center uppercase text-sm tracking-wide">{error}</p>
    </div>
  )
}

export default ErrorScreen;
import React from 'react'

function Statement() {
  return (
    <div className='text-black/80 p-3 py-24 flex flex-col items-center md:max-w-lg text-center mx-auto'>
      <h2 className='text-3xl font-bold text-[var("--color-black")] font-'>TASHN — Not Just Style. It’s a Statement.</h2>
      <p className='tracking-[0.1rem] my-6 uppercase'>At TASHN, we don’t just follow trends — we set them.</p>
      <p className='md:max-w-sm'>Born for the bold and built for the streets, our mission is to redefine men’s casualwear with fits that speak louder than words. Every thread carries attitude. Every drop delivers edge.
From sharp silhouettes to standout essentials, TASHN is made for those who walk with intent, dress with purpose, and never settle for basic.</p>
      <p className='italic text-lg border-2 border-dotted border-amber-600 text-[var("--color-black")] mt-6 p-1'>"You bring the vibe. We bring the fit. Together, we bring the TASHN."</p>
    </div>
  )
}

export default Statement
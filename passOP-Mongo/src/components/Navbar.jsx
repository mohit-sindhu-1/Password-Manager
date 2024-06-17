import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-black flex justify-around h-10 items-center text-white'>
      <div className='logo font-bold text-2xl'>
        <span className="text-cyan-400">&lt;</span>
        <span>Pass</span>
        <span className="text-cyan-400">OP/&gt;</span>

      </div>

      <button className='flex items-center gap-x-3 py-1 px-2 bg-cyan-500 rounded-full text-black'>
        <img className='w-7' src="/icons/github.svg" alt="github" />
        <a href="/https://github.com/mohit-sindhu-1/password-manager"><span className='font-bold'>GitHub</span></a>
      </button>
    </nav>
  )
}

export default Navbar

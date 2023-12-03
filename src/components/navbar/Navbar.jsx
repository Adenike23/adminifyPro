import React from 'react'
import logo from '../../assets/images/Membership.png'
const Navbar = () => {
  return (
    <div className='nav py-3 z-10 fixed w-[100%] flex gap-2 p-2 items-center bg-blue-600 md:py-2'>
        <img src={logo} alt="" className='w-[6%] md:w-[3%]'/>
        <a href="/" className='text-white'>ADMINIFYPRO</a>
    </div>
  )
}

export default Navbar
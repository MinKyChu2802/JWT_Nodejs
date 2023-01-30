import { NextPage } from 'next'
import Image from 'next/image'
import React from 'react'
import logo from 'assets/avatar.png'

const Header: NextPage = () => {
  return (
    <div className="Header bg-primary w-full flex justify-between items-center p-4 max-w-[1200px] m-auto top-0 left-0 right-0 fixed z-50">
      <div>
        <Image
          src={logo}
          alt=""
          width={160}
          height={160}
        />
      </div>

      <ul className="flex justify-between items-start gap-6 ">
        <li
          tabIndex={0}
          className="cursor-pointer focus:text-white hover:text-white transition-all duration-300  text-base active:text-white"
        >
          Home
        </li>
        <li
          tabIndex={1}
          className="cursor-pointer focus:text-white hover:text-white transition-all duration-300 text-base  active:text-white"
        >
          About
        </li>
        {/* <li>Services</li> */}
        <li
          tabIndex={2}
          className="cursor-pointer focus:text-white hover:text-white transition-all duration-300 text-base  active:text-white"
        >
          Blog
        </li>
      </ul>
    </div>
  )
}

export default Header

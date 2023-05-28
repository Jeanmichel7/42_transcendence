import React from 'react'
import { BiChevronLeftCircle } from "react-icons/bi"
import { useState, useRef, useEffect } from 'react'

function SideBar() {

  const [open, setOpen] = useState(false);
  let ref = useRef(document.createElement('div'));

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside)
    return () => document.removeEventListener('mousedown', ClickOutside)

  }, [ref])

  return (
    <div ref={ref} className={`border-4 z-50 border-[#0F4C75] shadow-inner shadow-gray-300 ${open ? "w-80" : "w-12 h-24"} duration-300 bg-[#1B262C] rounded-lg`} >

      <BiChevronLeftCircle className={`text-white text-4xl bg-black
        rounded-full absolute x-left-5 top-11 border-2 cursor-pointer
        ${open && "rotate-180"} duration-700`} onClick={() => setOpen(!open)}
      />

      <div className="items-center justify-center flex">
        <img src='/profile.png' width='120px' className="text-center p-2 rounded-full" />
      </div>

      <p className={` ${!open && "scale-0"} bg-[#3282B8] shadow rounded-lg shadow-gray-300 text-[#FDFFFC] font-Dance text-3xl p-2 m-2 text-center font-bold `} >Name</p>

      <div className={`${!open && "scale-0"} bg-[#3282B8] m-2 p-2 font-mono shadow rounded-lg shadow-gray-300 text-[#FDFFFC]`} >
        <p>Matchs played : </p>
        <p>Victories     : </p>
        <p>Victorie rate : </p>
      </div>

      <div className={`${!open && "scale-0"} m-8 text-center text-[#FDFFFC]`} >
        <p className="font-bold underline" >Match history</p>
      </div>


    </div>

  )
}

export default SideBar


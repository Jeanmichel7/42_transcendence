import { useState, useRef, useEffect } from 'react'
import { ImPencil, ImBlocked } from "react-icons/im";


const User = ({ name }: any) => (
  <div className="m-2 p-2 border rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex flex-row items-center text-left" >
    <div className=" pl-1 flex-grow " >
      {name}
    </div>
    <div className="relative group flex-shrink-0 flex items-center justify-center border-2 rounded-full p-1 mx-1 hover:bg-white transition-all" >
      <ImPencil className="m-1" />
      <div className="absolute group-hover:block text-center w-80 text-sm bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
        Send direct message to user.
      </div>
    </div>
    <div className="relative group flex-shrink-0 flex items-center justify-center border-2 rounded-full p-1 hover:bg-white transition-all" >
      <ImBlocked className="m-1" />
      <div className="absolute group-hover:block text-center w-40 bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
        Block user
      </div>
    </div>
  </div>
)


function ButtonUser() {
  const [open, setOpen] = useState(false);
  let ref = useRef(document.createElement('div'));

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside) };
  }, [ref])

  return (
    <>
      <div className={`text-center border-2 rounded-xl shadow-lg font-mono 
        p-3 cursor-pointer hover:bg-gray-100 transition-all
        ${open ? 'bg-gray-100' : ''}`} onClick={() => setOpen(!open)}
      >
        User
      </div>

      <div ref={ref} className={`absolute left-1/4 top-16 z-40 bg-white mt-5 m-10 p-2 border shadow-lg text-center w-3/12 rounded-xl
        ${open ? "" : "hidden"} transition-all`}
      >
        <User name="User 1" />
        <User name="User 2" />
      </div>
    </>
  )
}

export default ButtonUser
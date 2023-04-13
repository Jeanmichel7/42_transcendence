import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { BiPaperPlane } from "react-icons/bi";
import BarAdmin from './barAdmin';

const NewRoom = ({Name}:{Name:string}) => {

  const [open, setOpen] = useState(false);
  const inputRef:any = useRef();
  let ref = useRef(document.createElement('div'));

  const HandleSubmit = (e:any) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    inputRef.current.value="";
}

  useEffect(() => {

    const ClickOutside = (event:any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    
    document.addEventListener('mousedown', ClickOutside);
    return () => {document.removeEventListener('mousedown', ClickOutside)}
  }, [ref]);

  return (
    <div>
      <div className={` m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer ${ open ? 'bg-gray-100' : '' } `} onClick={() => setOpen(!open)}> {Name} </div>

      <div ref={ref} className= {` absolute left-1/3 top-0 h-full w-7/12 z-20 rounded-xl border-2 shadow-lg font-mono transition-all flex justify-center ${ open ? "" : " hidden  "} `}>
        <div className='w-full h-7 text-lg m-1'>
          {Name}
        </div>

        <BarAdmin />

        <form onSubmit={HandleSubmit} className=" absolute bg-gray-100 border rounded-xl shadow-md bottom-4 w-11/12 p-1  flex ">
          <input ref={inputRef} placeholder="Enter your text here ..." className=" border-2 border-zinc-500 text-center p-1 rounded-xl m-1 shadow-sm w-2/3 font-sans " type="text" />
          <button className='flex justify-center items-center'> <BiPaperPlane className=' text-2xl mx-2 text-zinc-500' /> </button>
        </form>
      </div>

    </div>
  )
}

function ChatRoom() {

  return (
    <div className=" bottom-1 m-2 my-5 text-center w-3/12 h-4/6 border-2 rounded-xl shadow-lg font-mono " >
        <div className="m-2" >
            Chat Room
        </div> 
          <NewRoom Name="User 1"/>
          <NewRoom Name="User 2"/>

        <div>
          
        </div>

    </div>
  )
}

export default ChatRoom;
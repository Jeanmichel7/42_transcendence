import axios from 'axios';
import {useState, useRef, useEffect} from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';

function ButtonUser({login}: {login:any}) {

  return (
    <button className=" m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer " >{login}</button> 
  )
}

function ButtonNewChannel({userData} : {userData:any}) {

    const [open, setOpen] = useState(false);
    let ref = useRef(document.createElement("div"))
    
    useEffect(() => {
      const ClickOutside = (event:any) => {
       if (!ref.current.contains(event.target))
        setOpen(false);
      }
      document.addEventListener('mousedown', ClickOutside)
      return () => {document.removeEventListener('mousedown', ClickOutside)};
    }, [ref]);

    const addUserList = userData.map((user: any) => (
      <ButtonUser key={user.id} login={user.login} />
    ));

    return (
          <div >
              <button className= {` absulte top-1 m-2 my-5  text-center w-3/12 py-2 border-2 shadow-lg rounded-xl font-mono cursor-pointer
                hover:bg-gray-100 transition-all ${ open ? 'bg-gray-100' : '' } `} onClick={() => setOpen(!open)} >
                New channel
              </button>
  
              <div ref={ref} className= {`absolute z-50 left-1/4 top-0 mt-5 m-10 p-2 border shadow-lg text-center w-3/12 rounded-xl bg-white ${ open ? "" : "hidden"} transition-all`}  >
                
                <h1 className=" m-2 font-bold ">Select user:</h1>
                <div className="bg-white flex flex-col overflow-auto h-44 border rounded shadow-sm">
                  {addUserList}
                </div>

                <div className=" bg-white border rounded mt-2 shadow-sm ">
                  <p className=" font-mono">Password: </p>
                  <input className="border rounded text-center m-1 shadow-sm " type="text" />
                </div>

                <div className=" bg-white border rounded mt-2 shadow-sm ">
                  <p className=" font-mono">Name: </p>
                  <input className="border rounded text-center m-1 shadow-sm " type="text" />
                </div>

                <button className=" bg-gray-100 border-2 rounded mt-2 shadow-sm hover:bg-white transition-all cursor-pointer" >
                  <p> Create </p>
                </button>
              </div>
  
            </div>
    )
  }
  export default ButtonNewChannel;
import {useState, useEffect} from 'react'

function ButtonNewChannel() {

    const [open, setOpen] = useState(false);

    return (
          <div >
  
              <div className="abosulte top-1 m-2 my-5  text-center w-3/12 py-2 border shadow-lg rounded-xl font-mono cursor-pointer
                hover:bg-gray-100 transition-all" 
                onClick={() => setOpen(!open)} >
                New channel
              </div>
  
              <span className= {`absolute left-1/4 top-0 mt-5 m-10 p-2 border shadow-lg text-center w-3/12 rounded-xl ${ open ? "opaccity-100" : "opacity-0"} transition-all`}  >
                
                <div className="bg-white border rounded shadow-sm">
                  <h1 className=" m-2 font-bold ">Select user:</h1>
                  <ul className=" m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer " >User 1</ul>
                  <ul className=" m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer " >User 2</ul>
                  <ul className=" m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer " >User 3</ul>
                </div>

                <div className=" bg-white border rounded mt-2 shadow-sm ">
                  <p className=" font-mono">Password: </p>
                  <input className="border rounded text-center m-1 shadow-sm " type="text" />
                </div>

                <div className=" bg-white border rounded mt-2 shadow-sm ">
                  <p className=" font-mono">Name: </p>
                  <input className="border rounded text-center m-1 shadow-sm " type="text" />
                </div>

                <div className=" bg-gray-100 border-2 rounded mt-2 shadow-sm hover:bg-white transition-all cursor-pointer">
                  <p> Create </p>
                </div>
              </span>
  
            </div>
             
    )
  }
  export default ButtonNewChannel;
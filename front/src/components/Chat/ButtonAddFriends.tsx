import {useState, useRef, useEffect} from 'react'
import { ImPencil, ImBlocked, ImUsers } from "react-icons/im";
import { NewRoom } from './ChatFriends';

function AddUser ({id, login}:{id: any, login: any}) {

  return (

    <div className="m-2 p-2 border rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex flex-row items-center text-left" >
              <div className=" pl-1 basis-8/12 " >
                {login}
              </div>

              {/* Il faudrait ajouter la fonction " onClick={() =>joinRoom1({id})} " pour creation de socket entre userid et {id} */}
              <button className="relative group basis-2/12 flex items-center justify-center border-2 rounded-full p-1 mx-1 hover:bg-white transition-all" >
                <ImUsers className="m-1" />
                <div className="absolute group-hover:block text-center w-44 text-xs bg-slate-800 text-white shadow-sm hidden -left-44 font-mono p-3 rounded-md transition-all">
                  Add Friend
                </div>
              </button>

              <div className="relative group basis-2/12 flex items-center justify-center border-2 rounded-full p-1 hover:bg-white transition-all" >
                <ImBlocked className="m-1" />
                <div className="absolute group-hover:block text-center w-40 text-xs bg-slate-800 text-white shadow-sm hidden -left-40 font-mono p-3 rounded-md transition-all">
                  Block user
                </div>
              </div>
          </div>

  )
}

function ButtonAddFriends({userData}: {userData: any}) {

  const [open, setOpen] = useState(false);
  const [print, setPrint] = useState(false);
  let ref = useRef(document.createElement('div'));

  useEffect( () => {
    const ClickOutside = (event:any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside)};
  }, [ref])

  const addUserList = userData.map((user: any) => (
    <AddUser key={user.id} id={user.id} login={user.login} />
));


  return (
    <div>
        <div className={` m-2 text-center w-3/12 border-2 rounded-xl shadow-lg font-mono py-2 cursor-pointer hover:bg-gray-100 transition-all ${ open ? 'bg-gray-100' : '' } `} onClick={() => setOpen(!open)}>
            Add friends 
        </div> 

        <div ref={ref} className= {`absolute overflow-auto h-1/4 w-5/12 left-1/4 bottom-24 z-40 bg-white mt-5 m-10 p-2 border shadow-lg text-center rounded-xl ${ open ? "" : " hidden"} transition-all`}  >
          {addUserList}
        </div>

    </div>
  )
}

export default ButtonAddFriends;
import { useState, useRef, useEffect } from 'react'
import { ImPencil, ImBlocked } from "react-icons/im";

import { getFriends, apiBlockUser } from '../../api/relation'

const Friend = (data: any) => {
  async function blockUser(userToBlock: any) {

    const res = await apiBlockUser(userToBlock);
    console.log("res bloc user : ", res)

  }

  return (
    <div>
      <div className="border rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex flex-row items-center text-left">
        <div className="flex-grow text-black m-2 p-2 "
          onClick={() => {
            if (data.currentChatUser !== data.data.login) {
              data.setCurrentChatUser(data.data)
              data.setOpen(false)
            }
          }}
        >
          {data.data.login}
        </div>
        {/* <div className="relative group flex-shrink-0 flex items-center justify-center border-2 rounded-full p-1 mx-1 hover:bg-white transition-all">
          <ImPencil className="m-1" />
          <div className="absolute group-hover:block text-center w-80 text-sm bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
            Send direct message to user.
          </div>
        </div> */}
        <div className="relative group flex-shrink-0 flex items-center justify-center border-2 rounded-full p-1 hover:bg-white transition-all m-2"
          onClick={ () => blockUser(data.data.id)} 
        >
          <ImBlocked className="m-1 text-red-600" />
          <div className="absolute group-hover:block text-center w-40 bg-slate-800 text-white shadow-sm hidden 
          left-14 font-mono p-3 rounded-md transition-all">
            Block user
          </div>
        </div>
      </div>
    </div>
  )
}


function Friends({ currentChatUser, setCurrentChatUser }: any) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  let ref = useRef(document.createElement('div'));

  async function fetchFriends() {
      const res = await getFriends();
      // console.log("res : ", res)
      setFriends(res);
  }

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside) };
  }, [ref])

  useEffect(() => {
    if (open) {
      fetchFriends();
    }
  }, [open]);

  return (
    <>
      <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
        hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <h2>Friends</h2>
        <div ref={ref} className={`w-full bg-white
          border shadow-lg text-center rounded-xl mt-5
          ${open ? "" : "hidden"} transition-all`}
        >
          {friends?.length === 0 && <p className="text-center">No friends yet</p>}
          {friends?.map((friend) => (
            <Friend
              key={friend.id}
              data={friend}
              currentChatUser={currentChatUser}
              setCurrentChatUser={setCurrentChatUser}
              setOpen={setOpen}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Friends
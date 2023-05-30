import { useState, useRef, useEffect } from 'react'
import { ImPencil, ImBlocked } from "react-icons/im";
import axios from 'axios'
import { getFriends, apiBlockUser, deleteFriend } from '../../api/relation'
import { Fade, IconButton, Tooltip, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Friend = (data: any) => {
  async function blockUser(userToBlock: any) {
    const res = await apiBlockUser(userToBlock);
    console.log("res bloc user : ", res)
  }

  async function handleRemoveFriend(e: any) {
    e.stopPropagation();
    const res = await deleteFriend(data.data.id);  
    console.log("res remove friend : ", res)
  }

  return (
    <div>
      <div className="border rounded-xl hover:bg-gray-100 transition-all cursor-pointer flex flex-row items-center text-left">
        <div className="flex-grow text-black m-2 p-2 flex items-center "
          onClick={() => {
            if (data.currentChatUser !== data.data.login) {
              data.setCurrentChatUser(data.data)
              data.setOpen(false)
              data.setServiceToCall('chat')
            }
          }}
        >
          <img
            className="w-10 h-10 rounded-full object-cover mr-2 "
            src={`http://localhost:3000/avatars/` + data.data.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "http://localhost:3000/avatars/defaultAvatar.png"
            }}
            alt="avatar"
          />
          {data.data.login}

        </div>
        {/* <div className="relative group flex-shrink-0 flex items-center justify-center border-2 rounded-full p-1 mx-1 hover:bg-white transition-all">
          <ImPencil className="m-1" />
          <div className="absolute group-hover:block text-center w-80 text-sm bg-slate-800 text-white shadow-sm hidden -top-14 font-mono p-3 rounded-md transition-all">
            Send direct message to user.
          </div>
        </div> */}
        <Tooltip 
          title="Remove Friend" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton onClick={(e) => handleRemoveFriend(e)} color='error'>
            <CloseIcon />
          </IconButton>
        </Tooltip>
        <div className="relative group flex-shrink-0 flex items-center justify-center border-2 rounded-full p-1 hover:bg-white transition-all m-2"
          onClick={() => blockUser(data.data.id)}
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


function Chats({ setServiceToCall, currentChatUser, setCurrentChatUser }: any) {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  let ref2 = useRef(document.createElement('div'));

  /* Get Data for Chat Room */
  async function getChat () {
    const response = await axios.get('http://localhost:3000/users/getRooms', {
      withCredentials: true,
    });
    return response.data;
  }
 async function fetchChat() {
    let userProfileData = await getChat();
    setChat(userProfileData);
  }
 useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref2.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside) };
  }, [ref2])

  return (
    <>
      <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
        hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <h2>Chat Rooms</h2>
        <div ref={ref2} className={`w-full bg-white
          border shadow-lg text-center rounded-xl mt-5
          ${open ? "" : "hidden"} transition-all`}
        >

          {console.log('ICI', chat)}
          {chat?.length === 0 && <p className="text-center">No chat yet</p>}
          {chat?.map((friend: any) => (
            <Friend
              key={friend.id}
              data={friend}
              currentChatUser={currentChatUser}
              setCurrentChatUser={setCurrentChatUser}
              setOpen={setOpen}
              setServiceToCall={setServiceToCall}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Chats
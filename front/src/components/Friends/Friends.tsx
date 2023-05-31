import { useState, useRef, useEffect } from 'react'
import { ImPencil, ImBlocked } from "react-icons/im";

import { getFriends, apiBlockUser, deleteFriend } from '../../api/relation'
import { Fade, IconButton, Tooltip, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLogged, reduxAddFriends, reduxRemoveFriends, reduxAddUserBlocked } from '../../store/userSlice'


const Friend = ({
  userFriend,
  currentChatUser,
  setCurrentChatUser,
  setOpen,
  setServiceToCall
  }: {
    userFriend: any,
    currentChatUser: any,
    setCurrentChatUser: any,
    setOpen: any,
    setServiceToCall: any
  }) => {
  const dispatch = useDispatch()

  async function handleBlockUser(userToBlock: any, e: any) {
    e.stopPropagation();
    const res = await apiBlockUser(userToBlock);
    if(res.error)
      console.log("error bloc user : ", res.error)
    else {
      dispatch(reduxAddUserBlocked(userFriend))
    }
    console.log("res bloc user : ", res)
  }


  // si c'est l'user actif, revenr à la page d'accueil
  async function handleRemoveFriend(e: any) {
    e.stopPropagation();
    const res = await deleteFriend(userFriend.id);
    if(res.error)
      console.log("error remove friend : ", res.error)
    else {
      dispatch(reduxRemoveFriends(userFriend.id))
      console.log("currentChatUser : ", currentChatUser)
      console.log("userFriend.login : ", userFriend.login)
      if (currentChatUser.login === userFriend.login) {
        setCurrentChatUser("")
        setServiceToCall('home')
      }
    }
    console.log("res remove friend : ", res)
  }

  return (
    <div>
      <div className="border rounded-xl hover:bg-gray-100 transition-all 
      cursor-pointer flex flex-row items-center text-left">
        <div className="flex-grow text-black m-2 p-2 flex items-center "
          onClick={() => {
            if (currentChatUser !== userFriend.login) {
              setCurrentChatUser(userFriend)
              setOpen(false)
              setServiceToCall('chat')
            }
          }}
        >
          <img
            className="w-10 h-10 rounded-full object-cover mr-2 "
            src={`http://localhost:3000/avatars/` + userFriend.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "http://localhost:3000/avatars/defaultAvatar.png"
            }}
            alt="avatar"
          />
          {userFriend.login}
        </div>

        <Tooltip 
          title="Remove Friend" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton onClick={(e) => handleRemoveFriend(e)} color='error'>
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Block User" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton onClick={(e) => handleBlockUser(userFriend.id, e)} color='error'>
            <ImBlocked />
          </IconButton>
        </Tooltip>

      </div>
    </div>
  )
}


function Friends({ setServiceToCall, currentChatUser, setCurrentChatUser }: any) {
  const [open, setOpen] = useState(false);
  const userData: any = useSelector((state: any) => state.user.userData);
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
      <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
        hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <h2>Friends</h2>
        <div ref={ref} className={`w-full bg-white
          border shadow-lg text-center rounded-xl mt-5
          ${open ? "" : "hidden"} transition-all`}
        >
          {userData.friends.length === 0 ? <p className="text-center">No friends yet</p>
          :
          userData.friends.map((friend: { id: number; }) => {
            if (userData.id !== friend.id )
              return (
                <Friend
                  key={friend.id}
                  userFriend={friend}
                  currentChatUser={currentChatUser}
                  setCurrentChatUser={setCurrentChatUser}
                  setOpen={setOpen}
                  setServiceToCall={setServiceToCall}
                />
          ) })}
        </div>
      </div>
    </>
  )
}

export default Friends
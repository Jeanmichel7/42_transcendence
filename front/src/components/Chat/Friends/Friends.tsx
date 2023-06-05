import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxRemoveFriends, reduxAddUserBlocked } from '../../../store/userSlice';
import { apiBlockUser, deleteFriend } from '../../../api/relation';

import { ImBlocked } from 'react-icons/im';
import { IconButton, Tooltip, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '../../../store';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../../types';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';


export function FriendRow({
  userFriend,
  currentChatUser,
  setCurrentChatUser,
  setOpen,
  setServiceToCall,
}: {
  userFriend: UserInterface,
  currentChatUser: UserInterface,
  setCurrentChatUser: React.Dispatch<React.SetStateAction<UserInterface>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setServiceToCall: React.Dispatch<React.SetStateAction<string>>
}) {
  const dispatch = useDispatch();

  async function handleBlockUser(
    userToBlock: UserInterface,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    e.stopPropagation();
    const res: UserRelation | ApiErrorResponse = await apiBlockUser(userToBlock.id);
    if ('error' in res) {
      dispatch(setErrorSnackbar('Error block user: ' + res.error));
    } else {
      dispatch(reduxAddUserBlocked(userToBlock));
      dispatch(setMsgSnackbar('User blocked'));
    }
  }


  async function handleRemoveFriend(
    userToRemove: UserInterface,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    e.stopPropagation();
    const res: void | ApiErrorResponse = await deleteFriend(userToRemove.id);
    if (typeof res === 'object' && 'error' in res) {
      dispatch(setErrorSnackbar('Error delete friends: ' + res.error));
    } else {
      dispatch(reduxRemoveFriends(userToRemove));
      dispatch(setMsgSnackbar('Friend deleted'));

      //return home if currentChatUser is the user removed
      if (currentChatUser.login === userToRemove.login) {
        setCurrentChatUser({} as UserInterface);
        setServiceToCall('home');
      }
    }
  }

  return (
    <div>
      <div className="border rounded-xl hover:bg-gray-100 transition-all 
      cursor-pointer flex flex-row items-center text-left">
        <div className="flex-grow text-black m-2 p-2 flex items-center "
          onClick={() => {
            setCurrentChatUser(userFriend);
            setOpen(false);
            setServiceToCall('chat');
          }}
        >
          <img
            className="w-10 h-10 rounded-full object-cover mr-2 "
            src={'http://localhost:3000/avatars/' + userFriend.avatar}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
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
          <IconButton onClick={(e) => handleRemoveFriend(userFriend, e)} color='error'>
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Block User" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton onClick={(e) => handleBlockUser(userFriend, e)} color='error'>
            <ImBlocked />
          </IconButton>
        </Tooltip>

      </div>
    </div>
  );
}













function Friends({ setServiceToCall, currentChatUser, setCurrentChatUser }:
{ setServiceToCall: React.Dispatch<React.SetStateAction<string>> } &
{ currentChatUser: UserInterface } &
{ setCurrentChatUser: React.Dispatch<React.SetStateAction<UserInterface>> },
) {
  const { userData } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef(document.createElement('div'));

  useEffect(() => {
    const ClickOutside = (event: MouseEvent) => {
      // console.log('click outside', event.target);
      event.stopPropagation();
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside); };
  }, [ref]);

  return (
    <>
        <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
      hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <h2>Friends</h2>
          { open && userData && userData.friends &&
          <div ref={ref} className={`w-full bg-white border shadow-lg text-center rounded-xl mt-5
          ${open ? '' : 'hidden'} transition-all`}
          >
            {userData.friends.length === 0 ? 
              <p className="text-center">No friends yet</p>
              :
              userData.friends.map((friend: UserInterface) => {
                if (userData.id !== friend.id)
                  return (
                    <FriendRow
                      key={friend.id}
                      userFriend={friend}
                      currentChatUser={currentChatUser}
                      setCurrentChatUser={setCurrentChatUser}
                      setOpen={setOpen}
                      setServiceToCall={setServiceToCall}
                    />
                  );
              })}
          </div>
          }
        </div>
    </>
  );
}

export default Friends;
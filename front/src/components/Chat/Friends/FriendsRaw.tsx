import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reduxRemoveFriends } from '../../../store/userSlice';
import {  deleteFriend } from '../../../api/relation';

// import { ImBlocked } from 'react-icons/im';
import { Badge, IconButton, Tooltip, Typography, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '../../../store';
import { ApiErrorResponse, UserInterface } from '../../../types';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';


export function FriendRow({
  userFriend,
  currentChatUserId,
  setCurrentChatUserId,
  setOpen,
  setServiceToCall,
}: {
  userFriend: UserInterface,
  currentChatUserId: number,
  setCurrentChatUserId: React.Dispatch<React.SetStateAction<number>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setServiceToCall: React.Dispatch<React.SetStateAction<string>>
}) {
  const dispatch = useDispatch();

  // async function handleBlockUser(
  //   userToBlock: UserInterface,
  //   e: React.MouseEvent<HTMLButtonElement>,
  // ) {
  //   e.stopPropagation();
  //   const res: UserRelation | ApiErrorResponse = await apiBlockUser(userToBlock.id);
  //   if ('error' in res) {
  //     dispatch(setErrorSnackbar('Error block user: ' + res.error));
  //   } else {
  //     dispatch(reduxAddUserBlocked(userToBlock));
  //     dispatch(setMsgSnackbar('User blocked'));
  //   }
  // }


  async function handleRemoveFriend(
    userToRemove: UserInterface,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    e.stopPropagation();
    const res: void | ApiErrorResponse = await deleteFriend(userToRemove.id);
    if (typeof res === 'object' && 'error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(reduxRemoveFriends(userToRemove));
      dispatch(setMsgSnackbar('Friend deleted'));

      //return home if currentChatUserId is the user removed
      if (currentChatUserId === userToRemove.id) {
        setCurrentChatUserId(-1);
        setServiceToCall('home');
      }
    }
  }

  return (
    <div>
      <div className="border hover:bg-gray-100 transition-all 
      cursor-pointer flex flex-row items-center text-left">
        <div className="flex flex-grow text-black m-2 items-center "
          onClick={() => {
            setCurrentChatUserId(userFriend.id);
            setOpen(false);
            setServiceToCall('chat');
          }}
        >
          <Badge
            color={ 
              userFriend.status === 'online' ? 'success' :
                userFriend.status === 'absent' ? 'warning' :
                  'error' 
            }
            overlap="circular"
            badgeContent=" "
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{ '.MuiBadge-badge': { transform: 'scale(1.2) translate(-25%, 25%)' } }}
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
          </Badge>
          <Typography component="span"
            sx={{ 
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
              color: userFriend.status === 'online' ? 'success' : 'error',
            }}
            title={userFriend.login}
          >
            {userFriend.login.length > 15 ? userFriend.login.slice(0, 12) + '...' : userFriend.login}
          </Typography>
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

        {/* <Tooltip
          title="Block User" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton onClick={(e) => handleBlockUser(userFriend, e)} color='error'>
            <ImBlocked />
          </IconButton>
        </Tooltip> */}

      </div>
    </div>
  );
}













function Friends({ setServiceToCall, currentChatUserId, setCurrentChatUserId }:
{ setServiceToCall: React.Dispatch<React.SetStateAction<string>> } &
{ currentChatUserId: number } &
{ setCurrentChatUserId: React.Dispatch<React.SetStateAction<number>> },
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
      <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono cursor-pointer 
      hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <h2 className='p-3'>Friends</h2>
        {open && userData && userData.friends &&
          <div ref={ref} className={
            `w-full bg-white border shadow-lg text-center rounded-xl
            ${open ? '' : 'hidden'} 
            transition-all overflow-auto max-h-[calc(100vh-520px)]`}
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
                      currentChatUserId={currentChatUserId}
                      setCurrentChatUserId={setCurrentChatUserId}
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
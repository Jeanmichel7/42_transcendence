import { Link } from 'react-router-dom';
import { ApiErrorResponse, RoomInterface, UserInterface } from '../../../../types';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import { Badge, Typography, Tooltip, Zoom, IconButton } from '@mui/material';
import VolumeOffSharpIcon from '@mui/icons-material/VolumeOffSharp';
import VolumeMuteSharpIcon from '@mui/icons-material/VolumeMuteSharp';

import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import { setErrorSnackbar, setMsgSnackbar } from '../../../../store/snackbarSlice';

import { banUser, kickUser, muteUser, unBanUser, unMuteUser } from '../../../../api/chat';
import { PayloadAction } from '@reduxjs/toolkit';

interface UserCardProps {
  user: UserInterface;
  room: RoomInterface;
}

const AdminUserCard: React.FC<UserCardProps> = ({ user, room }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const isOwner = room?.ownerUser?.id === user.id;
  const isAdmin = room?.admins?.some((u) => u.id === user.id);
  const [isMuted, setIsMuted] = useState(room?.mutedUsers?.some((u) => u.id === user.id));
  const [isBanned, setIsBanned] = useState(room?.bannedUsers?.some((u) => u.id === user.id));



  const handleMuteUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)
  : Promise< void | PayloadAction<string> > => {
    e.stopPropagation();
    e.preventDefault();
    if (isOwner || isAdmin) return dispatch(setErrorSnackbar('You can\'t mute an admin or owner'));
    if (isMuted) return dispatch(setErrorSnackbar('User already muted'));

    const result: RoomInterface | ApiErrorResponse = await muteUser(room.id, user.id, 20); //20sec
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      setIsMuted(true);
      dispatch(setMsgSnackbar('User muted'));
    }
  };



  const handleUnMuteUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)
  : Promise< void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();
    if (isOwner || isAdmin) return dispatch(setErrorSnackbar('You can\'t unmute an admin or owner'));
    if (!isMuted) return dispatch(setErrorSnackbar('User not muted'));

    const result: RoomInterface | ApiErrorResponse = await unMuteUser(room.id, user.id);
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      setIsMuted(false);
      dispatch(setMsgSnackbar('User unmuted'));
    }
  };







  const handleKickuser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)
  : Promise< void | PayloadAction<string> > => {
    e.stopPropagation();
    e.preventDefault();

    if (isOwner) return dispatch(setErrorSnackbar('You can\'t kick the owner'));
    if (isAdmin) return dispatch(setErrorSnackbar('You can\'t kick an admin'));

    const result: RoomInterface | ApiErrorResponse = await kickUser(room.id, user.id);
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      // modif user list room ?
      dispatch(setMsgSnackbar('User kicked'));
    }
  };

  const handleBanUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)
  : Promise< void | PayloadAction<string> > => {
    e.stopPropagation();
    e.preventDefault();

    if (isOwner) return dispatch(setErrorSnackbar('You can\'t ban the owner'));
    if (isAdmin) return dispatch(setErrorSnackbar('You can\'t ban an admin'));
    if (isBanned) return dispatch(setErrorSnackbar('User already banned'));

    const result: RoomInterface | ApiErrorResponse = await banUser(room.id, user.id);
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      setIsBanned(true);
      // update room list user ? room.user ok mais room.bannedUsers ?
      dispatch(setMsgSnackbar('User banned'));
    }
  };

  const handleUnbanUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)
  : Promise< void | PayloadAction<string> > => {
    e.stopPropagation();
    e.preventDefault();

    if (isOwner) return dispatch(setErrorSnackbar('You can\'t unban the owner'));
    if (isAdmin) return dispatch(setErrorSnackbar('You can\'t unban an admin'));
    if (!isBanned) return dispatch(setErrorSnackbar('User not banned'));

    const result: RoomInterface | ApiErrorResponse = await unBanUser(room.id, user.id);
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    }  else {
      setIsBanned(false);
      // update room list user ? room.user ok mais room.bannedUsers ?
      dispatch(setMsgSnackbar('User unbanned'));
    }
  };








  return (
    <div>
      <div className="border hover:bg-gray-100 transition-all 
        cursor-pointer flex flex-row items-center text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={'/profile/' + user.login}
          className="flex flex-grow text-black p-1 pl-2 items-center ">
          <Badge
            color={
              user.status === 'online' ? 'success' :
                user.status === 'absent' ? 'warning' :
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
              src={'http://localhost:3000/avatars/' + user.avatar}
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
              color: user.status === 'online' ? 'success' : 'error',
            }}
            title={user.login}
          >
            {user.login.length > 15 ? user.login.slice(0, 12) + '...' : user.login}
          </Typography>
        </Link>

        {/* Mute user limited time*/}
        {!isMuted ?
          <Tooltip
            title="Mute" arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleMuteUser} color='warning'
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
            >
              <VolumeOffSharpIcon color='primary'/>
            </IconButton>
          </Tooltip>
          :
          < Tooltip
            title="Unmute" arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleUnMuteUser} color='warning'
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
            >
              <VolumeMuteSharpIcon color='secondary' />
            </IconButton>
          </Tooltip>
        }

        {/* Kick user */}
        <Tooltip
          title="Kick" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton
            onClick={handleKickuser} color='warning'
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
          >
            <ExitToAppSharpIcon color='warning' />
          </IconButton>
        </Tooltip>


        {/* Ban user */}
        {!isBanned ?
          <Tooltip
            title="Ban" arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleBanUser} color='warning'
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
            >
              <RemoveCircleSharpIcon color='error' />
            </IconButton>
          </Tooltip>
          :
          < Tooltip
            title="UnBan" arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleUnbanUser} color='warning'
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
            >
              <RemoveCircleOutlineSharpIcon color='error' />
            </IconButton>
          </Tooltip>
        }


        {/* Remove Admin */}

      </div>
    </div >
  );
};

export default AdminUserCard;
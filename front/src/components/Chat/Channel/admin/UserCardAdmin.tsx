import { Link } from 'react-router-dom';
import {
  ApiErrorResponse,
  RoomInterface,
  UserInterface,
} from '../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Badge, Typography, Tooltip, Zoom, IconButton } from '@mui/material';
import VolumeOffSharpIcon from '@mui/icons-material/VolumeOffSharp';
import VolumeMuteSharpIcon from '@mui/icons-material/VolumeMuteSharp';

import ExitToAppSharpIcon from '@mui/icons-material/ExitToAppSharp';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';

import {
  setErrorSnackbar,
  setMsgSnackbar,
  setPersonalizedErrorSnackbar,
} from '../../../../store/snackbarSlice';

import {
  addAdminToRoom,
  banUser,
  kickUser,
  muteUser,
  removeAdminFromRoom,
  unBanUser,
  unMuteUser,
} from '../../../../api/chat';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../../store';

interface UserCardProps {
  user: UserInterface;
  room: RoomInterface;
}

const AdminUserCard: React.FC<UserCardProps> = ({ user, room }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ImIOwner, setImIOwner] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isBanned, setIsBanned] = useState<boolean>(true);
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user || !room) return;
    if (room.bannedUsers)
      setIsBanned(room.bannedUsers?.some(u => u.id === user.id));
    if (room.ownerUser) setIsOwner(room.ownerUser.id === user.id);
    if (room.admins) setIsAdmin(room.admins.some(u => u.id === user.id));
    if (room.mutedUsers)
      setIsMuted(room.mutedUsers.some(u => u.id === user.id));
  }, [room, room.ownerUser, room.admins, room.users, user, userData.id]);

  useEffect(() => {
    if (userData.id && room.ownerUser)
      setImIOwner(room.ownerUser.id === userData.id);
  }, [userData.id, room.ownerUser]);

  const handleMuteUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();
    if (isOwner || isAdmin)
      return dispatch(
        setPersonalizedErrorSnackbar("You can't mute an admin or owner"),
      );
    if (isMuted)
      return dispatch(setPersonalizedErrorSnackbar('User already muted'));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await muteUser(
      room.id,
      user.id,
      20,
    ); //20sec
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      setIsMuted(true);
      dispatch(setMsgSnackbar('User muted'));
    }
    setIsLoading(false);
  };

  const handleUnMuteUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();
    if (isOwner || isAdmin)
      return dispatch(
        setPersonalizedErrorSnackbar("You can't unmute an admin or owner"),
      );
    if (!isMuted)
      return dispatch(setPersonalizedErrorSnackbar('User not muted'));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await unMuteUser(
      room.id,
      user.id,
    );
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      setIsMuted(false);
      dispatch(setMsgSnackbar('User unmuted'));
    }
    setIsLoading(false);
  };

  const handleKickuser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();
    if (isOwner)
      return dispatch(setPersonalizedErrorSnackbar("You can't kick the owner"));
    if (isAdmin)
      return dispatch(setPersonalizedErrorSnackbar("You can't kick an admin"));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await kickUser(
      room.id,
      user.id,
    );
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      dispatch(setMsgSnackbar('User kicked'));
    }
    setIsLoading(false);
  };

  const handleBanUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();

    if (isOwner)
      return dispatch(setPersonalizedErrorSnackbar("You can't ban the owner"));
    if (isAdmin)
      return dispatch(setPersonalizedErrorSnackbar("You can't ban an admin"));
    if (isBanned)
      return dispatch(setPersonalizedErrorSnackbar('User already banned'));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await banUser(
      room.id,
      user.id,
    );
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      setIsBanned(true);
      dispatch(setMsgSnackbar('User banned'));
    }
    setIsLoading(false);
  };

  const handleUnbanUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();

    if (isOwner)
      return dispatch(
        setPersonalizedErrorSnackbar("You can't unban the owner"),
      );
    if (isAdmin)
      return dispatch(setPersonalizedErrorSnackbar("You can't unban an admin"));
    if (!isBanned)
      return dispatch(setPersonalizedErrorSnackbar('User not banned'));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await unBanUser(
      room.id,
      user.id,
    );
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      setIsBanned(false);
      dispatch(setMsgSnackbar('User unbanned'));
    }
    setIsLoading(false);
  };

  const handleAddAdmin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();

    if (isBanned)
      return dispatch(
        setPersonalizedErrorSnackbar("You can't add admin to a banned user"),
      );
    if (isOwner)
      return dispatch(
        setPersonalizedErrorSnackbar("You can't add admin to the owner"),
      );
    if (isAdmin)
      return dispatch(setPersonalizedErrorSnackbar('User already admin'));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await addAdminToRoom(
      room.id,
      user.id,
    );
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      setIsAdmin(true);
      dispatch(setMsgSnackbar('User admin added'));
    }
    setIsLoading(false);
  };

  const handleRemoveAdmin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void | PayloadAction<string>> => {
    e.stopPropagation();
    e.preventDefault();

    if (isOwner)
      return dispatch(
        setPersonalizedErrorSnackbar("You can't remove admin to the owner"),
      );
    if (!isAdmin)
      return dispatch(setPersonalizedErrorSnackbar('User not admin'));

    setIsLoading(true);
    const result: RoomInterface | ApiErrorResponse = await removeAdminFromRoom(
      room.id,
      user.id,
    );
    if ('error' in result) {
      dispatch(setErrorSnackbar(result));
    } else {
      setIsAdmin(false);
      dispatch(setMsgSnackbar('User admin removed'));
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div
        className="border hover:bg-gray-100 transition-all 
        cursor-pointer flex flex-row items-center text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={'/profile/' + user.login}
          className="flex flex-grow text-black p-1 pl-2 items-center "
        >
          <Badge
            color={
              user.status === 'online'
                ? 'success'
                : user.status === 'absent'
                ? 'warning'
                : user.status === 'inactive'
                ? 'secondary'
                : user.status === 'in game'
                ? 'info'
                : 'error'
            }
            overlap="circular"
            badgeContent=" "
            variant="dot"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            sx={{
              '.MuiBadge-badge': {
                transform: 'scale(1.2) translate(-25%, 25%)',
              },
            }}
          >
            <Badge
              overlap="circular"
              variant="dot"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              sx={{
                '.MuiBadge-badge': {
                  transform: 'scale(1.6) translate(-5%, 32%)',
                  backgroundColor: 'white',
                },
              }}
            >
              <img
                className="w-10 h-10 rounded-full object-cover mr-2 "
                src={user.avatar}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    'http://localhost:3000/avatars/defaultAvatar.png';
                }}
                alt="avatar"
              />
            </Badge>
          </Badge>
          <Typography
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              color: user.status === 'online' ? 'success' : 'error',
            }}
            title={user.login}
          >
            {user.login.length > 15
              ? user.login.slice(0, 12) + '...'
              : user.login}
          </Typography>
        </Link>

        {/* Add admin */}
        {ImIOwner && !isOwner && !isAdmin && (
          <Tooltip
            title="Add admin"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleAddAdmin}
              color="primary"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
              disabled={isLoading}
            >
              <AddCircleOutlineSharpIcon color="success" />
            </IconButton>
          </Tooltip>
        )}

        {/* Remove admin */}
        {ImIOwner && !isOwner && isAdmin && (
          <Tooltip
            title="Remove admin"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleRemoveAdmin}
              color="warning"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
              disabled={isLoading}
            >
              <RemoveCircleOutlineSharpIcon color="error" />
            </IconButton>
          </Tooltip>
        )}

        {/* Mute user limited time*/}
        {!isMuted ? (
          <Tooltip
            title="Mute"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleMuteUser}
              color="warning"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
              disabled={isLoading}
            >
              <VolumeOffSharpIcon color="primary" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip
            title="Unmute"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleUnMuteUser}
              color="warning"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
              disabled={isLoading}
            >
              <VolumeMuteSharpIcon color="secondary" />
            </IconButton>
          </Tooltip>
        )}

        {/* Kick user */}
        <Tooltip
          title="Kick"
          arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton
            onClick={handleKickuser}
            color="warning"
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
            disabled={isLoading}
          >
            <ExitToAppSharpIcon color="warning" />
          </IconButton>
        </Tooltip>

        {/* Ban user */}
        {!isBanned ? (
          <Tooltip
            title="Ban"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleBanUser}
              color="warning"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
              disabled={isLoading}
            >
              <RemoveCircleSharpIcon color="error" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip
            title="UnBan"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              onClick={handleUnbanUser}
              color="warning"
              sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
              disabled={isLoading}
            >
              <RemoveCircleOutlineSharpIcon color="error" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default AdminUserCard;

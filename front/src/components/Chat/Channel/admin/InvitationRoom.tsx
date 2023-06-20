import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
<<<<<<< HEAD
import { Badge, Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Typography } from '@mui/material';
=======
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup } from '@mui/material';
>>>>>>> JM--ChannelV2
import { ApiErrorResponse, RoomInterface, UserInterface } from '../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../../store/snackbarSlice';
import { inviteUser } from '../../../../api/chat';
<<<<<<< HEAD
import { Link } from 'react-router-dom';


const RowOfFriendToInvit = ({ user }: { user: UserInterface } ) => {
  return (
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
        src={user.avatar}
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
      {user.login}
      {/* {user.login.length > 15 ? user.login.slice(0, 12) + '...' : user.login} */}
    </Typography>
  </Link>
  );
};

interface InvitationRoomProps {
  room: RoomInterface;
  setRoom: React.Dispatch<React.SetStateAction<RoomInterface | null | undefined>>;
=======
import RowOfFriendToInvit from './RowInvitation';
import { reduxUpdateRoomConvList } from '../../../../store/convListSlice';


interface InvitationRoomProps {
  room: RoomInterface;
>>>>>>> JM--ChannelV2
}

const InvitationRoom: React.FC<InvitationRoomProps> = ({ 
  room,
<<<<<<< HEAD
  setRoom,
=======
>>>>>>> JM--ChannelV2
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // const channelType = ['public', 'private'];
  const [form, setForm] = useState({
    acceptedUsers: null as UserInterface[] | null,
  });
  const { userFriends } = useSelector((state: RootState) => state.user);
  const { userData } = useSelector((state: RootState) => state.user);
  const [userFriendsToInvite, setUserFriendsToInvite] = useState<UserInterface[] | null>(null);
  const ref = useRef(document.createElement('div'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userFriends || !room) return;
    setUserFriendsToInvite(userFriends.filter(
      (u) => !room.acceptedUsers?.some(au => au.id === u.id)
        && !room.users?.some(au => au.id === u.id),
    ));
  }, [userFriends, room]);

  useEffect(() => {
    if (room.admins && userData.id && room.admins.some(u => u.id === userData.id))
      setIsAdmin(true);
  }, [room, userData]);

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target)) {
        setOpenEdit(false);
        // setIsAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => document.removeEventListener('mousedown', ClickOutside);
  }, [ref]);

  const handleSelectUser = (user: UserInterface, isChecked: boolean) => {
    if (isChecked) {
      setForm(prev => prev.acceptedUsers ? { ...prev, acceptedUsers: [...prev.acceptedUsers, user] } : { ...prev, acceptedUsers: [user] });
    } else {
      setForm(prev => prev.acceptedUsers ? { ...prev, acceptedUsers: prev.acceptedUsers.filter(u => u.id !== user.id) } : { ...prev, acceptedUsers: null });
    }
  };

  const handleValidateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.acceptedUsers || form.acceptedUsers.length === 0)
      return dispatch(setErrorSnackbar('You must select at least one user'));

    const data = { acceptedUsers: form.acceptedUsers.map(u => u.id) };
<<<<<<< HEAD
    console.log('data : ', data);
=======
>>>>>>> JM--ChannelV2
    setIsLoading(true);

    for (let i = 0; i < data.acceptedUsers.length; i++) {
      const res: RoomInterface | ApiErrorResponse
        = await inviteUser(room.id, data.acceptedUsers[i]);
      if ('error' in res) {
        dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
      }
    }
    dispatch(setMsgSnackbar('User(s) invited'));
    setIsLoading(false);
<<<<<<< HEAD
    setRoom(prev => prev ? { 
      ...prev,
      acceptedUsers: [...(prev?.acceptedUsers ?? []), ...(form?.acceptedUsers ?? [])],
    } : null);

=======
    const roomUpdated: RoomInterface = {
      ...room,
      acceptedUsers: [...(room?.acceptedUsers ?? []), ...(form?.acceptedUsers ?? [])],
    };
    dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));
>>>>>>> JM--ChannelV2
    setForm({ acceptedUsers: null });
    setOpenEdit(false);
  };



  const handleOpenEdit = () => {
    // setIsAdminMenuOpen(!openEdit);
    setOpenEdit(!openEdit);
  };


  


  return (
    <div className="left-120 top-[64px]">
      <div ref={ref} className={'border-stone-300 shadow-gray-300 text-left'} >
        <Button
          className='text-blue-500'
          onClick={handleOpenEdit}
        >
          <p className={'text-center'}> invite </p>
          <ArrowBackIosNewOutlinedIcon className={`${openEdit ? 'rotate-0' : 'rotate-180'}`} />
        </Button>

        {/* <div className={`rounded-md transition-all duration-1000 ease-in-out transform overflow-hidden origin-top-left ${openEdit
          ? 'scale-100 visible opacity-100 z-50 bg-slate-400 border-stone-300 shadow-gray-300'
          : 'scale-0 invisible opacity-0 z-0 border-stone-300 shadow-gray-300'
        }`}> */}
        {openEdit &&
          <div className="min-w-[50vw] rounded-md overflow-hidden origin-top-right bg-slate-400 border-stone-300 shadow-gray-300">
            <div className='bg-white m-1 p-2 font-mono shadow rounded-md shadow-gray-300 flex flex-col text-center'>
              {isAdmin &&
                <Box
                  component="form"
                  onSubmit={handleValidateForm}
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}>
                  <FormGroup>
                    {userFriendsToInvite?.length === 0 && <p className='ml-4 mb-4'>No friends to invite</p>}
                    {userFriendsToInvite?.map((user: UserInterface) => (
                      <FormControlLabel
                        key={user.id}
                        label={ <RowOfFriendToInvit user={user} />}
                        control={
                          <Checkbox onChange={(e) => handleSelectUser(user, e.target.checked)} />
                        }
                      />
                    ))}
                  </FormGroup>
                  <Button
                    type='submit'
                    variant='contained'
                    className='text-blue-500'
                    sx={{ mr: 1 }}
                  >
                    Invite
                  </Button>
                  {isLoading && <CircularProgress />}
                </Box>
              }
            </div>
          </div>}
      </div>
    </div>

  );
};

export default InvitationRoom;


import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  ApiErrorResponse,
  RoomInterface,
  UserInterface,
} from '../../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  setErrorSnackbar,
  setMsgSnackbar,
  setPersonalizedErrorSnackbar,
} from '../../../../store/snackbarSlice';
import { inviteUser } from '../../../../api/chat';
import RowOfFriendToInvit from './RowInvitation';
import { reduxUpdateRoomConvList } from '../../../../store/convListSlice';

interface InvitationRoomProps {
  room: RoomInterface;
}

const InvitationRoom: React.FC<InvitationRoomProps> = ({ room }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    acceptedUsers: null as UserInterface[] | null,
  });
  const { userFriends } = useSelector((state: RootState) => state.user);
  const { userData } = useSelector((state: RootState) => state.user);
  const [userFriendsToInvite, setUserFriendsToInvite] = useState<
    UserInterface[] | null
  >(null);
  const ref = useRef(document.createElement('div'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userFriends || !room) return;
    setUserFriendsToInvite(
      userFriends.filter(
        u =>
          !room.acceptedUsers?.some(au => au.id === u.id) &&
          !room.users?.some(au => au.id === u.id),
      ),
    );
  }, [userFriends, room]);

  useEffect(() => {
    if (
      room.admins &&
      userData.id &&
      room.admins.some(u => u.id === userData.id)
    )
      setIsAdmin(true);
  }, [room, userData]);

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target)) {
        setOpenEdit(false);
      }
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => document.removeEventListener('mousedown', ClickOutside);
  }, [ref]);

  const handleSelectUser = (user: UserInterface, isChecked: boolean) => {
    if (isChecked) {
      setForm(prev =>
        prev.acceptedUsers
          ? { ...prev, acceptedUsers: [...prev.acceptedUsers, user] }
          : { ...prev, acceptedUsers: [user] },
      );
    } else {
      setForm(prev =>
        prev.acceptedUsers
          ? {
              ...prev,
              acceptedUsers: prev.acceptedUsers.filter(u => u.id !== user.id),
            }
          : { ...prev, acceptedUsers: null },
      );
    }
  };

  const handleValidateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.acceptedUsers || form.acceptedUsers.length === 0)
      return dispatch(
        setPersonalizedErrorSnackbar('You must select at least one user'),
      );

    const data = { acceptedUsers: form.acceptedUsers.map(u => u.id) };
    setIsLoading(true);

    for (let i = 0; i < data.acceptedUsers.length; i++) {
      const res: RoomInterface | ApiErrorResponse = await inviteUser(
        room.id,
        data.acceptedUsers[i],
      );
      if ('error' in res) {
        dispatch(setErrorSnackbar(res));
      } else {
        dispatch(reduxUpdateRoomConvList({ item: res, userId: userData.id }));
      }
    }
    dispatch(setMsgSnackbar('User(s) invited'));
    setIsLoading(false);
    const roomUpdated: RoomInterface = {
      ...room,
      acceptedUsers: [
        ...(room?.acceptedUsers ?? []),
        ...(form?.acceptedUsers ?? []),
      ],
    };
    dispatch(
      reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }),
    );
    setForm({ acceptedUsers: null });
    setOpenEdit(false);
  };

  const handleOpenEdit = () => {
    setOpenEdit(!openEdit);
  };

  return (
    <div
      ref={ref}
      className={'border-stone-300 shadow-gray-300 text-left relative w-full'}
    >
      <Button className="text-blue-500" onClick={handleOpenEdit}>
        <p className={'text-center'}> invite </p>
        <ArrowBackIosNewOutlinedIcon
          className={`${openEdit ? 'rotate-0' : 'rotate-180'}`}
          fontSize="small"
        />
      </Button>
      <Collapse in={openEdit}>
        <div
          className="absolute min-w-[30vw] rounded-md overflow-hidden origin-top-right bg-slate-400 border-stone-300 shadow-gray-300"
          style={{
            transform: openEdit ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'top left',
            transition: 'transform 400ms ease-in-out',
          }}
        >
          <div className="bg-white m-1 p-2 font-mono shadow rounded-md shadow-gray-300 flex flex-col text-center">
            {isAdmin && (
              <Box
                component="form"
                onSubmit={handleValidateForm}
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
              >
                <h3 className="mb-3">Select user to invit</h3>
                <FormGroup
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {userFriendsToInvite?.length === 0 && (
                    <p className="ml-4 mb-4">No friends to invite</p>
                  )}
                  {userFriendsToInvite?.map((user: UserInterface) => (
                    <FormControlLabel
                      key={user.id}
                      label={<RowOfFriendToInvit user={user} />}
                      control={
                        <Checkbox
                          onChange={e =>
                            handleSelectUser(user, e.target.checked)
                          }
                        />
                      }
                    />
                  ))}
                </FormGroup>
                <Button
                  type="submit"
                  variant="contained"
                  className="text-blue-500"
                  sx={{ mr: 1 }}
                >
                  Invite
                </Button>
                {isLoading && <CircularProgress />}
              </Box>
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default InvitationRoom;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { ApiErrorResponse, RoomInterface } from '../../../types';

import { Autocomplete, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { getAllPublicRooms, joinRoom } from '../../../api/chat';
import RoomCard from './ChannelRoomCard';
import { reduxAddConversationList } from '../../../store/chatSlicer';
import { isConvAlreadyExist, isRoomInterface } from '../../../utils/utils';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

export default function ChannelSearch() {
  const [inputPwd, setInputPwd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = React.useState<RoomInterface[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [displayInputPwd, setDisplayInputPwd] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomInterface | null>(null);
  const { conversationsList } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); };

  const handleJoinRoom = async (room: RoomInterface | null) => {
    if (!room)
      return;
    if (isConvAlreadyExist(room, conversationsList)) {
      // dispatch(reduxAddConversationList(room));
      return dispatch(setErrorSnackbar('Room already in conversation list'));
    }
    if (room.isProtected && !displayInputPwd)
      return setDisplayInputPwd(true);
    if (room.isProtected && !inputPwd)
      return dispatch(setErrorSnackbar('Password required'));

    setIsLoading(true);
    // console.log('inputPwd', inputPwd);
    const res: RoomInterface | ApiErrorResponse = await joinRoom(room.id, {
      password: inputPwd,
    });
    setIsLoading(false);

    if ('error' in res) {
      if (res.error === 'Conflict' && res.message.includes('already in room')) {
        dispatch(reduxAddConversationList(room));
        if (isConvAlreadyExist(room, conversationsList))
          dispatch(setErrorSnackbar('Room already in conversation list jtevois toi ?'));
        else
          dispatch(setMsgSnackbar('Add room to conversation list'));
      } else
        dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(setMsgSnackbar('Room joint'));
      dispatch(reduxAddConversationList(room));
      setDisplayInputPwd(false);
      setInputPwd(null);
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const allRooms: RoomInterface[] | ApiErrorResponse = await getAllPublicRooms();
      setIsLoading(false);

      if ('error' in allRooms)
        dispatch(setErrorSnackbar(allRooms.error + allRooms.message ? ': ' + allRooms.message : ''));
      else {
        const roomsToFilter = allRooms
          .filter((r: RoomInterface) => !conversationsList.some(cv => isRoomInterface(cv) && cv.name === r.name));
        setRooms(roomsToFilter);
        console.log(allRooms);
      }
      setSelectedRoom(null);
    }
    fetchUsers();
  }, [conversationsList, dispatch]);

  if (!conversationsList || !rooms)
    return <p>Loading...</p>;
  return (
    <div className="h-full">
      <div className='flex p-3 border'>
        <Autocomplete
          id="searchFriends"
          fullWidth
          options={rooms}
          getOptionLabel={(option: RoomInterface) => option.name}
          onChange={(event: React.ChangeEvent<object>, newValue: RoomInterface | null) => {
            event.stopPropagation();
            setSelectedRoom(newValue);
          }}
          value={selectedRoom}
          renderInput={(params) => <TextField {...params} label="Search Friends" variant="outlined" />}
        />
        <Button
          onClick={() => handleJoinRoom(selectedRoom)}
          variant="contained"
          color="primary"
          sx={{ ml: 2, height: '40px', alignSelf: 'center' }}
        > Add </Button>
      </div>

      {displayInputPwd && (
        <div className="flex flex-col justify-center items-center min-h-[50px] border-t-2 p-2">
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password-room">Password</InputLabel>
            <OutlinedInput
              autoFocus
              name='password'
              id="outlined-adornment-password-roon"
              type={showPassword ? 'text' : 'password'}
              value={inputPwd ? inputPwd : ''}
              onChange={(e) => setInputPwd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom(selectedRoom)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <div className=''>
            <IconButton
              onClick={() => handleJoinRoom(selectedRoom)}
              color="primary"
            >
              <DoneIcon />
            </IconButton>

            <IconButton
              onClick={() => setDisplayInputPwd(false)}
              color="secondary"
            >
              <CloseIcon />
            </IconButton>
          </div>
          {isLoading && <CircularProgress />}
        </div>
      )}
      
      { isLoading && <CircularProgress />}

      <div className="flex flex-wrap justify-center overflow-auto max-h-[calc(100vh-320px)] px-2">
        {rooms.map((r: RoomInterface) => {
          return (
            <RoomCard key={r.id} room={r} />
          );
        })}
      </div>
    </div>
  );
}

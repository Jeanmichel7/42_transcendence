import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { ApiErrorResponse, RoomInterface } from '../../../types';

import { Autocomplete, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Pagination, Select, Stack, TextField } from '@mui/material';
import { getAllPublicRooms, getAllPublicRoomsCount, joinRoom } from '../../../api/chat';
import RoomCard from './ChannelRoomCard';
import { reduxAddConversationList } from '../../../store/convListSlice';
import { isConvAlreadyExist } from '../../../utils/utils';
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
  const { userData } = useSelector((state: RootState) => state.user);

  const topRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useDispatch();
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); };

  const handleJoinRoom = async (room: RoomInterface | null) => {
    if (!room)
      return;
    if (isConvAlreadyExist(room, conversationsList))
      return dispatch(setErrorSnackbar('Room already in conversation list'));
    if (room.isProtected && !displayInputPwd)
      return setDisplayInputPwd(true);
    if (room.isProtected && !inputPwd)
      return dispatch(setErrorSnackbar('Password required'));

    setIsLoading(true);
    const res: RoomInterface | ApiErrorResponse = await joinRoom({
      roomId: room.id,
      password: inputPwd ? inputPwd : undefined,
    });
    
    if ('error' in res) {
      if (res.error === 'Conflict' && res.message.includes('already in room')) {
        dispatch(reduxAddConversationList({ item: room, userId: userData.id }));
        if (isConvAlreadyExist(room, conversationsList))
          dispatch(setErrorSnackbar('Room already in conversation list jtevois toi ?'));
        else
          dispatch(setMsgSnackbar('Add room to conversation list'));
      } else
        dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(setMsgSnackbar('Room joint'));
      dispatch(reduxAddConversationList({ item: room, userId: userData.id }));
      setDisplayInputPwd(false);
      setInputPwd(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    async function fetchTotalRooms() {
      const res: number | ApiErrorResponse = await getAllPublicRoomsCount();
      if (typeof res != 'number' && 'error' in res)
        dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
      else
        setTotalPages(Math.ceil(res / userPerPage));
    }
    async function fetchRooms() {
      setIsLoading(true);
      const allRooms: RoomInterface[] | ApiErrorResponse = await getAllPublicRooms(
        currentPage,
        userPerPage,
      );
      setIsLoading(false);

      if ('error' in allRooms)
        dispatch(setErrorSnackbar(allRooms.error + allRooms.message ? ': ' + allRooms.message : ''));
      else {
        setRooms(allRooms);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      setSelectedRoom(null);
    }
    fetchTotalRooms();
    fetchRooms();
  }, [conversationsList, dispatch, currentPage, userPerPage]);



  const handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const handleChangeUserPerPage = (
    event: any,
  ) => {
    setUserPerPage(event.target.value);
    setCurrentPage(1);
  };



  return (
    <div className="h-full">
      <div className='flex p-3 border'>
        <Autocomplete
          id="searchFriends"
          fullWidth
          options={rooms}
          getOptionLabel={(option: RoomInterface) => option.name + ' (' + option.id + ')'}
          onChange={(event: React.ChangeEvent<object>, newValue: RoomInterface | null) => {
            event.stopPropagation();
            setSelectedRoom(newValue);
          }}
          value={selectedRoom}
          renderInput={(params) => <TextField {...params} label="Search Channels" variant="outlined" />}
        />
        <Button
          onClick={() => handleJoinRoom(selectedRoom)}
          variant="contained"
          color="primary"
          sx={{ ml: 2, height: '40px', alignSelf: 'center' }}
          disabled={!selectedRoom || isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <DoneIcon />
            </IconButton>

            <IconButton
              onClick={() => setDisplayInputPwd(false)}
              color="secondary"
              disabled={isLoading}
            >
              <CloseIcon />
            </IconButton>
          </div>
          {isLoading && <CircularProgress />}
        </div>
      )}
      
      <div className="flex flex-wrap justify-center overflow-auto max-h-[calc(100vh-363px)] px-2">
        <div ref={topRef} />
        {rooms.map((r: RoomInterface) => {
          return (
            <RoomCard key={r.id} room={r} />
          );
        })}
      </div>

      {/* Pagination  */}
      <div className="flex relative justify-center py-2">
        <Stack spacing={2}>
          <Pagination 
            count={totalPages} 
            onChange={handleChangePage}
          />
        </Stack>
        <div className='absolute right-2'>
          <Select
            value={userPerPage}
            onChange={handleChangeUserPerPage}
            label="Cards per page"
            sx={{ height: '35px' }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
}

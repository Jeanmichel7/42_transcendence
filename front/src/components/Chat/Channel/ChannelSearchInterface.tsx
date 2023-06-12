import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { ApiErrorResponse, RoomInterface } from '../../../types';

import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';
import { getAllPublicRooms, joinRoom } from '../../../api/chat';
import RoomCard from './ChannelRoomCard';
import { reduxAddConversationList } from '../../../store/chatSlicer';
import { isConvAlreadyExist, isRoomInterface } from '../../../utils/utils';

export default function ChannelSearch() {
  const [inputPwd, setInputPwd] = useState<string | null>('initalisetonull');
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = React.useState<RoomInterface[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomInterface | null>(null);
  const { conversationsList } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

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
      }
      setSelectedRoom(null);
    }
    fetchUsers();
  }, [conversationsList, dispatch]);

  const handleJoinRoom = async (room: RoomInterface | null) => {
    if (!room)
      return; 
    if (isConvAlreadyExist(room, conversationsList)) {
      dispatch(reduxAddConversationList(room));
      return dispatch(setErrorSnackbar('Room already in conversation list'));
    }

    setIsLoading(true);
    const res: RoomInterface | ApiErrorResponse = await joinRoom(room.id, inputPwd);
    setIsLoading(false);
    if ('error' in res) {
      if (res.error === 'Conflict' && res.message.includes('already in room')) {
        dispatch(reduxAddConversationList(room));
        if (isConvAlreadyExist(room, conversationsList))
          dispatch(setErrorSnackbar('Room already in conversation list'));
        else
          dispatch(setMsgSnackbar('Add room to conversation list'));
      } else 
        dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(setMsgSnackbar('Room joint'));
      dispatch(reduxAddConversationList(room));
      setSelectedRoom(null);
      setInputPwd(null);
    }
  };

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

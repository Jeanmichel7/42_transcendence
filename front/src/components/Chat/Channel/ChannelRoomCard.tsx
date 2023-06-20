import { Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';
import { RoomInterface, ApiErrorResponse } from '../../../types';
import { joinRoom } from '../../../api/chat';
import { reduxAddConversationList } from '../../../store/convListSlice';
import { isConvAlreadyExist } from '../../../utils/utils';
import { RootState } from '../../../store';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
export interface RoomCardProps {
  room: RoomInterface;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputPwd, setInputPwd] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [displayInputPwd, setDisplayInputPwd] = useState(false);
  const [alreadyInRoom, setAlreadyInRoom] = useState(false);

  const { conversationsList } = useSelector((state: RootState) => state.chat);
  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); };

  const handleJoinRoom = async () => {
    if (!room)
      return;
    if (isConvAlreadyExist(room, conversationsList)) {
      return dispatch(setErrorSnackbar('Room already in conversation list'));
    }
    if (room.isProtected && !displayInputPwd)
      return setDisplayInputPwd(true);
    if (room.isProtected && !inputPwd)
      return dispatch(setErrorSnackbar('Password required'));

    setIsLoading(true);
    const res: RoomInterface | ApiErrorResponse = await joinRoom(room.id, {
      password: inputPwd,
    });

    if ('error' in res) {
      if (res.error === 'Conflict' && res.message.includes('already in room')) {
        console.log('conflit already in room in db but not in redux ?');
        dispatch(reduxAddConversationList({ item: room, userId: userData.id }));
        dispatch(setMsgSnackbar('Add room to conversation list'));
        setAlreadyInRoom(true);
      } else
        dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      // const newConvId = conversationsList.length === 0 ? 0 : conversationsList[conversationsList.length - 1].id + 1;
      dispatch(setMsgSnackbar('Room joined'));
      dispatch(reduxAddConversationList({ item: res, userId: userData.id }));
      setDisplayInputPwd(false);
      setInputPwd(null);
      setAlreadyInRoom(true);
      //navigate ?
    }
    setIsLoading(false);

  };

  useEffect(() => {
    setAlreadyInRoom(isConvAlreadyExist(room, conversationsList));
  }, [conversationsList, room]);



  return (
    <div className="min-w-[200px] min-h-[200px] m-2 border rounded-lg flex flex-col justify-between" >
      <div className="flex flex-col justify-center items-center h-[150px]">
        <p className="text-2xl">{room.name}</p>
        <p className="text-2xl">{room.type}</p>
        <p className="text-2xl">{room.isProtected ? 'protected' : ''}</p>
      </div>
      {!displayInputPwd &&
        <div className="flex justify-center items-center min-h-[50px]">
          <Button
            onClick={() => handleJoinRoom()}
            variant="contained"
            color={ alreadyInRoom ? 'secondary' : 'primary'}
          > 
            { alreadyInRoom ? 'In room' : 'Join'}
          </Button>
        </div>}
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
              onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
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
              onClick={handleJoinRoom}
              color="primary"
              disabled={!inputPwd || isLoading}
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
    </div>
  );
};

export default RoomCard;
import { Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';
import { RoomInterface, ApiErrorResponse } from '../../../types';
import { joinRoom } from '../../../api/chat';
import { reduxAddConversationList } from '../../../store/chatSlicer';
import { isConvAlreadyExist } from '../../../utils/utils';
import { RootState } from '../../../store';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
export interface RoomCardProps {
  room: RoomInterface;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputPwd, setInputPwd] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [displayInputPwd, setDisplayInputPwd] = useState(false);

  const { conversationsList } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); };

  const handleJoinRoom = async () => {
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
    console.log('inputPwd', inputPwd);
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

  const checkAlreadyInRoom = (): boolean => {
    if (isConvAlreadyExist(room, conversationsList))
      return true;
    return false;
  };


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
            color={ checkAlreadyInRoom() ? 'secondary' : 'primary'}
          > 
            { checkAlreadyInRoom() ? 'In room' : 'Join'}
          </Button>
          {isLoading && <CircularProgress />}
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
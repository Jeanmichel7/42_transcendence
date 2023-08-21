import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMsgSnackbar,
  setPersonalizedErrorSnackbar,
} from '../../../../store/snackbarSlice';
import { RoomInterface, ApiErrorResponse } from '../../../../types';
import { joinRoom } from '../../../../api/chat';
import { reduxAddConversationList } from '../../../../store/convListSlice';
import { isConvAlreadyExist } from '../../../../utils/utils';
import { RootState } from '../../../../store';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';

export interface RoomCardProps {
  room: RoomInterface;
}

const RoomCard = ({ room }: RoomCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputPwd, setInputPwd] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [displayInputPwd, setDisplayInputPwd] = useState(false);
  const [alreadyInRoom, setAlreadyInRoom] = useState(false);
  const [wrongPwd, setWrongPwd] = useState(false);

  const { conversationsList } = useSelector((state: RootState) => state.chat);
  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleJoinRoom = async () => {
    if (!room) return;
    if (isConvAlreadyExist(room, conversationsList)) {
      return dispatch(
        setPersonalizedErrorSnackbar('Room already in conversation list'),
      );
    }
    if (room.isProtected && !displayInputPwd) return setDisplayInputPwd(true);
    if (room.isProtected && !inputPwd)
      return dispatch(setPersonalizedErrorSnackbar('Password required'));

    setIsLoading(true);
    const res: RoomInterface | ApiErrorResponse = await joinRoom({
      roomId: room.id,
      password: inputPwd ? inputPwd : undefined,
    });

    if ('error' in res) {
      if (res.error === 'Conflict' && res.message.includes('already in room')) {
        dispatch(reduxAddConversationList({ item: room, userId: userData.id }));
        dispatch(setMsgSnackbar('Add room to conversation list'));
        setAlreadyInRoom(true);
      } else {
        setWrongPwd(true);
      }
    } else {
      dispatch(setMsgSnackbar('Room joined'));
      dispatch(reduxAddConversationList({ item: res, userId: userData.id }));
      setDisplayInputPwd(false);
      setInputPwd(null);
      setAlreadyInRoom(true);
      setWrongPwd(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setAlreadyInRoom(isConvAlreadyExist(room, conversationsList));
  }, [conversationsList, room]);

  const handleClosePwdForm = () => {
    setDisplayInputPwd(false);
    setWrongPwd(false);
  };

  return (
    <Card elevation={10} className="m-2 w-[220px]">
      <CardContent>
        <Grid container alignItems="center" spacing={2} className="mb-2">
          <Grid item xs={9}>
            <Typography variant="h5" component="div" noWrap>
              {room.name.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {room.isProtected && <LockIcon fontSize="small" />}
          </Grid>
        </Grid>

        <Typography color="textSecondary" variant="body2" noWrap>
          Owner: {room.ownerUser?.login}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {room.users?.length} member
          {(room.users?.length as number) > 1 ? 's' : ''}
        </Typography>
      </CardContent>

      {/* Protected */}
      {!displayInputPwd && (
        <div className="flex justify-center items-center min-h-[50px] w-auto">
          <Button
            onClick={() => handleJoinRoom()}
            variant="contained"
            color={alreadyInRoom ? 'secondary' : 'primary'}
          >
            {alreadyInRoom ? 'In room' : 'Join'}
          </Button>
        </div>
      )}
      {displayInputPwd && (
        <div className="flex flex-col justify-center items-center min-h-[50px] border-t-2 p-2">
          <FormControl sx={{ m: 1, width: '20ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password-room">
              Password
            </InputLabel>
            <OutlinedInput
              autoFocus
              name="password"
              id="outlined-adornment-password-roon"
              type={showPassword ? 'text' : 'password'}
              value={inputPwd ? inputPwd : ''}
              onChange={e => setInputPwd(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJoinRoom()}
              label="Password"
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
            />
            {wrongPwd && (
              <FormHelperText error>Invalid password</FormHelperText>
            )}
          </FormControl>
          {isLoading && <CircularProgress />}
          <div>
            <IconButton
              onClick={handleJoinRoom}
              color="primary"
              disabled={!inputPwd || isLoading}
            >
              <DoneIcon />
            </IconButton>

            <IconButton onClick={handleClosePwdForm} color="secondary">
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RoomCard;

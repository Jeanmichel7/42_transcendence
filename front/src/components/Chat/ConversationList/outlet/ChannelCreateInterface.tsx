import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';

import {
  ApiErrorResponse,
  RoomInterface,
  UserInterface,
} from '../../../../types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  MenuItem,
} from '@mui/material';
import {
  setErrorSnackbar,
  setMsgSnackbar,
  setPersonalizedErrorSnackbar,
} from '../../../../store/snackbarSlice';
import { createChannel } from '../../../../api/chat';
import { reduxAddConversationList } from '../../../../store/convListSlice';
import RowOfFriendToInvit from '../../Channel/admin/RowInvitation';

const CreateGroupInterface = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const channelType = ['public', 'private'];
  const dispatch = useDispatch();

  const { userFriends } = useSelector((state: RootState) => state.user);
  const { userData } = useSelector((state: RootState) => state.user);
  const [form, setForm] = useState({
    name: '',
    type: 'public',
    password: null as string | null,
    acceptedUsers: null as UserInterface[] | null,
  });

  const handleChangeInput = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

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
    if (form.name.length < 2)
      return dispatch(
        setPersonalizedErrorSnackbar('Name must be at least 2 characters'),
      );

    const acceptedUsersFormated = form.acceptedUsers
      ? form.acceptedUsers.map(u => u.id)
      : null;
    const data = {
      name: form.name,
      type: form.type,
      password: form.password ? form.password : null,
      acceptedUsers: acceptedUsersFormated,
    };
    setIsLoading(true);
    const resCreateChannel: RoomInterface | ApiErrorResponse =
      await createChannel(data);
    setIsLoading(false);

    if ('error' in resCreateChannel) {
      dispatch(setErrorSnackbar(resCreateChannel));
    } else {
      dispatch(setMsgSnackbar('Channel created'));

      dispatch(
        reduxAddConversationList({
          item: resCreateChannel,
          userId: userData.id,
        }),
      );
      setForm({
        name: '',
        type: 'public',
        password: null,
        acceptedUsers: null,
      });
    }
  };

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-2xl m-4">Create channel</h2>
      <p className="ml-4 mb-4 ">
        Create a new group, public or private, you can also add friends to your
        group, protect it with a password, etc...
      </p>
      <div className="border m-5 p-3 rounded-md">
        <Box
          component="form"
          onSubmit={handleValidateForm}
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
        >
          <div>
            <TextField
              name="name"
              label="Name"
              id="channel-name"
              value={form.name}
              variant="outlined"
              onChange={handleChangeInput}
              autoComplete="channel-name"
            />

            <TextField
              name="type"
              id="outlined-select-currency"
              select
              label="Type"
              defaultValue="public"
              helperText="Please select your channel type"
              value={form.type}
              onChange={handleChangeInput}
            >
              {channelType.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                name="password"
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password ? form.password : ''}
                onChange={handleChangeInput}
                autoComplete="password-channel-protected"
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
              <FormHelperText id="outlined-weight-helper-text">
                Optional
              </FormHelperText>
            </FormControl>
          </div>

          {form.type === 'private' && (
            <FormGroup>
              {userFriends?.length === 0 && (
                <p className="ml-4 mb-4">No friends to invite</p>
              )}
              {userFriends?.map((user: UserInterface) => (
                <FormControlLabel
                  key={user.id}
                  label={<RowOfFriendToInvit user={user} />}
                  control={
                    <Checkbox
                      onChange={e => handleSelectUser(user, e.target.checked)}
                    />
                  }
                />
              ))}
            </FormGroup>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="mr-2"
            >
              Validate
            </Button>
          </div>

          {isLoading && <CircularProgress />}
        </Box>
      </div>
    </div>
  );
};

export default CreateGroupInterface;

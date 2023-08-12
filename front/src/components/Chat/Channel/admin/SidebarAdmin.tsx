import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Switch } from '@mui/material';
import { ApiErrorResponse, RoomInterface, UserInterface } from '../../../../types';
import AdminUserCard from './UserCardAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setErrorSnackbar, setMsgSnackbar, setPersonalizedErrorSnackbar } from '../../../../store/snackbarSlice';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { deleteChannel, editChannel } from '../../../../api/chat';
import { reduxRemoveConversationToList, reduxUpdateRoomConvList } from '../../../../store/convListSlice';
import { useNavigate } from 'react-router-dom';

interface SideBarProps {
  room: RoomInterface;
  convId: number;
  // setIsAdminMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBarAdmin: React.FC<SideBarProps> = ({ 
  room,
  convId,
  // setIsAdminMenuOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isOpenRenameMenu, setIsOpenRenameMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: room.name,
    isProtected: room.isProtected,
    password: null as string | null,
  });

  const { userData } = useSelector((state: RootState) => state.user);
  const ref = useRef(document.createElement('div'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (room.ownerUser && userData.id && room.ownerUser.id === userData.id) 
      setIsOwner(true);
  }, [room, userData]);





  const handleOpenEdit = (event: any) => {
    event.stopPropagation();
    setOpenEdit(!openEdit);
  };

  const handleChangeInput = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === 'isProtected')
      setForm(prev => ({ ...prev, [name]: !form.isProtected }));
    else
      setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); };
  const handleClickOpenDialog = () => { setOpenDialog(true); };
  const handleCloseDialog = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setOpenDialog(false); 
  };

  const handleValidateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password && form.password.length < 3)
      return dispatch(setPersonalizedErrorSnackbar('Password must be at least 3 characters'));
    if (form.isProtected && !form.password && room.isProtected != form.isProtected)
      return setErrorForm('Password is required');

    const data = {
      name: form.name,
      isProtected: form.isProtected,
      password: form.password ? form.password : null,
    };

    setIsLoading(true);
    const resCreateChannel: RoomInterface | ApiErrorResponse = await editChannel(room.id, data);

    if ('error' in resCreateChannel) {
      setErrorForm(resCreateChannel.error + resCreateChannel.message);
      // dispatch(setErrorSnackbar(resCreateChannel.error + resCreateChannel.message ? ': ' + resCreateChannel.message : ''));
    } else {
      dispatch(setMsgSnackbar('Channel updated'));
      dispatch(reduxUpdateRoomConvList({ item: resCreateChannel, userId: userData.id }));
      setForm({
        name: resCreateChannel.name,
        isProtected: resCreateChannel.isProtected,
        password: null,
      });
      setErrorForm(null);
      setIsOpenRenameMenu(false);
    }
    setIsLoading(false);
  };

  
  const handleDeleteChannel = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log('delete channel');
    if (!room) return;
    const resDeleteChannel: RoomInterface | ApiErrorResponse = await deleteChannel(room.id);
    if (typeof resDeleteChannel === 'object' && 'error' in resDeleteChannel)
      dispatch(setErrorSnackbar(resDeleteChannel));
    else {
      dispatch(setMsgSnackbar('Channel deleted'));
      dispatch(reduxRemoveConversationToList({ convId: convId, userId: userData.id }));
      // setIsAdminMenuOpen(false);
      navigate('/chat');
    }
  };


  return (
    <div className="right-0 top-[64px]">
      <div ref={ref} className={'border-stone-300 shadow-gray-300 text-right'} >
        <Button
          className='text-blue-500'
          onClick={handleOpenEdit}
        >
          <ArrowBackIosNewOutlinedIcon className={`${openEdit && 'rotate-180'}`} />
          <p className={'text-center'}> admin </p>
        </Button>

        {openEdit &&
          <div className="min-w-[50vw] rounded-md overflow-hidden origin-top-right bg-slate-400 border-stone-300 shadow-gray-300">
            <div className='bg-white m-1 p-2 font-mono shadow rounded-md shadow-gray-300 flex flex-col text-center'>
              {isOwner &&
                <Box sx={{
                  bgcolor: 'background.paper',
                  pb: 1,
                }}>
                  {isOpenRenameMenu &&
                    <Box
                      component="form"
                      onSubmit={handleValidateForm}
                      sx={{
                      }}
                    >
                      <div className='flex flex-col p-1 w-full'>
                        <FormControl sx={{ mb: 1 }}>
                          <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
                          <OutlinedInput
                            name='name'
                            id="outlined-adornment-name"
                            label="Name"
                            type='text'
                            value={form.name}
                            onChange={handleChangeInput}
                            autoComplete='off'
                          />
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                          <OutlinedInput
                            name='password'
                            id="outlined-adornment-password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password ? form.password : ''}
                            onChange={handleChangeInput}
                            autoComplete='off'
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
                              </InputAdornment> }
                          />
                        </FormControl>

                        <div className='flex space-between items-center'>
                          <FormControl>
                            <FormControlLabel
                              label="Protected"
                              labelPlacement="start"
                              control={
                                <Switch
                                  id='outlined-adornment-protected'
                                  checked={form.isProtected ? true : form.password ? true : false }
                                  name='isProtected'
                                  onChange={handleChangeInput}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                  sx={{ m: 0 }}
                                />}
                              sx={{ m: 0 }}
                            />
                          </FormControl>
                        </div>
                      </div>
                      <div>
                        <Button
                          type='submit'
                          variant="contained"
                          color="primary"
                          disabled={isLoading}
                          sx={{ m: 1 }}
                        >
                          Validate
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => setIsOpenRenameMenu(!isOpenRenameMenu)}
                          sx={{ m: 1 }}
                        >
                          Cancel
                        </Button>
                      </div>
                      <FormHelperText
                        error={errorForm ? true : false}
                        disabled={errorForm ? false : true}
                        id="outlined-weight-helper-text"
                        sx={{ mb: 1, textAlign: 'center' }}
                      >
                        {errorForm}
                      </FormHelperText>
                    </Box>
                  }

                  {!isOpenRenameMenu &&
                    <>
                      <Button
                        type='submit'
                        variant='contained'
                        className='text-blue-500'
                        onClick={() => setIsOpenRenameMenu(!isOpenRenameMenu)}
                        sx={{ mr: 1 }}
                        color={isOpenRenameMenu ? 'warning' : 'primary'}
                      >
                        {isOpenRenameMenu ? 'Cancel' : 'Modify'}
                      </Button>
                      <Button
                        variant='contained'
                        className='text-blue-500'
                        color='error'
                        onClick={handleClickOpenDialog}
                      >
                        Delete
                      </Button>
                      <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {'Are you sure you want to delete this channel ?'}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            You are about to delete this channel. Please note that this action is irreversible
                            and all the channel's content will be permanently deleted.
                            Are you sure you want to proceed?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDialog}>Cancel</Button>
                          <Button
                            onClick={(event) => handleDeleteChannel(event)}
                            color='error'
                            disabled={isLoading}
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  }
                </Box>
              }

              {room.users &&
                room.users.map((user: UserInterface) => (
                  <AdminUserCard key={user.id} user={user} room={room} />
                ))
              }
            </div>
          </div>
        } </div>
    </div>

  );
};

export default SideBarAdmin;


import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { ApiErrorResponse, RoomInterface, UserInterface } from '../../../../types';
import AdminUserCard from './UserCardAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../../store/snackbarSlice';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { editChannel } from '../../../../api/chat';

interface SideBarProps {
  room: RoomInterface;
  setIsAdminMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteChannel: () => void;
}

const SideBarAdmin: React.FC<SideBarProps> = ({ room, setIsAdminMenuOpen, handleDeleteChannel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isOpenRenameMenu, setIsOpenRenameMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const channelType = ['public', 'private'];
  const [form, setForm] = useState({
    // type: 'public',
    password: null as string | null,
    // acceptedUsers: null as UserInterface[] | null,
  });

  const { userData } = useSelector((state: RootState) => state.user);
  const ref = useRef(document.createElement('div'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (room.ownerUser && userData.id && room.ownerUser.id === userData.id) setIsOwner(true);
  }, [room, userData]);

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target)) {
        setOpenEdit(false);
        setIsAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => document.removeEventListener('mousedown', ClickOutside);
  }, [ref, setIsAdminMenuOpen]);




  const handleOpenEdit = () => {
    setIsAdminMenuOpen(!openEdit);
    setOpenEdit(!openEdit);
  };

  const handleChangeInput = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); };
  const handleClickOpenDialog = () => { setOpenDialog(true); };
  const handleCloseDialog = () => { setOpenDialog(false); };

  const handleValidateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.password || form.password.length < 3)
      return dispatch(setErrorSnackbar('Password must be at least 3 characters'));

    const data = {
      // type: form.type,
      password: form.password ? form.password : null,
      // acceptedUsers: form.acceptedUsers ? form.acceptedUsers.map(u => u.id) : null,
    };
    setIsLoading(true);
    const resCreateChannel: RoomInterface | ApiErrorResponse = await editChannel(room.id, data);
    
    if ('error' in resCreateChannel) {
      dispatch(setErrorSnackbar(resCreateChannel.error + resCreateChannel.message ? ': ' + resCreateChannel.message : ''));
    } else {
      dispatch(setMsgSnackbar('Channel updated'));
      // dispatch(reduxAddConversationList(resCreateChannel)); 
      // update channel ans conv list
      setForm({
        // type: 'public',
        password: null,
        // acceptedUsers: null,
      });
    }
    setIsLoading(false);
    console.log(form);
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

        {/* <div className={`rounded-md transition-all duration-1000 ease-in-out transform overflow-hidden origin-top-right 
        ${openEdit
          ? 'scale-100 visible opacity-100 z-50 bg-slate-400 border-stone-300 shadow-gray-300'
          : 'scale-0 invisible opacity-0 z-0 border-stone-300 shadow-gray-300'
        }`}> */}
        {openEdit &&
          // <div className="rounded-md transition-all duration-1000 ease-in-out transform overflow-hidden origin-top-right scale-100 visible opacity-100 z-50 bg-slate-400 border-stone-300 shadow-gray-300">
          <div className="min-w-[50vw] rounded-md overflow-hidden origin-top-right bg-slate-400 border-stone-300 shadow-gray-300">
            {/* <div className=''>  */}
             {/* w-[calc(100vw-275px)]  */}
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
                      // noValidate
                      // autoComplete="off"
                      >
                        <div className='flex'>

                          <FormControl>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                              name='password'
                              id="outlined-adornment-password"
                              label="Password"
                              type={showPassword ? 'text' : 'password'}
                              value={form.password ? form.password : ''}
                              onChange={handleChangeInput}
                              required
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
                          </FormControl>
                          <Button
                            type='submit'
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                          >
                            Validate
                          </Button>
                          <Button
                            type='submit'
                            variant="contained"
                            color="error"
                            onClick={() => setIsOpenRenameMenu(!isOpenRenameMenu)}
                          >
                            Cancel
                          </Button>
                        </div>
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
                          {isOpenRenameMenu ? 'Cancel' : 'Change password'}
                        </Button>
                        <Button
                          variant='contained'
                          className='text-blue-500'
                          color='error'
                          onClick={handleClickOpenDialog}
                        >
                          Delete channel
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
                              onClick={handleDeleteChannel}
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

                {/* <div className='flex flex-row items-center'>
                <p className='text-blue-500' >{room.name}</p>
              </div> */}
                {room.users &&
                  room.users.map((user: UserInterface) => (
                    <AdminUserCard key={user.id} user={user} room={room} />
                  ))
                }
              </div>
            {/* </div> */}
          </div>
        } </div>
    </div>

  );
};

export default SideBarAdmin;


import React, { useState } from 'react';
import {  patchUserAccount } from '../../api/user';
import AccountItem from './AccountItem';
import Box from '@mui/material/Box';
import { Alert, Button, Snackbar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

import { UserInterface, ApiErrorResponse } from '../../types';

export default function AccountProfile( { user }: { user: UserInterface, }) {
  // console.log('user : ', user);
  const [stateSnackBar, setStateSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = React.useState<string>();

  const [openInputAvatar, setOpenInputAvatar] = useState<boolean>(false);
  const fileInputRef = React.createRef<HTMLInputElement>();
  const dispatch = useDispatch();

  const handleFileUpload = async () => {
    setStateSnackBar(true);

    const fileInput: HTMLInputElement | null = fileInputRef.current;
    const formData: FormData = new FormData();
    formData.append('avatar', fileInput?.files?.[0] as File);

    const updatedUser: UserInterface | ApiErrorResponse = await patchUserAccount(formData);
    if ('error' in updatedUser) {
      setSnackBarMsg('Error update: ' + updatedUser.message);
    } else {
      dispatch(setUser({ ...user, avatar: updatedUser.avatar }));
      setOpenInputAvatar(false);
      setSnackBarMsg('Updated!');
    }
  };


  const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setStateSnackBar(false);
  };

  return (
    <>
      <h2 className="text-3xl text-center">Account</h2>

      <Box className="flex justify-between" >
        <div className="w-1/4">
          { user && user.avatar && 
          <img
            src={'http://localhost:3000/avatars/' + user.avatar}
            className="text-center mb-2 w-auto rounded-[16px] max-h-[200px]"
            alt="avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
          />
          }
          <div className='flex justify-center' >
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenInputAvatar(!openInputAvatar)}
              sx={{ display: openInputAvatar ? 'none' : 'block' }}
            >
              Change avatar
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenInputAvatar(!openInputAvatar)}
              sx={{ display: openInputAvatar ? 'block' : 'none' }}
            >
              Annuler
            </Button>
          </div>
          { openInputAvatar &&
            <div className="mt-5">
              <div className='flex justify-center' >
                <input
                  type="file"
                  ref={fileInputRef}
                  // style={{ display: 'none' }} 
                  // onChange={handleFileChange}
                />
              </div>
              <div className='flex justify-center mt-2' >
                <Button variant="contained" color="primary" onClick={handleFileUpload}>
                  Upload File
                </Button>
              </div>
            </div>
          }
          <p className='mt-5 font-bold'> Description : </p>
          <p className='mt-1'> {user.description ? user.description : 'No description'} </p>
        </div>

        <div className="w-3/4 m-5 border-2px ">
          <div className=" p-5">

            <AccountItem
              keyName="login"
              value={user.login}
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

            <AccountItem
              keyName="email"
              value={user.email}
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

            <AccountItem
              keyName="firstName"
              value={user.firstName}
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

            <AccountItem
              keyName="lastName"
              value={user.lastName}
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

            <AccountItem
              keyName="password"
              value="********"
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

            <AccountItem
              keyName="description"
              value={user.description}
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

            <AccountItem
              keyName="Active 2FA"
              value={user.is2FAEnabled}
              setStateSnackBar={setStateSnackBar}
              setSnackBarMsg={setSnackBarMsg}
            />

          </div>
        </div>
      </Box>
      <Snackbar
        open={stateSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
          {snackBarMsg}
        </Alert>
      </Snackbar>
    </>

  );
}


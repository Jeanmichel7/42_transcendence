import React, { useState, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { setUser } from '../../store/userSlice';
import { RootState } from '../../store';

import AccountItem from './AccountItem';

import {  patchUserAccount } from '../../api/user';
import { UserInterface, ApiErrorResponse } from '../../types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';


export default function AccountProfile() {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [openInputAvatar, setOpenInputAvatar] = useState<boolean>(false);
  const dispatch = useDispatch();
  const fileInputRef = createRef<HTMLInputElement>();

  const handleFileUpload = async () => {
    const fileInput: HTMLInputElement | null = fileInputRef.current;
    const formData: FormData = new FormData();
    formData.append('avatar', fileInput?.files?.[0] as File);

    const updatedUser: UserInterface | ApiErrorResponse = await patchUserAccount(formData);
    if ('error' in updatedUser) {
      dispatch(setErrorSnackbar('Error update: ' + updatedUser.message));
    } else {
      dispatch(setUser({ ...userData, avatar: updatedUser.avatar }));
      setOpenInputAvatar(false);
      dispatch(setMsgSnackbar('Updated!'));
    }
  };

  return (
    <>
      <h2 className="text-3xl text-center">Account</h2>

      <Box className="flex justify-between" >
        <div className="w-1/4">
          { userData && userData.avatar && 
          <img
            src={'http://localhost:3000/avatars/' + userData.avatar}
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
          <p className='mt-1'> {userData.description ? userData.description : 'No description'} </p>
        </div>

        <div className="w-3/4 m-5 border-2px ">
          <div className=" p-5">

            <AccountItem
              keyName="login"
              value={userData.login}
            />

            <AccountItem
              keyName="email"
              value={userData.email}
            />

            <AccountItem
              keyName="firstName"
              value={userData.firstName}
            />

            <AccountItem
              keyName="lastName"
              value={userData.lastName}
            />

            <AccountItem
              keyName="password"
              value="********"
            />

            <AccountItem
              keyName="description"
              value={userData.description}
            />

            <AccountItem
              keyName="Active 2FA"
              value={userData.is2FAEnabled}
            />

          </div>
        </div>
      </Box>
    </>

  );
}

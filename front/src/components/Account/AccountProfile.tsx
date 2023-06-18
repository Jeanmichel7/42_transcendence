import React, { useState, createRef } from 'react';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { setUser } from '../../store/userSlice';
// import { RootState } from '../../store';

import AccountItem from './AccountItem';

import {  patchUserAccount } from '../../api/user';
import { UserInterface, ApiErrorResponse } from '../../types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';

interface AccountProfileProps {
  user: UserInterface;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ user }) => {
  // const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const [openInputAvatar, setOpenInputAvatar] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const dispatch = useDispatch();
  const fileInputRef = createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    const fileInput: HTMLInputElement | null = fileInputRef.current;
    const formData: FormData = new FormData();
    formData.append('avatar', fileInput?.files?.[0] as File);
    setIsLoading(true);
    const updatedUser: UserInterface | ApiErrorResponse = await patchUserAccount(formData);
    if ('error' in updatedUser) {
      dispatch(setErrorSnackbar(updatedUser.error + updatedUser.message ? ': ' + updatedUser.message : ''));
    } else {
      dispatch(setUser({ ...user, avatar: updatedUser.avatar }));
      setOpenInputAvatar(false);
      setPreviewAvatar(null);
      dispatch(setMsgSnackbar('Updated!'));
    }
    setIsLoading(false);
  };

  return (
    <>
      <h2 className="text-3xl text-center">Account</h2>

      { user &&
      <Box className="flex justify-between" >
        <div className="w-1/4">
          <img
            src={previewAvatar && openInputAvatar ? previewAvatar : user.avatar}
            className="text-center mb-2 w-auto rounded-[16px] max-h-[200px]"
            alt="avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
            }}
          />
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
                  onChange={handleFileChange}
                />
              </div>
              <div className='flex justify-center mt-2' >
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={handleFileUpload}
                  disabled={isLoading}
                >
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
            />

            <AccountItem
              keyName="email"
              value={user.email}
            />

            <AccountItem
              keyName="firstName"
              value={user.firstName}
            />

            <AccountItem
              keyName="lastName"
              value={user.lastName}
            />

            <AccountItem
              keyName="password"
              value="********"
            />

            { user.description && <AccountItem
              keyName="description"
              value={user.description}
            /> }

            { user.is2FAEnabled != null &&  user.is2FAEnabled != undefined && <AccountItem
              keyName="Active 2FA"
              value={user.is2FAEnabled}
            /> }

          </div>
        </div>
      </Box>
          }

    </>

  );
};
export default AccountProfile;
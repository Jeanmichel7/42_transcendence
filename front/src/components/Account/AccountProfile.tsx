import React, { useState } from 'react';
import {  patchUserAccount } from '../../api/user';
import AccountItem from './AccountItem';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

export interface AccountProps {
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  is2FAEnabled: boolean;
  avatar: string;
  status: string;
}

export default function AccountProfile(
  { user, setUserProfile }: { user: AccountProps, setUserProfile: (user: AccountProps) => any },
) {
  const [openInputAvatar, setOpenInputAvatar] = useState<boolean>(false);
  const fileInputRef = React.createRef<HTMLInputElement>();
  const dispatch = useDispatch();

  const handleFileUpload = async () => {
    const fileInput: any = fileInputRef.current;
    const formData = new FormData();
    formData.append('avatar', fileInput.files[0]);


    const res = await patchUserAccount(formData);
    console.log('res images : ', res);
    if (res.error) {
      console.log('res error : ', res);
    } else {
      console.log('res ok : ', res);
      dispatch(setUser(res));
      setUserProfile({ ...user, avatar: res.avatar });
      setOpenInputAvatar(false);
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    console.log(file); // log file object pour vérifier
  };


  return (
    <>
      <h2 className="text-3xl text-center">Account</h2>

      <Box className="flex justify-between" >
        <div className="w-1/4">
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
          {openInputAvatar &&
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
              setUserProfile={setUserProfile}
            />

            <AccountItem
              keyName="email"
              value={user.email}
              setUserProfile={setUserProfile}
            />

            <AccountItem
              keyName="firstName"
              value={user.firstName}
              setUserProfile={setUserProfile}
            />

            <AccountItem
              keyName="lastName"
              value={user.lastName}
              setUserProfile={setUserProfile}
            />

            <AccountItem
              keyName="password"
              value="********"
              setUserProfile={setUserProfile}
            />

            <AccountItem
              keyName="description"
              value={user.description}
              setUserProfile={setUserProfile}
            />

            <AccountItem
              keyName="Active 2FA"
              value={user.is2FAEnabled}
              setUserProfile={setUserProfile}
            />


          </div>
        </div>
      </Box>
    </>

  );
}


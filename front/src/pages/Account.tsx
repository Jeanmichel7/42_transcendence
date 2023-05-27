import React, { useEffect, useState } from 'react';
import { fetchUserAccount } from '../api/user';
import AccountItem from '../components/Account/AccountItem';
import Box from '@mui/material/Box';

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

export default function Account() {
  const [user, setUserProfile] = useState<AccountProps>({
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    description: '',
    is2FAEnabled: false,
    avatar: '',
    status: '',
  });

  async function fetchAndSetUserProfile() {
    try {
      const res: any = await fetchUserAccount();
      if (res.error) {
        console.log(res);
      }
      setUserProfile(res);
      // console.log(user)
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  useEffect(() => {
    fetchAndSetUserProfile();
  }, []);

  useEffect(() => {
    console.log(user)
  }, [user]);

  return (
    <> {user &&
      <Box className="flex justify-between" >
        <div className="w-1/4">
          <img
            src={`http://localhost:3000/avatars/` + user.avatar}
            className="text-center mb-2 w-full rounded-[16px]"
            alt="avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "http://localhost:3000/avatars/defaultAvatar.png"
            }}
          />
          <p>
            {user.description? user.description : "No description"}
            
          </p>
        </div>

        <div className="w-3/4 m-5 border-2px ">
          <h1 className="text-3xl text-center">Account</h1>
          <div className="border-l-2 border-l-black p-5">

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
              keyName="Active 2FA"
              value={user.is2FAEnabled}
              setUserProfile={setUserProfile}
            />

            {/* <AccountItem
              keyName="Status"
              value={user.status}
              setUserProfile={setUserProfile}
            /> */}

          </div>
        </div>
      </Box>
    } </>
  )
}

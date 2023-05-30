import React, { useEffect, useState } from 'react';
import { fetchUserAccount } from '../../api/user';
import AccountItem from './AccountItem';
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

export default function AccountProfile(
  {user, setUserProfile}: {user: AccountProps, setUserProfile: (user: AccountProps) => any}
) {
  return (
    <>
      <h2 className="text-3xl text-center">Account</h2>

      <Box className="flex justify-between" >
        <div className="w-1/4">
          <img
            src={`http://localhost:3000/avatars/` + user.avatar}
            className="text-center mb-2 w-auto rounded-[16px] max-h-[200px]"
            alt="avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "http://localhost:3000/avatars/defaultAvatar.png"
            }}
          />
          <p> {user.description ? user.description : "No description"} </p>
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
    </>

  )
}

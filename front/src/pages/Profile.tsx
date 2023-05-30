import React, { useEffect, useState } from 'react'
import Navbar from '../components/Header/Header'
import { getProfileByPseudo } from '../api/user';
import { getFriendProfile } from '../api/relation';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import ProfileFriends from '../components/Profile/ProfileFriends';

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

function Profile() {
  const { pseudo } = useParams();
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
  // const [friends, setFriends] = useState<AccountProps[]>([]);

  async function fetchAndSetUserProfile() {
    if (typeof pseudo === 'undefined')
      return;
    const res: any = await getProfileByPseudo(pseudo);
    if (res.error) {
      console.log(res);
    }
    else
      setUserProfile(res);
    console.log(res)
  }

  useEffect(() => {
    fetchAndSetUserProfile();
  }, [pseudo]);


  return (
    <>
      <Box className="flex justify-between " >
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
          <p> {user.description ? user.description : "No description"} </p>
        </div>

        <div className="w-3/4 m-5 border-2px ">
          <h2 className="text-3xl text-center mb-5">{user.firstName + ' ' + user.lastName}</h2>
          <div className="flex justify-between">
            <div className="w-1/4">
              <p className="text-xl">Pseudo</p>
              <p className="text-xl">Email</p>
              <p className="text-xl">Status</p>
            </div>
            <div className="w-3/4">
              <p className="text-xl">{user.login}</p>
              <p className="text-xl">{user.email}</p>
              <p className="text-xl">{user.status}</p>
            </div>

          </div>
        </div>
      </Box>

      <Box className="w-full">
        <ProfileFriends user={user}/>
      </Box>

      <Box className="w-full">
        <h2 className="text-3xl text-center mb-5">Games</h2>


      </Box>
    </>

  )
}
export default Profile
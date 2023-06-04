import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileByPseudo } from '../api/user';

import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

import { ApiErrorResponse, UserInterface } from '../types';

import Box from '@mui/material/Box';

function Profile() {
  const { pseudo } = useParams();
  const [user, setUserProfile] = useState<UserInterface>({
    id: -1,
    login: '',
    email: '',
    firstName: '',
    lastName: '',
    description: '',
    is2FAEnabled: false,
    avatar: '',
    status: 'offline',
  });

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      if (typeof pseudo === 'undefined')
        return;
      const profilesFetched: UserInterface | ApiErrorResponse = await getProfileByPseudo(pseudo);
      if ('error' in profilesFetched) {
        console.log(profilesFetched);
      } else
        setUserProfile(profilesFetched);
    }
    fetchAndSetUserProfile();
  }, [pseudo]);


  return (
    <>
      <Box className="flex justify-between">
        <div className="w-1/4">
          {user.avatar &&
            <img
              src={'http://localhost:3000/avatars/' + user.avatar}
              className="text-center mb-2 w-full rounded-[16px]"
              alt="avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
            />
          }
          <p> {user.description ? user.description : 'No description'} </p>
        </div>

        <div className="w-3/4 m-5 border-2px">
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
        <ProfileFriends user={user} />
      </Box>

      <Box className="w-full">
        <HistoryGame user={user} />
      </Box>
    </>

  );
}
export default Profile;

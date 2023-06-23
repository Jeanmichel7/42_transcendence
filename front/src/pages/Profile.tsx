import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { reduxAddWaitingFriendsSent } from '../store/userSlice';
import { setErrorSnackbar, setMsgSnackbar } from '../store/snackbarSlice';

import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

import { getProfileByPseudo } from '../api/user';
import { requestAddFriend } from '../api/relation';

import { ApiErrorResponse, UserInterface, UserRelation } from '../types';


import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import ErrorBoundary from '../utils/errorBoundaries';

function Profile() {
  const { pseudo } = useParams();
  const { userData, userFriends } = useSelector((state: RootState) => state.user);
  const [userProfile, setUserProfile] = useState<UserInterface>({
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
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      if (typeof pseudo === 'undefined')
        return;
      const profilesFetched: UserInterface | ApiErrorResponse = await getProfileByPseudo(pseudo);
      if ('error' in profilesFetched) {
        dispatch(setErrorSnackbar(profilesFetched.error + profilesFetched.message ? ': ' + profilesFetched.message : ''));
      } else
        setUserProfile(profilesFetched);
    }
    fetchAndSetUserProfile();
  }, [pseudo, dispatch]);

  const handleAddFriend = async () => {
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(userProfile.id);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(userProfile));
    }
  };

  return (
    <>
      <Box className="flex justify-between">
        <div className="w-1/4">
          {userProfile.avatar &&
            <img
              src={userProfile.avatar}
              className="text-center mb-2 w-full rounded-[16px]"
              alt="avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
              }}
            />
          }
          <p> {userProfile.description ? userProfile.description : 'No description'} </p>
        </div>

        <div className="w-3/4 m-5 border-2px">
          <h2 className="text-3xl text-center mb-5">
            {userProfile.firstName + ' ' + userProfile.lastName}
          </h2>
          { userData.id && userFriends 
            && !userFriends.find(u => u.id === userProfile.id)
            && userData.id != userProfile.id &&
            <Button variant="contained" color="primary"
              onClick={() => handleAddFriend()}
              sx={{ display: 'block', margin: 'auto' }}
            >
              Add friend
            </Button>
          }
          <div className="flex justify-between">
            <div className="w-1/4 font-bold">
              <p className="text-xl">Pseudo</p>
              <p className="text-xl">Email</p>
              <p className="text-xl">Status</p>
            </div>
            <div className="w-3/4">
              <p className="text-xl">{userProfile.login}</p>
              <p className="text-xl">{userProfile.email}</p>
              <p className="text-xl">{userProfile.status}</p>
            </div>
          </div>
        </div>
      </Box>

      <Box className="w-full">
        <ProfileFriends user={userProfile} />
      </Box>

      <Box className="w-full">
        <ErrorBoundary>
          <HistoryGame user={userProfile} />
        </ErrorBoundary>
      </Box>
    </>

  );
}
export default Profile;

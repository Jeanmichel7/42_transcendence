import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAccount } from '../api/user';
import AccountProfile from '../components/Account/AccountProfile';
import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';
import { setError, setUser } from '../store/userSlice';
import { ApiErrorResponse, UserInterface } from '../types';
import { RootState } from '../store';

export default function Account() {
  const dispatch = useDispatch();
  const { userData, error } = useSelector((state: RootState) => state.user);
  
  useEffect(() => {
    async function fetchAndSetUserAccount(): Promise<void> {
      const fetchedUser: UserInterface | ApiErrorResponse = await fetchUserAccount();
      if ('error' in fetchedUser)
        dispatch(setError(fetchedUser));
      else
        dispatch(setUser(fetchedUser));
    }
    fetchAndSetUserAccount();
  }, [dispatch]);
  
  if (error) {
    return <div>Une erreur s'est produite: {error.message}</div>;
  }
  return (
    <>
      {userData && userData.id !== -1 &&
        <>
          <AccountProfile user={userData} />
          <ProfileFriends user={userData} />
          <HistoryGame user={userData} />
        </>
      }
    </>
  );
}

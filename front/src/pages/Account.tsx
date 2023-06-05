import { RootState } from '../store';
import { useSelector } from 'react-redux';

import AccountProfile from '../components/Account/AccountProfile';
import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';

export default function Account() {
  const { userData } = useSelector((state: RootState) => state.user);
  
  return (
    <>
      {userData && userData.id !== -1 &&
        <>
          <AccountProfile />
          <ProfileFriends user={userData} />
          <HistoryGame user={userData} />
        </>
      }
    </>
  );
}

import { RootState } from '../store';
import { useSelector } from 'react-redux';

import AccountProfile from '../components/Account/AccountProfile';
import ProfileFriends from '../components/Profile/ProfileFriends';
import HistoryGame from '../components/Profile/HistoryGame';
// import { useEffect } from 'react';

export default function Account() {
  const { userData } = useSelector((state: RootState) => state.user);

  // useEffect(() => {
  //   console.log('userData', userData);
  // }, [userData]);
  return (
    <div className="bg-[var(--background-color)] relative z-10">
      {userData && userData.id !== -1 && (
        <>
          <AccountProfile user={userData} />
          <ProfileFriends user={userData} />
          <HistoryGame user={userData} />
        </>
      )}
    </div>
  );
}

import { RootState } from '../store';
import { useSelector } from 'react-redux';

import AccountProfile from '../components/Account/AccountProfile';
import ProfileFriends from '../components/Profile/ProfileFriends';

export default function Account() {
  const { userData } = useSelector((state: RootState) => state.user);

  return (
    <div className="bg-[var(--background-color)] relative z-10">
      {userData && userData.id !== -1 && (
        <>
          <AccountProfile user={userData} />
          <ProfileFriends user={userData} />
        </>
      )}
    </div>
  );
}

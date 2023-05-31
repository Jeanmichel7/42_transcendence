import { useEffect, useState } from 'react';
import { fetchUserAccount } from '../api/user';
import AccountProfile from '../components/Account/AccountProfile';
import AccountGameHistory from '../components/Account/AccountGameHistory';
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
    const res: any = await fetchUserAccount();
    if (res.error)
      console.log(res);
    else
      setUserProfile(res);
  }

  useEffect(() => {
    fetchAndSetUserProfile();
  }, []);

  // useEffect(() => {
  //   console.log(user)
  // }, [user]);


  return (
    <>
      <AccountProfile user={user} setUserProfile={setUserProfile}/>
      <ProfileFriends user={user}/>
      <AccountGameHistory />
    </>
  );
}

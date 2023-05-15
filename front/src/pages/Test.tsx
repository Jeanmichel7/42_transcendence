import { useEffect, useState } from 'react';
import axios from 'axios';

import PrivateChat from '../components/Chat/PrivateChat';

function Test() {
  const [userProfile, setUserProfile] = useState<any>(null);

  async function fetchUserProfile() {
    const userId = 1;
    const response = await axios.get(`http://localhost:3000/users/${userId}/profileById`, {
      withCredentials: true,
    });
    if (response.status === 200) return response.data;
    else throw new Error('Failed to fetch user profile');
  }

  useEffect(() => {
    async function fetchAndSetUserProfile() {
      try {
        const userProfileData = await fetchUserProfile();
        setUserProfile(userProfileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    // fetchAndSetUserProfile();
  }, []);



  return (
    <div>
      <PrivateChat />
     
    </div>
  );
}

export default Test;
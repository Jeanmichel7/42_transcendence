import React, { useEffect, useState } from 'react'
import Navbar from '../components/Header/Header'
import { Link } from 'react-router-dom'
import axios from 'axios';

function Profile() {
  const [userProfile, setUserProfile] = useState<any>(null);

  async function fetchUserProfile() {
    const userId = 1
    const response = await axios.get(`http://localhost:3000/users`, {
      withCredentials: true,
    });
    if (response.status === 200)
      return response.data;
    else
      throw new Error('Failed to fetch user profile');
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
    fetchAndSetUserProfile();
  }, []);

  return (
    <div className="w-full bg-[#1e1e4e]">
      <span className=" w-3/4 h-2/3 items-center justify-center flex">
        <div className="  " >
          <p> user data : </p>
          {userProfile ?
            <ul>
              <li> {userProfile.login}  </li>
              <li> {userProfile.email} </li>
              <li> {userProfile.firstName} </li>
            </ul>
            : "aie probleme"}
        </div>
      </span>
    </div>
  )
}
export default Profile
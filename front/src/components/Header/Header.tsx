import React from 'react'
import { Link, useNavigate  } from "react-router-dom"
import axios from 'axios'

function Header() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  let navigate = useNavigate ();

  React.useEffect(() => {
    async function fetchAndSetIsConnected() {
      try {
        const res = await checkProfile();
        if (res.isConnected) {
          setIsConnected(res.isConnected);
          setUserProfile(res.userProfile);
        }
        else {
        //   window.location.href = "/login";
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    fetchAndSetIsConnected();
  }, []);

  async function checkProfile() {
    const res = await axios.get('http://localhost:3000/users', {
      withCredentials: true,
    });
    if (res.status == 200) {
      console.log("res.data : ", res.data)
      return {
        isConnected: true,
        userProfile: res.data
      }
    } else {
      throw new Error('Failed to fetch user profile');
    }
  }


  function handleLogout() {
    axios.get('http://localhost:3000/auth/logout', {
      withCredentials: true,
    });
    navigate('/');
  }


  return (
    <div className="top-0 bg-[#1e1e4e] text-white" >
      <div className="flex justify-between items-center" >
        <div className="flex items-center" >
          <img src='/pong-nav.png' width='128px' className="text-center p-2 rounded-full" />
          <p className="text-4xl font-bold font-Dance" >Pong</p>
        </div>

        <div className="flex justify-between items-center space-x-8" >
          <Link to="/home" className="text-3xl font-bold font-Dance" >Play</Link>
          <Link to="/chat" className="text-3xl font-bold font-Dance" >Chat</Link>
          <Link to="/friends" className="text-3xl font-bold font-Dance" >Friends</Link>
          <Link to="/test" className="text-3xl font-bold font-Dance" >Test</Link>
        </div>

        <div className="flex justify-between items-center space-x-8" >
          <button onClick={handleLogout} className="text-3xl font-bold font-Dance">Logout</button>
          <Link to="/profile" className="text-3xl font-bold font-Dance" >
            {userProfile?.login }
          </Link>
          <img src={`http://localhost:3000/avatars/` + userProfile?.avatar}
           width='120px' className="text-center p-2 rounded-full " />
        </div>
      </div>
    </div>
  )
}

export default Header
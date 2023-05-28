import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { check2FACookie, send2FA, getUserData } from '../../api/auth'
import { setUser, setLogged } from '../../store/userSlice'

function ConnectPage() {
  let navigate = useNavigate();

  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [userId, setUserId] = useState(0);
  const [code2FA, setCode2FA] = useState("");

  const userData: any = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch()

  //check if 2FA is activated
  useEffect(() => {
    async function fetchAndSetIs2FAactived() {
      try {
        const res = await check2FACookie();
        if (res.is2FAactived) {
          console.log("is2FAactived")
          setIs2FAactiv(res.is2FAactived);
          setUserId(res.userId);
        }
        else {
          await saveUserData();
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }

    fetchAndSetIs2FAactived();
  }, []);



  //save user data in redux
  async function saveUserData() {
    const res = await getUserData();
    dispatch(setUser(res));
    dispatch(setLogged(true));
  }


  //send code to server
  async function handleSendCode() {
    const res = await send2FA(code2FA, userId);

    if (res.status === 200) {
      await saveUserData();
      navigate('/home');
    }
    else {
      console.log(res.data)
    }
  }

  return (
    <div className=" w-3/4 h-2/3 items-center justify-center flex" style={{ backgroundColor: '#1B262C' }}>
      {is2FAactiv &&
        <section style={{ color: '#FDFFFC' }}>
          <p>2FA authentication</p>
          <input type="text" value={code2FA} onChange={(e) => setCode2FA(e.target.value)}
            placeholder='Code' style={{ backgroundColor: '#22D3EE', color: '#FDFFFC' }}
          />
          <button onClick={handleSendCode} style={{ backgroundColor: '#FF6B00', color: '#FDFFFC' }}>Send</button>
        </section>
      }
      <p style={{ color: '#FDFFFC' }}> Test Redux : {userData.login} </p>
      <div style={{ color: '#FDFFFC' }}>User data: {JSON.stringify(userData)}</div>
    </div>
  );
}

export default ConnectPage;


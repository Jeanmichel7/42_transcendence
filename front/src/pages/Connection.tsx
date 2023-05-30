import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { check2FACookie, check2FACode } from '../api/auth'
import { getUserData } from '../api/user';
import { getBlockedUsers, getFriends } from '../api/relation';

import { setUser, setLogged, reduxSetFriends, reduxSetUserBlocked } from '../store/userSlice'
import { FormControl, InputLabel, Input, FormHelperText, Box, TextField, OutlinedInput, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function ConnectPage() {
  let navigate = useNavigate();

  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [userId, setUserId] = useState(0);
  const [code2FA, setCode2FA] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Wrong code");
  const [loading, setLoading] = useState(false);

  // const userData: any = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch()

  //check if 2FA is activated
  useEffect(() => {
    async function fetchAndSetIs2FAactived() {
      try {
        const res = await check2FACookie();
        if (res.is2FAactived) {
          setIs2FAactiv(res.is2FAactived);
          setUserId(res.user.id);
        }
        else {
          await saveUserData();
          // await new Promise(r => setTimeout(r, 10000)); wait 10s
          navigate('/home');
        }
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    }
    fetchAndSetIs2FAactived();
  }, []);

  //save user data in redux
  async function saveUserData() {
    const res = await getUserData();
    const friends = await getFriends();
    const userBlocked = await getBlockedUsers();
    dispatch(setUser(res));
    dispatch(setLogged(true));
    dispatch(reduxSetFriends(friends));
    dispatch(reduxSetUserBlocked(userBlocked));
  }

  //send code to server
  async function handleSendCode() {
    if (!loading) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 300));
    }

    //check code
    code2FA.length !== 6 ? setErrorMsg('Code must be 6 digits') :
    !(/^[0-9]{6}$/).test(code2FA) ? setErrorMsg('Code must be digits') :
    setErrorMsg('Wrong Code');

    const res = await check2FACode(code2FA, userId);
    setLoading(false);
    if (res.error) {
      setError(true);
    }
    else {
      setError(false);
      await saveUserData();
      // await new Promise(r => setTimeout(r, 20000)); //wait 20s
      navigate('/home');
    }
  }




  return (
    <>
      {is2FAactiv &&
        <section className="w-full flex flex-col">
          <h1 className='font-mono font-bold text-xl text-center mb-5'>2FA Authentification</h1>
          <div className='mx-auto '>
            <FormControl
              error={error}
            >
              <InputLabel htmlFor="component-outlined">Code</InputLabel>
              <OutlinedInput
                className=''
                id="component-outlined"
                placeholder="123456"
                label="Name"
                onChange={(e) => setCode2FA(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleSendCode() } }}
              />
              <FormHelperText id="component-error-text">
                {error && errorMsg}
              </FormHelperText>
            </FormControl>
          </div>
          <div className='m-auto mt-1'>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant="contained"
              onClick={handleSendCode}
              disabled={loading}
              endIcon={<SendIcon />}
            > Send </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'blue',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
            </Box>
          </div>
        </section>
      }
    </>
  );
}

export default ConnectPage;

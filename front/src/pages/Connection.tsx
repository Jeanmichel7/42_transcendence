import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { check2FACookie, check2FACode } from '../api/auth';
import { getUserData } from '../api/user';
import { getBlockedUsers, getFriends } from '../api/relation';

import { setUser, setLogged, reduxSetFriends, reduxSetUserBlocked } from '../store/userSlice';
import { FormControl, InputLabel, FormHelperText, Box, OutlinedInput, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Api2FAResponse, ApiErrorResponse, ApiLogin2FACode, ConversationInterface, NotificationInterface, UserActionInterface, UserInterface } from '../types';
import { setErrorSnackbar } from '../store/snackbarSlice';
import { reduxSetNotifications } from '../store/notificationSlice';
import { reduxSetConversationList } from '../store/convListSlice';
import { StyledLink } from '../components/Chat/Conversation/style';
import styled from 'styled-components';

function ConnectPage() {

  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [userIsConnected, setUserIsConnected] = useState(false);
  const [userId, setUserId] = useState(0);
  const [code2FA, setCode2FA] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Wrong code');
  const [isLoading, setIsLoading] = useState(false);

  // const userData: any = useSelector((state: any) => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchData = useCallback(async function <T extends UserInterface | UserInterface[]>(
    apiFunction: () => Promise<T | ApiErrorResponse>,
    action: ((payload: T) => UserActionInterface),
  ): Promise<void> {
    const result: T | ApiErrorResponse = await apiFunction();
    if ('error' in result) {
      dispatch(setErrorSnackbar(result.error + result.message ? ': ' + result.message : ''));
    } else {
      dispatch(action(result));
    }
  }, [dispatch]);

  //save user data in redux
  const saveUserData = useCallback(async function (id: number) {
    dispatch(setLogged(true));
    dispatch(reduxSetNotifications(
      localStorage.getItem('notifications' + id)
        ? JSON.parse(localStorage.getItem('notifications' + id) as string)
        : [] as NotificationInterface[],
    ));
    dispatch(reduxSetConversationList(
      localStorage.getItem('conversationsList' + id)
        ? JSON.parse(localStorage.getItem('conversationsList' + id) as string)
        : [] as ConversationInterface[],
    ));
    await fetchData(getUserData, setUser);
    await fetchData(getFriends, reduxSetFriends);
    await fetchData(getBlockedUsers, reduxSetUserBlocked);
  }, [dispatch, fetchData]);





  const fetchAndSetIs2FAactived = useCallback(async () => {
    setIsLoading(true);
    const res: Api2FAResponse | ApiErrorResponse = await check2FACookie();
    // console.log('res : ', res);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      if (res.is2FAactived) {
        setIs2FAactiv(res.is2FAactived);
        setUserId(res.user.id);
      } else {
        await saveUserData(res.user.id);
        setUserIsConnected(true);
        // navigate('/home');
      }
    }
  }, [dispatch, navigate, saveUserData]);

  //check if 2FA is activated
  useEffect(() => {
    fetchAndSetIs2FAactived();
  }, [dispatch, fetchAndSetIs2FAactived, navigate, saveUserData]);




  //listen event from popup
  // const handleEventFromMain = useCallback( async ( event: MessageEvent<string> ) => {
  //   if (event.origin !== 'http://localhost:3006') return;
  //   if (!userIsConnected) return;

  //   console.log('user connected ');
  //   await new Promise(r => setTimeout(r, 2000)); // pour faire beau
  //   // faire un truc avant de fermer la popup ?
  //   window.opener.postMessage('user connected', 'http://localhost:3006');
  // }, [userIsConnected]);

  useEffect(() => {
    if (userIsConnected)
      window.opener.postMessage('user connected', 'http://localhost:3006');
  }, [userIsConnected]);





  //send code to server
  async function handleSendCode() {
    setErrorMsg(
      code2FA.length !== 6 ? 'Code must be 6 digits' :
        !(/^[0-9]{6}$/).test(code2FA) ? 'Code must be digits' : 'Wrong Code',
    );

    const res: ApiLogin2FACode | ApiErrorResponse = await check2FACode(code2FA, userId);
    if ('error' in res) {
      setError(true);
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      setError(false);
      await saveUserData(userId);
      setUserIsConnected(true);
      // navigate('/home');
    }
  }

  const handleOAuthConnection = () => {
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code';
  };

  const handleFakeConnection = () => {
    window.location.href = 'http://localhost:3006/fakeconnection';
  };

  const TitleWrapper = styled.div`
  height: 200px;
  width: 80%;
  position: absolute;
  left: 20%;
  top: 20%;
  overflow: hidden;
  align-items: baseline;
  display: flex;
  flex-direction: line;
  @media (max-width: 768px) {
    flex-direction: column;
    height: 400px;
  }
`;

  return (
    <>
      <TitleWrapper>
        <StyledLink onClick={handleOAuthConnection} >
          Login as a 42 student
        </StyledLink>
        <StyledLink onClick={handleFakeConnection} >
          Login as fake user
        </StyledLink>
      </TitleWrapper>
      {/* <Link to="/fakeconnection">
          <Button sx={{ my: 2, color: 'white', display: 'block' }}>
            Login Fake
          </Button>
        </Link> */}

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
              onKeyDown={(e) => { if (e.key === 'Enter') { handleSendCode(); } }}
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
              disabled={isLoading}
              endIcon={<SendIcon />}
            > Send </Button>
            {isLoading && (
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

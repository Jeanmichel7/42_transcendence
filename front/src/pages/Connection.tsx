import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { check2FACookie, check2FACode } from '../api/auth';
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  OutlinedInput,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Api2FAResponse, ApiErrorResponse, ApiLogin2FACode } from '../types';
import { setErrorSnackbar } from '../store/snackbarSlice';
import cuteBallsClimbingVines from '../assets/cuteBallsClimbingVines.png';

function ConnectPage() {
  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [userId, setUserId] = useState(0);
  const [code2FA, setCode2FA] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Wrong code');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const checked = queryParams.get('checked');

  const fetchAndSetIs2FAactived = useCallback(async () => {
    setIsLoading(true);
    const res: Api2FAResponse | ApiErrorResponse = await check2FACookie();
    console.log('res check need 2FA: ', res);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
    } else {
      if (res.is2FAactived) {
        setIs2FAactiv(res.is2FAactived);
        setUserId(res.user.id);
      } else {
        window.opener.postMessage(
          { msg: 'user connected', id: res.user.id },
          'http://k1r2p6:3006',
        );
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  //check if 2FA is activated
  useEffect(() => {
    if (checked == 'true') {
      fetchAndSetIs2FAactived();
    }
  }, [fetchAndSetIs2FAactived, checked]);

  //send code to server
  async function handleSendCode() {
    setErrorMsg(
      code2FA.length !== 6
        ? 'Code must be 6 digits'
        : !/^[0-9]{6}$/.test(code2FA)
        ? 'Code must be digits'
        : 'Wrong Code',
    );

    setIsLoading(true);
    const res: ApiLogin2FACode | ApiErrorResponse = await check2FACode(
      code2FA,
      userId,
    );
    console.log('res check 2FA : ', res);
    if ('error' in res) {
      setError(true);
      // dispatch(setErrorSnackbar(res));
    } else {
      setError(false);
      window.opener.postMessage(
        { msg: 'user connected', id: userId },
        'http://k1r2p6:3006',
      );
    }
    setIsLoading(false);
  }
  const urlOAuth = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Fk1r2p6%3A3000%2Fauth%2FloginOAuth&response_type=code'
  // const urlOAuth =
  //   'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Fk1r2p6%3A3000%2Fauth%2FloginOAuth&response_type=code';

  return (
    <>
      {is2FAactiv ? (
        <>
          <div className="absolute top-0 right-0 text-blue-500 m-5">
            <Link to="/accountconnection">Login Account</Link>
          </div>

          <div className="absolute top-0 text-blue-500 left-0 m-5">
            <Link to="/connection" onClick={() => setIs2FAactiv(false)}>
              Retour
            </Link>
          </div>

          <section className="w-full flex flex-col justify-center items-center">
            <h1 className="font-mono font-bold text-xl text-center m-5">
              2FA Authentification
            </h1>
            <FormControl error={error}>
              <InputLabel htmlFor="component-outlined">Code 2FA</InputLabel>
              <OutlinedInput
                id="component-outlined"
                placeholder="123456"
                label="code 2FA"
                onChange={e => setCode2FA(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSendCode();
                  }
                }}
              />
              <FormHelperText id="component-error-text">
                {error && errorMsg}
              </FormHelperText>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSendCode}
              disabled={isLoading}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
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
          </section>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="background.default"
          style={{ backgroundColor: 'var(--background-color)', zIndex: 10 }}
        >
          <Paper
            elevation={3}
            style={{
              padding: '50px',
              borderRadius: '5px',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Typography
              variant="h4"
              align="center"
              style={{ marginBottom: '40px' }}
            >
              Connection via
            </Typography>

            <Link to={urlOAuth}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginBottom: '15px' }}
              >
                Intra
              </Button>
            </Link>

            <Link to="/accountconnection">
              <Button variant="contained" color="secondary" fullWidth>
                Account
              </Button>
            </Link>
          </Paper>
          <img
            src={cuteBallsClimbingVines}
            alt="illustration"
            className="absolute h-2/3 l-2/3"
          />
        </Box>
      )}
    </>
  );
}

export default ConnectPage;

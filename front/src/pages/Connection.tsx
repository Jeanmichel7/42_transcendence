import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { check2FACookie, check2FACode } from '../api/auth';

import {
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  OutlinedInput,
  Button,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Api2FAResponse, ApiErrorResponse, ApiLogin2FACode } from '../types';
import { setErrorSnackbar } from '../store/snackbarSlice';

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
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
    } else {
      if (res.is2FAactived) {
        setIs2FAactiv(res.is2FAactived);
        setUserId(res.user.id);
      } else {
        window.opener.postMessage(
          { msg: 'user connected', id: res.user.id },
          'http://localhost:3006',
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

    if ('error' in res) {
      setError(true);
      dispatch(setErrorSnackbar(res));
    } else {
      setError(false);
      window.opener.postMessage(
        { msg: 'user connected', id: userId },
        'http://localhost:3006',
      );
    }
    setIsLoading(false);
  }

  const handleOAuthConnection = () => {
    window.location.href =
      'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code';
  };

  const handleFakeConnection = () => {
    window.location.href = 'http://localhost:3006/fakeconnection';
  };

  // const TitleWrapper = styled.div`
  //   height: 200px;
  //   width: 80%;
  //   position: absolute;
  //   left: 20%;
  //   top: 20%;
  //   overflow: hidden;
  //   align-items: baseline;
  //   display: flex;
  //   flex-direction: line;
  //   @media (max-width: 768px) {
  //     flex-direction: column;
  //     height: 400px;
  //   }
  // `;

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        padding={3}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOAuthConnection}
          sx={{ marginBottom: 2 }}
        >
          Login as a 42 student
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleFakeConnection}
        >
          Login as fake user
        </Button>
      </Box>

      {is2FAactiv && (
        <section className="w-full flex flex-col">
          <h1 className="font-mono font-bold text-xl text-center mb-5">
            2FA Authentification
          </h1>
          <div className="mx-auto ">
            <FormControl error={error}>
              <InputLabel htmlFor="component-outlined">Code</InputLabel>
              <OutlinedInput
                className=""
                id="component-outlined"
                placeholder="123456"
                label="Name"
                onChange={(e) => setCode2FA(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendCode();
                  }
                }}
              />
              <FormHelperText id="component-error-text">
                {error && errorMsg}
              </FormHelperText>
            </FormControl>
          </div>
          <div className="m-auto mt-1">
            <Box sx={{ m: 1, position: 'relative' }}>
              <Button
                variant="contained"
                onClick={handleSendCode}
                disabled={isLoading}
                endIcon={<SendIcon />}
              >
                {' '}
                Send{' '}
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
            </Box>
          </div>
        </section>
      )}
    </>
  );
}

export default ConnectPage;

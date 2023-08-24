import { useCallback, useEffect, useState } from 'react';
import {
  ApiLogin2FACode,
  ApiErrorResponse,
  UserInterface,
  Api2FAResponse,
} from '../types';
import { check2FACode, check2FACookie, loginOAuth } from '../api/auth';
import {
  Button,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
  FormControl,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setErrorSnackbar } from '../store/snackbarSlice';
import SendIcon from '@mui/icons-material/Send';

const OAuthRedirect = () => {
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
  const code = queryParams.get('code');

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
          window.location.origin,
        );
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  const fetchloginOAuth = useCallback(async () => {
    setIsLoading(true);
    const res: UserInterface | ApiErrorResponse = await loginOAuth(
      code as string,
    );
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
    } else {
      fetchAndSetIs2FAactived();
    }
    setIsLoading(false);
  }, [code, dispatch, fetchAndSetIs2FAactived]);

  //check if 2FA is activated
  useEffect(() => {
    if (!code) return;
    if (checked == 'true') {
      fetchAndSetIs2FAactived();
    } else {
      fetchloginOAuth();
    }
  }, [fetchAndSetIs2FAactived, checked, fetchloginOAuth, code]);

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
      // dispatch(setErrorSnackbar(res));
    } else {
      setError(false);
      window.opener.postMessage(
        { msg: 'user connected', id: userId },
        window.location.origin,
      );
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="absolute top-0 right-0 text-blue-500 m-5 font-extrabold">
        <Link to="/accountconnection">Login Account</Link>
      </div>

      <div className="absolute top-0 text-blue-500 left-0 m-5 font-extrabold">
        <Link to="/connection" onClick={() => setIs2FAactiv(false)}>
          Retour
        </Link>
      </div>
      {is2FAactiv ? (
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
      ) : (
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
    </>
  );
};

export default OAuthRedirect;

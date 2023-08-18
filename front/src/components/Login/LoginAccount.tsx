import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
  check2FACode,
  check2FACookie,
  loginFakeUser,
  registerFakeUser,
} from '../../api/auth';
import { useDispatch } from 'react-redux';
import {
  Api2FAResponse,
  ApiErrorResponse,
  ApiLogin2FACode,
  AuthInterface,
  UserInterface,
} from '../../types';
import { setErrorSnackbar } from '../../store/snackbarSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';

import { VisibilityOff, Visibility } from '@mui/icons-material';

export interface FormDataUser {
  login: string;
  password: string;
  pwdConfirm?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  description?: string;
  avatar?: string;
}

interface LoginAccountProps {
  setUserCreated: React.Dispatch<
    React.SetStateAction<UserInterface | undefined>
  >;
  userCreated: UserInterface | undefined;
  generateUser: () => FormDataUser;
}

export default function LoginAccount({
  setUserCreated,
  userCreated,
  generateUser,
}: LoginAccountProps) {
  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [userId, setUserId] = useState(0);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Wrong code');
  const [errorLogin, setErrorLogin] = useState<string[]>([]);
  const [isLoading2FA, setIsLoading2FA] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingConn, setIsLoadingConn] = useState(false);
  const dispatch = useDispatch();

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [formDataLogin, setFormDataLogin] = useState({
    login: '',
    password: 'Password1!',
  } as FormDataUser);

  const handleChangeFormLogin = (e: any) => {
    const { name, value } = e.target;
    setFormDataLogin(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!userCreated) return;
    setFormDataLogin(prevState => ({
      ...prevState,
      login: userCreated.login,
    }));
  }, [userCreated]);

  const createUsers = async () => {
    const data: FormDataUser = generateUser();
    setIsLoadingCreate(true);
    const res: UserInterface | ApiErrorResponse = await registerFakeUser(data);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
      return null;
    }
    setUserCreated(res);
    setFormDataLogin(prevState => ({
      ...prevState,
      login: res.login,
    }));
    setIsLoadingCreate(false);
  };

  // CONNECTION

  const fetchAndSetIs2FAactived = useCallback(async () => {
    setIsLoading2FA(true);
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
          'http://k1r2p6:3006',
        );
      }
    }
    setIsLoading2FA(false);
  }, [dispatch]);

  function getErrorForFieldLogin(field: string) {
    if (!errorLogin || errorLogin.length === 0) return '';

    const allError: string[] = [];
    for (const err of errorLogin) {
      if (err.toLowerCase().includes(field.toLowerCase())) {
        allError.push(err);
      }
    }
    return allError.join('\n');
  }

  const handleConnection = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    setIsLoadingConn(true);
    const res: AuthInterface | ApiErrorResponse = await loginFakeUser(
      formDataLogin,
    );

    if ('error' in res) {
      if (typeof res.message === 'string')
        setErrorLogin([res.message as string]);
      else if (Array.isArray(res.message))
        setErrorLogin(res.message as string[]);
      else setErrorLogin(['Undefined error']);
      dispatch(setErrorSnackbar(res));
    } else {
      setErrorLogin([]);
      await fetchAndSetIs2FAactived();
    }
    setIsLoadingConn(false);
  };

  async function handleSendCode() {
    setErrorMsg(
      code2FA.length !== 6
        ? 'Code must be 6 digits'
        : !/^[0-9]{6}$/.test(code2FA)
        ? 'Code must be digits'
        : 'Wrong Code',
    );

    setIsLoading2FA(true);
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
        'localhost:3006',
      );
    }
    setIsLoading2FA(false);
  }

  return (
    <div className="w-4/12 mr-2">
      <h2 className="text-2xl font-bold text-center">Log in</h2>
      <div className="w-full text-center">
        <Box
          component="form"
          onSubmit={handleConnection}
          sx={{
            '& > :not(style)': { m: 1 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            id="field-login_login"
            type="text"
            name="login"
            label="Login"
            value={formDataLogin.login}
            variant="outlined"
            onChange={handleChangeFormLogin}
            helperText={getErrorForFieldLogin('login')}
            error={!!getErrorForFieldLogin('login')}
            onKeyDown={e => {
              if (e.key === 'Enter') handleConnection(e);
            }}
          />
          <TextField
            id="field-login_pwd"
            name="password"
            type={showPasswordLogin ? 'text' : 'password'}
            label="Password"
            value={formDataLogin.password}
            variant="outlined"
            onChange={handleChangeFormLogin}
            onKeyDown={e => {
              if (e.key === 'Enter') handleConnection(e);
            }}
            helperText={
              getErrorForFieldLogin('password') ||
              'Keep the password for autogen users'
            }
            error={!!getErrorForFieldLogin('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                    edge="end"
                  >
                    {showPasswordLogin ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className="flex items-center justify-center ">
            <Button
              variant="contained"
              color="warning"
              onClick={createUsers}
              disabled={isLoadingCreate}
              sx={{ mx: 1 }}
            >
              Auto
              {isLoadingCreate && <CircularProgress size={16} sx={{ ml: 1 }} />}
            </Button>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              // onClick={handleConnection}
            >
              Connection
              {isLoadingConn && <CircularProgress size={16} sx={{ ml: 1 }} />}
            </Button>
          </div>

          {userCreated && (
            <div className="flex flex-col">
              <div className="flex justify-center items-center">
                <CheckCircleIcon color="success" />
                <p className="text-center text-green-600 font-bold ml-1 ">
                  Created {userCreated.login}
                </p>
              </div>
            </div>
          )}
        </Box>

        {is2FAactiv && (
          <section className="w-full flex flex-col">
            <h1 className="font-mono font-bold text-xl text-center m-5">
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
            </div>
            <div className="m-auto mt-1">
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  onClick={handleSendCode}
                  disabled={isLoading2FA}
                >
                  Send
                  {isLoading2FA ? (
                    <CircularProgress size={16} sx={{ ml: 1 }} />
                  ) : (
                    <SendIcon />
                  )}
                </Button>
              </Box>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

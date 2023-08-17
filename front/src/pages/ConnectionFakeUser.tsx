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
import { useCallback, useState } from 'react';
import {
  check2FACode,
  check2FACookie,
  loginFakeUser,
  registerFakeUser,
} from '../api/auth';
import { useDispatch } from 'react-redux';
import {
  Api2FAResponse,
  ApiErrorResponse,
  ApiLogin2FACode,
  AuthInterface,
  UserInterface,
} from '../types';
import { setErrorSnackbar } from '../store/snackbarSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';

// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { Link } from 'react-router-dom';
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

export default function FakeConnection() {
  const [usersCreated, setUsersCreated] = useState<UserInterface>();

  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [userId, setUserId] = useState(0);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Wrong code');
  const [errorSignin, setErrorSignin] = useState<string[]>([]);
  const [errorLogin, setErrorLogin] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [formDataLogin, setFormDataLogin] = useState({
    login: '',
    password: 'Password1!',
  } as FormDataUser);

  const [showPassword1Form, setShowPassword1Form] = useState(false);
  const [showPassword2Form, setShowPassword2Form] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    pwdConfirm: '',
    email: '',
    firstName: '',
    lastName: '',
    description: '',
    avatar: 'http://localhost:3000/avatars/defaultAvatar.png',
  } as FormDataUser);

  const handleChangeFormLogin = (e: any) => {
    const { name, value } = e.target;
    setFormDataLogin(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormCreateAccountChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const generateUser = (): FormDataUser => {
    const genders: ('male' | 'female')[] = ['male', 'female'];
    const randomGender = genders[Math.floor(Math.random() * 10) % 2];

    const firstNameG = faker.person
      .firstName(randomGender)
      .replaceAll('.', '')
      .padEnd(3, Math.random().toString(36).substring(2, 3));
    const lastNameG = faker.person
      .lastName(randomGender)
      .replaceAll('.', '')
      .padEnd(3, Math.random().toString(36).substring(2, 3));
    const loginG = faker.internet
      .userName({
        firstName: firstNameG,
        lastName: lastNameG,
      })
      .replaceAll('.', '')
      .padEnd(3, Math.random().toString(36).substring(2, 3));
    const emailG = faker.internet.email({
      firstName: firstNameG,
      lastName: lastNameG,
    });
    const avatarG = faker.image.urlLoremFlickr({
      // width: 128,
      // height: 128,
      category: 'people',
    });

    const data: FormDataUser = {
      firstName: firstNameG,
      lastName: lastNameG,
      login: loginG,
      email: emailG,
      password: 'Password1!',
      description: faker.lorem.sentence(),
      avatar: avatarG,
    };
    return data;
  };

  async function createFakeUser(): Promise<UserInterface | null> {
    const data: FormDataUser = generateUser();
    const res: UserInterface | ApiErrorResponse = await registerFakeUser(data);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
      return null;
    } else return res;
  }

  const handleAutoFilForm = () => {
    const data: FormDataUser = generateUser();
    data.pwdConfirm = data.password;
    setFormData(data);
  };

  async function createUsers() {
    for (let i = 0; i < 1; i++) {
      const res = await createFakeUser();
      if (!res) return;
      setUsersCreated(res);
      // if (i == 0) {
      //   setLogin(res.login);
      //   setPassword('Password1!');
      // }
      setFormDataLogin(prevState => ({
        ...prevState,
        login: res.login,
      }));
    }
  }

  // CONNECTION

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

  const handleSubmitCreateAccount = async (
    e?:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (e) e.preventDefault();
    if (formData.password !== formData.pwdConfirm) {
      setErrorSignin(['password confirm not match']);
      return;
    }
    const res: UserInterface | ApiErrorResponse = await registerFakeUser(
      formData,
    );
    if ('error' in res) {
      // dispatch(setErrorSnackbar(res));
      setErrorSignin(res.message as string[]);
      return null;
    } else {
      setUsersCreated(res);
      setFormDataLogin(prevState => ({
        ...prevState,
        login: res.login,
      }));
      setFormData({
        login: '',
        password: '',
        pwdConfirm: '',
        email: '',
        firstName: '',
        lastName: '',
        description: '',
      });
      setErrorSignin([]);
      return res;
    }
  };

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

  function getErrorForField(field: string) {
    if (!errorSignin || errorSignin.length === 0) return '';

    const allError: string[] = [];
    for (const err of errorSignin) {
      if (err.toLowerCase().includes(field.toLowerCase())) {
        allError.push(err);
      }
    }
    return allError.join('\n');
  }

  const handleCancelCreateAccount = () => {
    setFormData({
      login: '',
      password: '',
      pwdConfirm: '',
      email: '',
      firstName: '',
      lastName: '',
      description: '',
    });
    setErrorSignin([]);
  };

  const handleConnection = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    const res: AuthInterface | ApiErrorResponse = await loginFakeUser(
      formDataLogin,
    );
    if ('error' in res) {
      // if (typeof res.message === 'string' && res.message.includes('2FA')) {
      //   setIs2FAactiv(true);
      //   setUserId(res.userId);
      // }
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
  };

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
        'http://localhost:3006',
      );
    }
    setIsLoading(false);
  }

  window.opener.postMessage({ msg: 'resize', width: 900, height: 600 }, '*');

  return (
    <div className="bg-inherit">
      {/* link prev page */}
      <div className="absolute top-0 right-0 m-5 text-blue-500">
        <Link to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code">
          Login Intra
        </Link>
      </div>

      <div className="absolute top-0 left-0 m-5 text-blue-500">
        <Link to="/connection">Retour</Link>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-5">Account connection</h1>
      </div>

      <div className="flex justify-around">
        <div className="w-7/12 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center">Sign in</h2>

          <Box
            component="form"
            onSubmit={handleSubmitCreateAccount}
            sx={{
              '& .MuiTextField-root': { m: 1 },
            }}
            // noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="field-login"
                type="text"
                name="login"
                value={formData.login}
                label="Login"
                placeholder="Login"
                variant="outlined"
                onChange={handleFormCreateAccountChange}
                autoComplete="Login"
                helperText={getErrorForField('login')}
                error={!!getErrorForField('login')}
              />
              <TextField
                id="field-email"
                type="email"
                name="email"
                value={formData.email}
                label="Email"
                placeholder="exemple@mail.com"
                variant="outlined"
                onChange={handleFormCreateAccountChange}
                helperText={getErrorForField('email')}
                error={!!getErrorForField('email')}
              />
            </div>
            <div>
              <TextField
                id="field-firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                label="First name"
                placeholder="First name"
                variant="outlined"
                onChange={handleFormCreateAccountChange}
                helperText={getErrorForField('first name')}
                error={!!getErrorForField('first name')}
              />
              <TextField
                id="field-lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                label="Last name"
                placeholder="Last name"
                variant="outlined"
                onChange={handleFormCreateAccountChange}
                helperText={getErrorForField('last name')}
                error={!!getErrorForField('last name')}
              />
            </div>
            <div className="mr-4">
              <TextField
                fullWidth
                id="field-pwd"
                label="Password"
                type={showPassword1Form ? 'text' : 'password'}
                name="password"
                placeholder="Password1!"
                value={formData.password}
                variant="outlined"
                onChange={handleFormCreateAccountChange}
                autoComplete="Password1!"
                helperText={getErrorForField('password')}
                error={!!getErrorForField('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword1Form(!showPassword1Form)}
                        edge="end"
                      >
                        {showPassword1Form ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="mr-4">
              <TextField
                fullWidth
                id="field-pwdConfirm"
                label="Password"
                type={showPassword2Form ? 'text' : 'password'}
                name="pwdConfirm"
                value={formData.pwdConfirm}
                variant="outlined"
                onChange={handleFormCreateAccountChange}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSubmitCreateAccount(e);
                }}
                helperText={getErrorForField('confirm')}
                error={!!getErrorForField('confirm')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword2Form(!showPassword2Form)}
                        edge="end"
                      >
                        {showPassword2Form ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelCreateAccount}
                sx={{ mx: 1 }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="warning"
                sx={{ mx: 1 }}
                onClick={handleAutoFilForm}
              >
                Auto
              </Button>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mx: 1 }}
              >
                Create
              </Button>
            </div>
          </Box>
        </div>

        <div className="border-l-2"></div>

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
                  sx={{ mx: 1 }}
                >
                  Auto
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // onClick={handleConnection}
                >
                  Connection
                </Button>
              </div>

              {usersCreated && (
                <div className="flex flex-col">
                  <div className="flex justify-center items-center">
                    <CheckCircleIcon color="success" />
                    <p className="text-center text-green-600 font-bold ml-1 ">
                      Created {usersCreated.login}
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
          </div>
        </div>
      </div>
    </div>
  );
}

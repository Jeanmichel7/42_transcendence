import { Box, Button, CircularProgress, FormControl, FormHelperText, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { check2FACode, check2FACookie, loginFakeUser, registerFakeUser } from '../api/auth';
import { useDispatch } from 'react-redux';
import { Api2FAResponse, ApiErrorResponse, ApiLogin2FACode, AuthInterface, UserInterface } from '../types';
import { setErrorSnackbar } from '../store/snackbarSlice';
import SendIcon from '@mui/icons-material/Send';

// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { Link } from 'react-router-dom';

export default function FakeConnection() {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('Password1!');
  const [usersCreated, setUsersCreated] = useState<UserInterface[]>([]);

  const [is2FAactiv, setIs2FAactiv] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  const [userId, setUserId] = useState(0);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Wrong code');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

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
        window.opener.postMessage({ msg:'user connected', id: res.user.id }, 'http://localhost:3006');
      }
    }
    setIsLoading(false);
  }, [dispatch]);

  const handleConnection = async (
    e: React.FormEvent<HTMLFormElement> |
    React.MouseEvent<HTMLButtonElement, MouseEvent> |
    React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();

    const res: AuthInterface | ApiErrorResponse = await loginFakeUser(login, password);
    if ('error' in res)
      dispatch(setErrorSnackbar(res));
    else
      await fetchAndSetIs2FAactived();
  };

  async function handleSendCode() {
    setErrorMsg(
      code2FA.length !== 6 ? 'Code must be 6 digits' :
        !(/^[0-9]{6}$/).test(code2FA) ? 'Code must be digits' : 'Wrong Code',
    );

    setIsLoading(true);
    const res: ApiLogin2FACode | ApiErrorResponse = await check2FACode(code2FA, userId);

    if ('error' in res) {
      setError(true);
      dispatch(setErrorSnackbar(res));
    } else {
      setError(false);
      window.opener.postMessage({ msg:'user connected', id: userId }, 'http://localhost:3006');
    }
    setIsLoading(false);
  }


  // fack user generator
  async function createUser(): Promise<UserInterface | null> {
    const data = {
      'firstName': faker.person.firstName(),
      'lastName': faker.person.lastName(),
      'login': faker.internet.userName(),
      'email': faker.internet.email(),
      'password': 'Password1!',
      'description': faker.lorem.sentence(),
      'avatar': faker.image.avatar(),
    };

    const res: UserInterface | ApiErrorResponse = await registerFakeUser(data);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
      return null;
    } else
      return res;

  }

  async function createUsers() {
    for (let i = 0; i < 1; i++) {
      const res = await createUser();
      if (!res) return;
      setUsersCreated(prev => [...prev, res]);
    }
  }

  // useEffect(() => {
  //   if (userIsConnected)
  //     window.opener.postMessage({msg:'user connected', id: -1}, 'http://localhost:3006');
  // }, [userIsConnected]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* link prev page */}
      <div className="absolute top-0 right-0 m-5">
        <Link to='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code'>
          Login Intra
        </Link>
      </div>


      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-5">Fake Connection</h1>
      </div>

      <h2 className="text-2xl font-bold text-center">
        Generate a fake users
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={createUsers}
        sx={{ my: 1 }}
      >
        Generate
      </Button>

      <div className='w-full text-center'>
        <Box
          component="form"
          onSubmit={handleConnection}
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Login"
            defaultValue={usersCreated.length > 0 ? usersCreated[0].login : 'user1'}
            variant="outlined"
            onChange={handleLoginChange}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            defaultValue={'Password1!'}
            variant="outlined"
            onChange={handlePasswordChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConnection(e); }}
            helperText="keep the default password"
          />
          <Button
            variant="contained"
            color="primary"
            type='submit'
            // onClick={handleConnection}
          >
            Connection
          </Button>

        </Box>
      </div>

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

      {usersCreated.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold">Users created</h2>
          <ul>
            {usersCreated.map((u) => (
              <li key={u.id}>{u.login}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

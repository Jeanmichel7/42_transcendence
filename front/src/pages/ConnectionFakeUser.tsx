import { Box, Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { loginFakeUser, registerFakeUser } from '../api/auth';
import { useDispatch } from 'react-redux';
import { ApiErrorResponse, AuthInterface, ConversationInterface, NotificationInterface, UserActionInterface, UserInterface } from '../types';
import { setErrorSnackbar } from '../store/snackbarSlice';
import { getUserData } from '../api/user';
import { reduxSetFriends, reduxSetUserBlocked, setLogged, setUser } from '../store/userSlice';
import { getBlockedUsers, getFriends } from '../api/relation';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { reduxSetNotifications } from '../store/notificationSlice';
import { reduxSetConversationList } from '../store/convListSlice';

export default function FakeConnection() {
  const [login, setLogin] = useState<string>('login1');
  const [password, setPassword] = useState<string>('Password1!');
  const [usersCreated, setUsersCreated] = useState<UserInterface[]>([]);

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
    await fetchData(getUserData, setUser);
    await fetchData(getFriends, reduxSetFriends);
    await fetchData(getBlockedUsers, reduxSetUserBlocked);
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

  }, [dispatch, fetchData]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConnection = async () => {
    const res: AuthInterface | ApiErrorResponse = await loginFakeUser(login, password);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    } else {
      await saveUserData(res.user.id);
      navigate('/home');
    }
  };


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
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
      return null;
    } else
      return res;

  }

  async function createUsers() {
    for (let i = 0; i < 10; i++) {
      const res = await createUser();
      if (!res) return;
      setUsersCreated(prev => [...prev, res]);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-5">Fake Connection</h1>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Generate 10 fake users</h2>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={createUsers}
          >
            Generate
          </Button>
        </Box>
      </div>

      <div>
        <h2 className="text-2xl font-bold">Login</h2>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Login"
            defaultValue={'login1'}
            variant="outlined"
            onChange={handleLoginChange}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            defaultValue={'Password1!'}
            variant="outlined"
            onChange={handlePasswordChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleConnection(); }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnection}
          >
            Connection
          </Button>

        </Box>
      </div>

      {usersCreated.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold">Users created</h2>
          <ul>
            {usersCreated.map((u, i) => (
              <li key={i}>{u.login}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

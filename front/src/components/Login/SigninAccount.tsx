import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { registerFakeUser } from '../../api/auth';
import { ApiErrorResponse, UserInterface } from '../../types';

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

interface SigninAccountProps {
  setUserCreated: React.Dispatch<
    React.SetStateAction<UserInterface | undefined>
  >;
  generateUser: () => FormDataUser;
}

export default function SigninAccount({
  setUserCreated,
  generateUser,
}: SigninAccountProps) {
  const [errorSignin, setErrorSignin] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    avatar: 'k1r2p6:3000/avatars/defaultAvatar.png',
  } as FormDataUser);

  const handleFormCreateAccountChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAutoFilForm = () => {
    const data: FormDataUser = generateUser();
    data.pwdConfirm = data.password;
    setFormData(data);
  };

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
    setIsLoading(true);
    const res: UserInterface | ApiErrorResponse = await registerFakeUser(
      formData,
    );
    if ('error' in res) {
      // dispatch(setErrorSnackbar(res));
      setErrorSignin(res.message as string[]);
    } else {
      setUserCreated(res);
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
    }
    setIsLoading(false);
  };

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

  return (
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
          {isLoading && <p>Loading</p>}

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
  );
}

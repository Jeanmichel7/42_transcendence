import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { RootState } from '../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { ApiErrorResponse, ApiLogin2FACode, UserInterface } from '../../types';

import { Active2FA, Desactive2FA, check2FACode } from '../../api/auth';
import { patchUserAccount } from '../../api/user';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Input from '@mui/material/Input';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogProps,
  FormControl,
  FormHelperText,
  Switch,
  TextField,
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import DoneIcon from '@mui/icons-material/Done';

interface ItemProps {
  keyName: string;
  value: string | number | boolean | undefined;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<DialogProps, typeof Dialog>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AccountItem({ keyName, value }: ItemProps) {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState<boolean>(false);
  const [editPwd, setEditPwd] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<
    string | number | boolean | undefined
  >(value);
  const [inputOldPwd, setInputOldPwd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [QRCode, setQRCode] = useState<string>();
  const [userCode, setUserCode] = useState<string>('');
  const [error2FA, setError2FA] = useState<boolean>(false);
  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData,
  );

  async function handleClose2FA(): Promise<void> {
    const res: ApiLogin2FACode | ApiErrorResponse = await check2FACode(
      userCode,
      userData.id,
    );
    if ('error' in res) {
      setError2FA(true);
    } else {
      setError2FA(false);
      setQRCode('');
      setUserCode('');
      setMsgSnackbar('2FA actived!');
      localStorage.removeItem('2FA'); //bad idea
    }
  }

  async function handleForm(): Promise<void> {
    await new Promise(r => setTimeout(r, 300));

    const formData: FormData = new FormData();
    formData.append(keyName, inputValue as string);
    if (keyName === 'password') formData.append('oldPassword', inputOldPwd);

    setLoading(true);
    const updatedUser: UserInterface | ApiErrorResponse =
      await patchUserAccount(formData);
    setLoading(false);

    if ('error' in updatedUser) {
      setError(updatedUser.message as string);
      dispatch(setErrorSnackbar(updatedUser));
      setInputValue(value);
    } else {
      dispatch(setUser({ ...userData, [keyName]: inputValue }));
      setError('');
      setEdit(false);
      dispatch(setMsgSnackbar('Updated!'));
    }
  }

  function handleClose() {
    setEdit(false);
    setInputValue(value);
    if (keyName == 'password') setEditPwd(false);
  }

  function parseKeyName(valueKeyname: string | number | boolean) {
    if (typeof valueKeyname === 'string') {
      const tmp =
        valueKeyname.substring(0, 1).toUpperCase() + valueKeyname.substring(1);
      return tmp.replace(/([A-Z])/g, ' $1').replace('Active 2 F A', '2FA');
    }
    if (typeof valueKeyname === 'number') {
      return valueKeyname;
    }
    if (typeof valueKeyname === 'boolean') {
      return valueKeyname ? 'true' : 'false';
    }
  }

  async function handleChange2FA() {
    if (inputValue) {
      // disable 2FA
      localStorage.removeItem('2FA');
      setInputValue(false);
      const res: UserInterface | ApiErrorResponse = await Desactive2FA();
      if ('error' in res) {
        dispatch(setErrorSnackbar(res));
      } else {
        setInputValue(false);
        setQRCode('');
        setUserCode('');
        setError2FA(false);
      }
    } else {
      // enable 2FA
      const res: string | ApiErrorResponse = await Active2FA();
      if (typeof res === 'object' && 'error' in res) {
        dispatch(setErrorSnackbar(res));
      } else {
        localStorage.setItem('2FA', res);
        setQRCode(res);
        setInputValue(true);
      }
    }
  }

  useEffect(() => {
    if (keyName === 'Active 2FA') {
      if (localStorage.getItem('2FA')) {
        setQRCode(localStorage.getItem('2FA') as string);
        setInputValue(true);
      }
    }
  }, [keyName]);

  return (
    <div className="flex items-center w-full pb-3 ">
      <div className="w-1/4">
        <h2 className="font-bold"> {parseKeyName(keyName)} </h2>
      </div>

      {/* Display or Input */}
      <div className="w-1/2">
        {!edit ? (
          <>
            {typeof value === 'string' && keyName != 'password' && (
              <p> {inputValue} </p>
            )}
            {typeof value === 'number' && <p> {inputValue} </p>}
            {typeof value === 'boolean' && (
              <p> {inputValue ? 'Actived' : 'Desactived'} </p>
            )}
          </>
        ) : (
          <FormControl variant="standard" className="w-full">
            <Input
              id={keyName + '_id'}
              aria-describedby={keyName + '_text'}
              className="w-full "
              defaultValue={value}
              onChange={e => {
                setInputValue(e.target.value);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') handleForm();
              }}
            />
            <FormHelperText
              id={keyName + '_text'}
              color="error"
              sx={{ color: 'red' }}
              error={error != '' ? true : false}
            >
              {error}
            </FormHelperText>
          </FormControl>
        )}

        {keyName == 'password' && (
          <>
            {!editPwd ? (
              <p> ********** </p>
            ) : (
              <div className="w-full">
                <FormControl variant="standard" className="w-full">
                  <Input
                    id={'oldPwd' + '_id'}
                    aria-describedby={'oldPwd' + '_text'}
                    className="w-full"
                    name="oldPwd"
                    placeholder="old password"
                    // defaultValue={value}
                    onChange={e => {
                      setInputOldPwd(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl variant="standard" className="w-full">
                  <Input
                    id={keyName + '_id'}
                    name="pwd"
                    aria-describedby={keyName + '_text'}
                    className="w-full"
                    // defaultValue={value}
                    placeholder="new password"
                    onChange={e => {
                      setInputValue(e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleForm();
                    }}
                  />
                  <FormHelperText
                    id={keyName + '_text'}
                    color="error"
                    sx={{ color: 'red' }}
                    error={error != '' ? true : false}
                  >
                    {error}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="w-auto ml-auto">
        {!edit && !editPwd ? (
          // Class button or Switch
          keyName == 'Active 2FA' ? (
            <Switch
              checked={typeof inputValue === 'boolean' ? inputValue : false}
              onChange={handleChange2FA}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : keyName == 'password' ? (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setEditPwd(true);
                }}
              >
                <EditOutlinedIcon />
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              onClick={() => {
                setEdit(true);
              }}
            >
              <EditOutlinedIcon />
            </Button>
          )
        ) : (
          <span className="flex">
            <Button
              variant="outlined"
              // loading={loading}
              disabled={loading}
              onClick={() => {
                handleForm();
              }}
            >
              <DoneIcon />
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              <CloseIcon htmlColor="red" />
            </Button>
          </span>
        )}
      </div>

      <Dialog
        TransitionComponent={Transition}
        keepMounted
        open={QRCode ? true : false}
        onClose={handleChange2FA}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="flex flex-col justify-center items-center">
          <DialogTitle id="alert-dialog-title">
            Scan QRCode with your 2FA app
          </DialogTitle>
          <DialogContent sx={{ p: 0, m: 0 }}>
            <div className="border-2 border-blue-100 rounded-md mb-2">
              <img src={QRCode} alt="QRCode" />
            </div>
            <TextField
              fullWidth
              label="Enter the code"
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleClose2FA();
              }}
            />
            <FormHelperText
              id="component-helper-text"
              color="error"
              sx={{ color: 'red' }}
              error={error2FA ? true : false}
            >
              {error2FA ? 'Code invalide' : null}
            </FormHelperText>
          </DialogContent>
          <DialogActions sx={{ pb: 3, m: 0 }}>
            <Button onClick={handleClose2FA} autoFocus variant="outlined">
              Activate
            </Button>
            <Button variant="outlined" onClick={handleChange2FA} color="error">
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}

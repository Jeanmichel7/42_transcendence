import React, { useEffect, useState } from 'react';
import { Button, Dialog, FormControl, FormHelperText, InputLabel, Switch, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Input from '@mui/material/Input';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { TransitionProps } from '@mui/material/transitions';
import { patchUserAccount } from '../../api/user';
import { Active2FA, Desactive2FA, check2FACode } from '../../api/auth';
import Slide from '@mui/material/Slide';
import { AccountProps } from './AccountProfile';
import { useSelector } from 'react-redux';

interface ItemProps {
  keyName: string;
  value: string | number | boolean;
  setUserProfile: (user: any) => any;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AccountItem({ keyName, value, setUserProfile }: ItemProps) {
  // console.log(keyName, value)
  const [edit, setEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string | number | boolean>(value);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [QRCode, setQRCode] = useState<string>('');
  // const [validCode, setValidCode] = useState<boolean>(false);
  const [userCode, setUserCode] = useState<string>('');
  const [error2FA, setError2FA] = useState<boolean>(false);

  const userData: any = useSelector((state: any) => state.user.userData);


  async function handleClose2FA() {
    const res = await check2FACode(userCode, userData.id)
    if (res.error) {
      setError2FA(true)
    } else {
      setError2FA(false)
      setQRCode('');
      setUserCode('');
      // setValidCode(false);
    }
  }

  async function handleForm() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300));
    const res = await patchUserAccount({
      [keyName]: inputValue
    })
    if (res.error) {
      setError(res.message)
      setInputValue(value)
    }
    else {
      setUserProfile((prevUser: AccountProps) => ({
        ...prevUser,
        [keyName]: inputValue,
      }));
      setError(false)
      setEdit(false)
    }
    setLoading(false)
  }

  function handleClose() {
    setEdit(false)
    setInputValue(value)
  }

  function parseKeyName(value: string | number | boolean) {
    if (typeof value === 'string') {
      let tmp = value.substring(0, 1).toUpperCase() + value.substring(1)
      return tmp.replace(/([A-Z])/g, ' $1').replace(/2 F A/, '2FA')
    }
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }
  }



  async function handleChange2FA() {
    if (inputValue) {
      // disable 2FA
      setInputValue(false)
      const res = await Desactive2FA()
      if (res.error) {
        console.log("error : ", res)
      }
      else {
        setInputValue(false)
        setQRCode('')
      }
    }
    else {
      // enable 2FA
      const res = await Active2FA()
      if (res.error) {
        console.log("error : ", res)
      }
      else {
        setQRCode(res)
        setInputValue(true)
      }
    }
  }


  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className="flex items-center w-full pb-3">
      <div className="w-1/4">
        <h2> {parseKeyName(keyName)} </h2>
      </div>

      {/* Display or Input */}
      <div className="w-1/2"> {!edit ?
        <>
          {typeof value === 'string' && <p> {inputValue} </p>}
          {typeof value === 'number' && <p> {inputValue} </p>}
          {typeof value === 'boolean' && <p> {inputValue ? 'true' : 'false'} </p>}
        </> 
        :
        <FormControl variant="standard">
          {/* <InputLabel htmlFor="component-helper">Name</InputLabel> */}
          <Input
            id="component-helper"
            aria-describedby="component-helper-text"
            className="w-full"
            defaultValue={value}
            onChange={(e) => { setInputValue(e.target.value) }}
            autoFocus
          />
          <FormHelperText
            id="component-helper-text"
            color="error"
            sx={{ color: 'red' }}
            error={error ? true : false}
          >
            {error}
          </FormHelperText>
        </FormControl>
      } </div>

      {/* Buttons */}
      <div className="w-auto ml-auto"> {!edit ?
        // Class button or Switch
        keyName == 'Active 2FA' ?
          <Switch
            checked={typeof inputValue === 'boolean' ? inputValue : false}
            onChange={handleChange2FA}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          :
          <Button variant="outlined" onClick={() => { setEdit(true) }} >
            <EditOutlinedIcon />
          </Button>
        :
        <span className='flex'>
          <LoadingButton
            endIcon={<SendIcon />}
            variant="outlined"
            loading={loading}
            onClick={() => { handleForm() }}
          >
            Modifier
          </LoadingButton>
          <Button variant="outlined" onClick={handleClose} >
            <CloseIcon htmlColor='red' />
          </Button>
        </span>
      } </div>

      <Dialog 
        TransitionComponent={Transition}
        keepMounted
        open={QRCode ? true : false}
        // onClose={() => { handleClose2FA }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Scan GoogleAuthentificator"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img src={QRCode} alt="QRCode" />
          </DialogContentText>
          <TextField
            label="Enter the code"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            onKeyDown={(e) => {e.key === 'Enter' ? handleClose2FA() : null}}
          />
          <FormHelperText
            id="component-helper-text"
            color="error"
            sx={{ color: 'red' }}
            error={error2FA ? true : false}
          >
            {error2FA? "Code invalide" : null}
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleChange2FA }>
            Cancel
          </Button>
          <Button onClick={ handleClose2FA } autoFocus>
            Activate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

}

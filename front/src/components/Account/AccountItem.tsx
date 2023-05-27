import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormHelperText, InputLabel, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Input from '@mui/material/Input';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';

import { patchUserAccount } from '../../api/user';
import { AccountProps } from '../../pages/Account';

interface ItemProps {
  keyName: string;
  value: string | number | boolean;
  setUserProfile: (user: any) => any;
}


export default function AccountItem({ keyName, value, setUserProfile }: ItemProps) {

  const [edit, setEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string | number | boolean>(value);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

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
      setUserProfile((prevUser: AccountProps ) => ({
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
      return tmp

    }
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
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
        </> :
        <FormControl variant="standard">
          {/* <InputLabel htmlFor="component-helper">Name</InputLabel> */}
          <Input
            id="component-helper"
            aria-describedby="component-helper-text"
            className="w-full"
            defaultValue={value}
            onChange={(e) => { setInputValue(e.target.value) }}
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
    </div>
  )

}

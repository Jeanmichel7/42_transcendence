import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { getAllUsers } from '../../../api/user';
import { requestAddFriend } from '../../../api/relation';

import { ApiErrorResponse, UserInterface, UserRelation } from '../../../types';

import FriendCard from '../../Profile/FriendsCard';

import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';
import { reduxAddWaitingFriendsSent } from '../../../store/userSlice';


export default function FriendsSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const allUsers: UserInterface[] | ApiErrorResponse = await getAllUsers();
      setIsLoading(false);

      if ('error' in allUsers)
        dispatch(setErrorSnackbar('Error get users: ' + allUsers.error));
      else {
        const resFiltered = allUsers.filter((u: UserInterface) =>
          u.id != userData.id &&
          !userData.friends?.find((f: UserInterface) => f.id === u.id) &&
          !userData.userBlocked?.find((f: UserInterface) => f.id === u.id) &&
          !userData.waitingFriendsRequestSent?.find((f: UserInterface) => f.id === u.id),
        );
        setUsers(resFiltered);
      }
      setSelectedUser(null);
    }
    fetchUsers();
  }, [userData.id,
    userData.friends,
    dispatch,
    userData.userBlocked,
    userData.waitingFriendsRequestSent,
  ]);


  function isMyFriend(userId: number): boolean {
    return !!userData.friends?.find((friend: UserInterface) => friend.id === userId);
  }

  const handleRequestAddFriend = async (user: UserInterface | null) => {
    if (!user)
      return;
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(user.id);
    if ('error' in res)
      dispatch(setErrorSnackbar('Error add friend: ' + res.error));
    else {
      dispatch(reduxAddWaitingFriendsSent(user));
      dispatch(setMsgSnackbar('Request sent'));
      setSelectedUser(null);
    }
  };
  if (isLoading) {
    return <CircularProgress />;
  }
  if (!userData || !users)
    return <p>Loading...</p>;
  

  return (
    <div className="m-5 p-5 h-full">
      <div className='flex'>
      <Autocomplete
          id="searchFriends"
          fullWidth
          options={users}
          getOptionLabel={(option: UserInterface) => option.login}
          onChange={(event: React.ChangeEvent<object>, newValue: UserInterface | null) => {
            event.stopPropagation();
            setSelectedUser(newValue);
          }}
          value={selectedUser}
          renderInput={(params) => <TextField {...params} label="Search Friends" variant="outlined" />}
        />
        <Button
          onClick={() => handleRequestAddFriend(selectedUser)}
          variant="contained"
        > Add </Button>
      </div>


      <div className='h-full'>
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex flex-wrap overflow-auto max-h-[calc(100vh-520px)]">
          {users.map((user: UserInterface) => {
            if (user.id != userData.id && !isMyFriend(user.id))
              return (
                <FriendCard
                  key={user.id}
                  friend={user}
                />
              );
          })}
        </div>
      </div>

    </div>
  );
}

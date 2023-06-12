import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';
import { reduxAddWaitingFriendsSent } from '../../../store/userSlice';

import { getAllUsers } from '../../../api/user';
import { requestAddFriend } from '../../../api/relation';

import { ApiErrorResponse, UserInterface, UserRelation } from '../../../types';

import FriendCard from '../../Profile/FriendsCard';


import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';

export default function FriendsSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const { userData, userFriends, userBlocked, waitingFriendsRequestSent } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const allUsers: UserInterface[] | ApiErrorResponse = await getAllUsers();
      setIsLoading(false);

      if ('error' in allUsers)
        dispatch(setErrorSnackbar(allUsers.error + allUsers.message ? ': ' + allUsers.message : ''));
      else {
        const resFiltered = allUsers.filter((u: UserInterface) =>
          u.id != userData.id &&
          !userFriends?.find((f: UserInterface) => f.id === u.id) &&
          !userBlocked?.find((f: UserInterface) => f.id === u.id) &&
          !waitingFriendsRequestSent?.find((f: UserInterface) => f.id === u.id),
        );
        setUsers(resFiltered);
      }
      setSelectedUser(null);
    }
    fetchUsers();
  }, [dispatch,,
    userData.id,
    userFriends,
    userBlocked,
    waitingFriendsRequestSent,
  ]);


  function isMyFriend(userId: number): boolean {
    return !!userFriends?.find((friend: UserInterface) => friend.id === userId);
  }

  const handleRequestAddFriend = async (user: UserInterface | null) => {
    if (!user)
      return;
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(user.id);
    if ('error' in res)
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
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
    <div className="h-full">
      <div className='flex p-3 border'>
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
          color="primary"
          sx={{ ml: 2, height: '40px', alignSelf: 'center' }}
        > Add </Button>
      </div>

      <div className="flex flex-wrap justify-center overflow-auto max-h-[calc(100vh-320px)] px-2">
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
  );
}

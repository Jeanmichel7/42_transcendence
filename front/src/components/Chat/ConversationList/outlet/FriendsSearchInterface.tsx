import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  setErrorSnackbar,
  setMsgSnackbar,
} from '../../../../store/snackbarSlice';
import { reduxAddWaitingFriendsSent } from '../../../../store/userSlice';

import FriendCard from '../../../Profile/FriendsCard';
import { getAllUsersCount, getAllUsersPaginate } from '../../../../api/user';
import { requestAddFriend } from '../../../../api/relation';
import {
  ApiErrorResponse,
  UserInterface,
  UserRelation,
} from '../../../../types';

import {
  Autocomplete,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
} from '@mui/material';

export default function FriendsSearch({ setHeight }: { setHeight: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = React.useState<UserInterface[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

  const topRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const { userData, userFriends, userBlocked, waitingFriendsRequestSent } =
    useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchTotalUsers() {
      const res: number | ApiErrorResponse = await getAllUsersCount();
      if (typeof res != 'number' && 'error' in res)
        dispatch(setErrorSnackbar(res));
      else setTotalPages(Math.ceil(res / userPerPage));
    }
    async function fetchUsers() {
      if (
        !userData ||
        !userFriends ||
        !userBlocked ||
        !waitingFriendsRequestSent
      )
        return;
      setIsLoading(true);
      const allUsers: UserInterface[] | ApiErrorResponse =
        await getAllUsersPaginate(currentPage, userPerPage);
      setIsLoading(false);

      if ('error' in allUsers) dispatch(setErrorSnackbar(allUsers));
      else {
        const resFiltered = allUsers.filter(
          (u: UserInterface) =>
            u.id != userData.id &&
            !userFriends?.find((f: UserInterface) => f.id === u.id) &&
            !userBlocked?.find((f: UserInterface) => f.id === u.id),
        );
        setUsers(resFiltered);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      setSelectedUser(null);
    }
    fetchTotalUsers();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, waitingFriendsRequestSent, currentPage, userPerPage]);

  function isMyFriend(userId: number): boolean {
    if (!userFriends) return false;
    return !!userFriends?.find((friend: UserInterface) => friend.id === userId);
  }

  const handleRequestAddFriend = async (user: UserInterface | null) => {
    if (!user) return;
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(
      user.id,
    );
    if ('error' in res) dispatch(setErrorSnackbar(res));
    else {
      dispatch(reduxAddWaitingFriendsSent(user));
      dispatch(setMsgSnackbar('Request sent'));
      setSelectedUser(null);
    }
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const handleChangeUserPerPage = (event: any) => {
    setUserPerPage(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex p-3 border">
        <Autocomplete
          id="searchFriends"
          fullWidth
          options={users.filter(
            (u: UserInterface) =>
              !waitingFriendsRequestSent?.find(
                (f: UserInterface) => f.id === u.id,
              ),
          )}
          getOptionLabel={(option: UserInterface) => option.login}
          onChange={(
            event: React.ChangeEvent<object>,
            newValue: UserInterface | null,
          ) => {
            event.stopPropagation();
            setSelectedUser(newValue);
          }}
          value={selectedUser}
          renderInput={params => (
            <TextField {...params} label="Search Friends" variant="outlined" />
          )}
        />
        <Button
          onClick={() => handleRequestAddFriend(selectedUser)}
          variant="contained"
          color="primary"
          disabled={!selectedUser || isLoading}
          sx={{
            ml: 2,
            height: '40px',
            alignSelf: 'center',
            visibility:
              !selectedUser || isMyFriend(selectedUser.id)
                ? 'hidden'
                : 'visible',
          }}
        >
          Add
        </Button>
      </div>
      {isLoading && (
        <CircularProgress
          size={100}
          color="primary"
          sx={{
            position: 'absolute',
            top: '25%',
            left: '50%',
          }}
        />
      )}
      <div
        className={`flex flex-wrap justify-center items-center
        overflow-auto ${setHeight ? 'max-h-[calc(100vh-202px)]' : ''} px-2`}
      >
        <div ref={topRef} />
        {users.map((user: UserInterface) => {
          if (user.id != userData.id && user.id != 0 && !isMyFriend(user.id))
            return <FriendCard key={user.id} friend={user} />;
        })}
      </div>

      <div className="flex-grow"></div>

      {/* Pagination  */}
      <div className="flex relative justify-center py-2">
        <Stack spacing={2}>
          <Pagination count={totalPages} onChange={handleChangePage} />
        </Stack>
        <div className="absolute right-2">
          <Select
            value={userPerPage}
            onChange={handleChangeUserPerPage}
            label="Cards per page"
            sx={{ height: '35px' }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
      </div>
    </>
  );
}

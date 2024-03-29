import { useCallback, useEffect, useState } from 'react';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../api/user';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { RootState } from '../../store';
import { CircularProgress } from '@mui/material';
import FriendItem from './FriendItem';
import { requestAddFriend } from '../../api/relation';
import { reduxAddWaitingFriendsSent } from '../../store/userSlice';

const AddFriendsRaw = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const { userData, userFriends, userBlocked, waitingFriendsRequestSent } =
    useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const allUsersFetched: UserInterface[] | ApiErrorResponse =
      await getAllUsers();
    setIsLoading(false);

    if ('error' in allUsersFetched) dispatch(setErrorSnackbar(allUsersFetched));
    else {
      const resFiltered = allUsersFetched.filter(
        (u: UserInterface) =>
          u.id != 0 &&
          u.id != userData.id &&
          !userFriends?.find((f: UserInterface) => f.id === u.id) &&
          !userBlocked?.find((f: UserInterface) => f.id === u.id) &&
          !waitingFriendsRequestSent?.find((f: UserInterface) => f.id === u.id),
      );
      setAllUsers(resFiltered);
    }
  }, [
    dispatch,
    userData.id,
    userFriends,
    userBlocked,
    waitingFriendsRequestSent,
  ]);

  useEffect(() => {
    if (
      userData.id == -1 ||
      !userFriends ||
      !userBlocked ||
      !waitingFriendsRequestSent
    )
      return;
    fetchUsers();
  }, [
    dispatch,
    userData.id,
    userFriends,
    userBlocked,
    waitingFriendsRequestSent,
    userData,
    fetchUsers,
  ]);

  const handleRequestAddFriend = async (user: UserInterface | null) => {
    if (!user) return;

    setIsLoading(true);
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(
      user.id,
    );
    setIsLoading(false);

    if ('error' in res) dispatch(setErrorSnackbar(res));
    else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(user));
    }
  };


  return (
    <div
      className="justify-center items-center
      overflow-auto max-h-[calc(100vh-168px)] px-2"
    >
      {userData.id == -1 ||
      !userFriends ||
      !userBlocked ||
      !waitingFriendsRequestSent ? (
        <p>Loading...</p>
      ) : (
        allUsers?.map(user => (
          <FriendItem
            key={user.id}
            user={user}
            actions={[{ name: 'Add', callback: handleRequestAddFriend }]}
            isLoading={isLoading}
          />
        ))
      )}
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default AddFriendsRaw;

import { useEffect, useState } from 'react';
import { ApiErrorResponse, UserInterface, UserRelation } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../api/user';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { RootState } from '../../store';
import { CircularProgress } from '@mui/material';
import FriendItem from './FriendItem';
import { requestAddFriend } from '../../api/relation';
import { reduxAddWaitingFriendsSent } from '../../store/userSlice';


//todo pagination for all users

const AddFriends = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);
  const { userData, userFriends, userBlocked, waitingFriendsRequestSent } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();


  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const allUsersFetched: UserInterface[] | ApiErrorResponse = await getAllUsers();
      setIsLoading(false);
      
      if ('error' in allUsersFetched)
        dispatch(setErrorSnackbar(allUsersFetched.error + allUsersFetched.message ? ': ' + allUsersFetched.message : ''));
      else {
        const resFiltered = allUsersFetched.filter((u: UserInterface) =>
          u.id != userData.id &&
          !userFriends?.find((f: UserInterface) => f.id === u.id) &&
          !userBlocked?.find((f: UserInterface) => f.id === u.id) &&
          !waitingFriendsRequestSent?.find((f: UserInterface) => f.id === u.id),
        );
        setAllUsers(resFiltered);
      }
    }
    fetchUsers();
  }, [ dispatch, userData.id, userFriends, userBlocked, waitingFriendsRequestSent,
  ]);

  const handleRequestAddFriend = async (user: UserInterface | null) => {
    if (!user)
      return;

    setIsLoading(true);
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(user.id);
    setIsLoading(false);

    if ('error' in res)
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(user));
    }
  };

  return (
    <>
      { !allUsers && <p>Loading...</p>}
      { allUsers?.map((user) => (
        <FriendItem 
            key={user.id}
            user={user}
            actions={[
              { name: 'Add', callback: handleRequestAddFriend },
            ]}
          />
      ))}
      { isLoading && <CircularProgress />}
    </>
  );
};

export default AddFriends;


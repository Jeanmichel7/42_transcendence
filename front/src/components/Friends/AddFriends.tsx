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
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
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
          !userData.friends?.find((f: UserInterface) => f.id === u.id) &&
          !userData.userBlocked?.find((f: UserInterface) => f.id === u.id) &&
          !userData.waitingFriendsRequestSent?.find((f: UserInterface) => f.id === u.id),
        );
        setAllUsers(resFiltered);
      }
    }
    fetchUsers();
  }, [userData.id,
    userData.friends,
    dispatch,
    userData.waitingFriendsRequestSent,
    userData.userBlocked],
  );

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

  if (isLoading) {
    return <CircularProgress />;
  }
  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      { allUsers?.map((user) => (
        <FriendItem 
            key={user.id}
            user={user}
            actions={[
              { name: 'Add', callback: handleRequestAddFriend },
            ]}
          />
      ))}
    </>
  );
};

export default AddFriends;


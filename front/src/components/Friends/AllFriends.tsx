import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

import { apiBlockUser, deleteFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { UserInterface, ApiErrorResponse, UserRelation } from '../../types';

import { CircularProgress } from '@mui/material';
import { reduxAddUserBlocked, reduxRemoveFriends } from '../../store/userSlice';
import { useState } from 'react';
import FriendItem from './FriendItem';
import { useNavigate } from 'react-router-dom';

const AllFriends = () => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBlockUser = async (userToBlock: UserInterface) => {
    setIsLoading(true);
    const resBlockRequest: UserRelation | ApiErrorResponse = await apiBlockUser(userToBlock.id);
    setIsLoading(false);

    if ('error' in resBlockRequest)
      dispatch(setErrorSnackbar(resBlockRequest.error + resBlockRequest.message ? ': ' + resBlockRequest.message : ''));
    else {
      dispatch(reduxAddUserBlocked(userToBlock));
      dispatch(setMsgSnackbar('User blocked'));
    }
  };

  const handleDeleteFriend = async (userToDelete: UserInterface) => {
    setIsLoading(true);
    const resDeleteRequest: void | ApiErrorResponse = await deleteFriend(userToDelete.id);
    setIsLoading(false);

    if (typeof resDeleteRequest === 'object' && 'error' in resDeleteRequest)
      dispatch(setErrorSnackbar(resDeleteRequest.error + resDeleteRequest.message ? ': ' + resDeleteRequest.message : ''));
    else {
      dispatch(reduxRemoveFriends(userToDelete));
      dispatch(setMsgSnackbar('Friend deleted'));
    }
  };

  const handleNavigateToChat = (user: UserInterface) => {
    navigate(`/chat?service=chat&userId=${user.id}`);
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      { userData.friends?.length === 0 && <p> No friends</p> }
      { userData.friends?.map((user) => (
        <FriendItem 
         key={user.id}
          user={user}
          actions={[
            { name: 'Chat', callback: handleNavigateToChat },
            { name: 'Block', callback: handleBlockUser },
            { name: 'Delete', callback: handleDeleteFriend },
          ]}
        />
      ))}
    </>
  );
};

export default AllFriends;
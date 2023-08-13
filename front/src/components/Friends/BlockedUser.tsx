import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';
import { ApiErrorResponse, UserInterface } from '../../types';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { apiUnblockUser } from '../../api/relation';
import { RootState } from '../../store';
import { reduxRemoveUserBlocked } from '../../store/userSlice';
import FriendItem from './FriendItem';
import { Nothing } from './Nothing';

const BlockedUser = () => {
  const { userBlocked } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUnblockUser = async (userToUnblock: UserInterface) => {
    setIsLoading(true);
    const resUnblockRequest: void | ApiErrorResponse = await apiUnblockUser(
      userToUnblock.id,
    );
    setIsLoading(false);

    if (typeof resUnblockRequest === 'object' && 'error' in resUnblockRequest)
      dispatch(setErrorSnackbar(resUnblockRequest));
    else {
      dispatch(reduxRemoveUserBlocked(userToUnblock.id));
      dispatch(setMsgSnackbar('User unblocked'));
    }
  };

  return (
    <>
      {!userBlocked && <p>Loading...</p>}
      {userBlocked?.length === 0 && <Nothing angry text="No blocked user" />}
      {userBlocked?.map(user => (
        <FriendItem
          key={user.id}
          user={user}
          actions={[{ name: 'Unblock', callback: handleUnblockUser }]}
          isLoading={isLoading}
        />
      ))}
      {isLoading && <CircularProgress />}
    </>
  );
};
export default BlockedUser;

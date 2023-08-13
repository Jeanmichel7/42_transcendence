import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelFriendRequest } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import { UserInterface, ApiErrorResponse } from '../../types';
import { RootState } from '../../store';
import { reduxRemoveWaitingFriendsSent } from '../../store/userSlice';
import FriendItem from './FriendItem';
import { Nothing } from './Nothing';

const WaitingRequestSent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { waitingFriendsRequestSent } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch = useDispatch();

  const handleCancelFriendRequest = async (userToCancel: UserInterface) => {
    setIsLoading(true);
    const resCancelRequest: void | ApiErrorResponse = await cancelFriendRequest(
      userToCancel.id,
    );
    setIsLoading(false);

    if (typeof resCancelRequest === 'object' && 'error' in resCancelRequest)
      dispatch(
        setErrorSnackbar(
          resCancelRequest.error + resCancelRequest.message
            ? ': ' + resCancelRequest.message
            : '',
        ),
      );
    else {
      dispatch(reduxRemoveWaitingFriendsSent(userToCancel));
      dispatch(setMsgSnackbar('Friend request canceled'));
    }
  };

  return (
    <>
      {!waitingFriendsRequestSent && <p>Loading...</p>}
      {waitingFriendsRequestSent?.length === 0 && (
        <Nothing text="No friend request sent" />
      )}
      {waitingFriendsRequestSent?.map(user => (
        <FriendItem
          key={user.id}
          user={user}
          actions={[{ name: 'Cancel', callback: handleCancelFriendRequest }]}
          isLoading={isLoading}
        />
      ))}
      {isLoading && <CircularProgress />}
    </>
  );
};
export default WaitingRequestSent;

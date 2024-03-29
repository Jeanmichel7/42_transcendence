import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { acceptFriend, declineFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import {
  UserInterface,
  ApiErrorResponse,
  UserRelation,
  NotificationInterface,
} from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  reduxAddFriends,
  reduxRemoveWaitingFriends,
} from '../../store/userSlice';
import { reduxRemoveNotification } from '../../store/notificationSlice';
import FriendItem from './FriendItem';
import { Nothing } from './Nothing';

import { reduxAddConversationList } from '../../store/convListSlice';

const WaitingAcceptRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userData, waitingFriendsRequestReceived } = useSelector(
    (state: RootState) => state.user,
  );
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );
  const dispatch = useDispatch();

  const handleAcceptFriendRequest = async (userToAccept: UserInterface) => {
    setIsLoading(true);
    const resAcceptRequest: UserRelation | ApiErrorResponse =
      await acceptFriend(userToAccept.id);
    setIsLoading(false);

    if ('error' in resAcceptRequest)
      dispatch(setErrorSnackbar(resAcceptRequest));
    else {
      dispatch(reduxRemoveWaitingFriends(userToAccept));
      dispatch(reduxAddFriends(userToAccept));
      dispatch(
        reduxAddConversationList({ item: userToAccept, userId: userData.id }),
      );

      //search notif ans delete
      const notif: NotificationInterface = notifications.find(
        n =>
          n.type === 'friendRequest' &&
          n.sender.id === userToAccept.id &&
          n.receiver.id === userData.id,
      ) as NotificationInterface;
      if (notif)
        dispatch(
          reduxRemoveNotification({
            notifId: notif.id,
            userId: userData.id,
          }),
        );

      dispatch(setMsgSnackbar('Friend request accepted'));
    }
  };

  const handleDeclineFriendRequest = async (userToDecline: UserInterface) => {
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineFriend(
      userToDecline.id,
    );
    setIsLoading(false);

    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest));
    else {
      dispatch(reduxRemoveWaitingFriends(userToDecline));

      //search notif ans delete
      const notif: NotificationInterface = notifications.find(
        n =>
          n.type === 'friendRequest' &&
          n.sender.id === userToDecline.id &&
          n.receiver.id === userData.id,
      ) as NotificationInterface;
      if (notif)
        dispatch(
          reduxRemoveNotification({
            notifId: notif.id,
            userId: userData.id,
          }),
        );

      dispatch(setMsgSnackbar('Friend request declined'));
    }
  };

  return (
    <>
      {!waitingFriendsRequestReceived && <p>Loading...</p>}
      {waitingFriendsRequestReceived?.length === 0 && (
        <Nothing text="No waiting request received" />
      )}
      {waitingFriendsRequestReceived?.map(user => (
        <FriendItem
          key={user.id}
          user={user}
          actions={[
            { name: 'Accept', callback: handleAcceptFriendRequest },
            { name: 'Decline', callback: handleDeclineFriendRequest },
          ]}
          isLoading={isLoading}
        />
      ))}
      {isLoading && <CircularProgress />}
    </>
  );
};

export default WaitingAcceptRequest;

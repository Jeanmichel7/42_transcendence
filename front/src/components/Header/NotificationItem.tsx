import {
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Zoom,
} from '@mui/material';
import {
  ApiErrorResponse,
  GameInterface,
  NotificationInterface,
  UserInterface,
  UserRelation,
} from '../../types';
import { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { acceptFriend, declineFriend } from '../../api/relation';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';
import {
  reduxAddFriends,
  reduxRemoveWaitingFriends,
} from '../../store/userSlice';
import {
  reduxAddConversationList,
  reduxRemoveWaitingUserInRoom,
} from '../../store/convListSlice';
import {
  reduxReadNotification,
  reduxRemoveNotification,
} from '../../store/notificationSlice';
import { RootState } from '../../store';
import { readNotification } from '../../api/notification';
import { declineRoom } from '../../api/chat';
import { acceptGame, declineGame } from '../../api/game';

interface NotificationItemProps {
  notification: NotificationInterface;
  setNotifOpen: React.Dispatch<boolean>;
}

const NotificationItem = ({
  notification,
  setNotifOpen,
}: NotificationItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state: RootState) => state.user);
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );

  /* helper action FriendShip action */
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
    else dispatch(reduxRemoveWaitingFriends(userToDecline));
  };

  const handleDeclineJoinRoom = async (notif: NotificationInterface) => {
    const extractRoomId: number = parseInt(
      notif.invitationLink?.split('/')[4] as string,
    );
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineRoom(
      extractRoomId,
    );
    setIsLoading(false);

    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest));
    else {
      dispatch(
        reduxRemoveWaitingUserInRoom({
          roomId: extractRoomId,
          userId: userData.id,
        }),
      );
      dispatch(setMsgSnackbar('Room invitation declined'));
    }
  };

  /* helper action Game action */
  const handleAcceptGameInvite = async (notif: NotificationInterface) => {
    const extractGameId: number = parseInt(
      notif.invitationLink?.split('?id=')[1] as string,
    );

    setIsLoading(true);
    const resAcceptRequest: GameInterface | ApiErrorResponse = await acceptGame(
      extractGameId,
    );
    if ('error' in resAcceptRequest)
      dispatch(setErrorSnackbar(resAcceptRequest));
    else {
      navigate(notif.invitationLink ? notif.invitationLink : '/chat');
    }
    setIsLoading(false);
  };

  const handleDeclineGameInvitation = async (notif: NotificationInterface) => {
    const extractGameId: number = parseInt(
      notif.invitationLink?.split('?id=')[1] as string,
    );
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineGame(
      extractGameId,
    );
    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest));
    setIsLoading(false);
  };

  const handleGameInvitationAccepted = async (notif: NotificationInterface) => {
    const extractGameId: number = parseInt(
      notif.invitationLink?.split('?id=')[1] as string,
    );
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineGame(
      extractGameId,
    );
    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest));
    setIsLoading(false);
  };

  /* action notif */
  const handleClickNotification = () => {
    if (notification.type === 'friendRequest')
      navigate('/friends?tab=waiting_received');
  };

  const handleClickNotificationUser = () => {
    navigate('/profile/' + notification.sender.login);
  };

  const handleDeleteNotification = () => {
    if (notifications.length == 1) setNotifOpen(false);
    console.log('notifications : ', notifications.length);
    dispatch(
      reduxRemoveNotification({
        notifId: notification.id,
        userId: userData.id,
      }),
    );
  };

  const handleAcceptActionNotification = async () => {
    if (notification.type === 'friendRequest')
      await handleAcceptFriendRequest(notification.sender);
    if (notification.type === 'roomInvite')
      navigate(
        notification.invitationLink ? notification.invitationLink : '/chat',
      );
    if (notification.type === 'gameInvite')
      await handleAcceptGameInvite(notification);
    if (notification.type === 'gameInviteAccepted')
      navigate(
        notification.invitationLink ? notification.invitationLink : '/chat',
      );
    handleDeleteNotification();
  };

  const handleDenyActionNotification = async () => {
    if (notification.type === 'friendRequest')
      await handleDeclineFriendRequest(notification.sender);
    if (notification.type === 'roomInvite')
      await handleDeclineJoinRoom(notification);
    if (notification.type === 'gameInvite')
      await handleDeclineGameInvitation(notification);
    if (notification.type === 'gameInviteAccepted')
      await handleGameInvitationAccepted(notification);
    handleDeleteNotification();
  };

  //handler mouse notif
  const handleMouseEnter = async () => {
    setNotifOpen(true);
    const resReadNotif: void | ApiErrorResponse = await readNotification(
      notification.id,
    );
    if (typeof resReadNotif === 'object' && 'error' in resReadNotif)
      dispatch(setErrorSnackbar(resReadNotif));
    else dispatch(reduxReadNotification(notification));
  };

  const handleMouseLeave = () => {
    setNotifOpen(false);
  };

  return (
    <div
      className={`flex justify-between items-center border-y-[1px] border-gray-300 max-w-[600px] py-1
      ${notification.read ? 'bg-gray-100' : 'bg-gray-200'}
    `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-center items-center flex-grow overflow-hidden whitespace-nowrap text-overflow-ellipsis">
        <p className="flex justify-center items-center ml-2">
          {isLoading && <CircularProgress size={16} sx={{ ml: 1 }} />}
        </p>
        <p
          className="font-bold ml-2 mr-1"
          onClick={handleClickNotificationUser}
        >
          {notification.sender.login}
        </p>
        <p
          title={notification.content}
          className="mr-12"
          onClick={handleClickNotification}
        >
          {notification.content}
        </p>
      </div>

      <div className="flex max-w-[200px] mr-1">
        <Button onClick={handleAcceptActionNotification} color="primary">
          Accept
        </Button>
        <Button onClick={handleDenyActionNotification} color="error">
          Refuse
        </Button>
        <Tooltip
          title="Close"
          arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton onClick={handleDeleteNotification} color="warning">
            <CloseIcon color="error" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default NotificationItem;

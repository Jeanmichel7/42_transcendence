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
      // dispatch(setMsgSnackbar('Friend request accepted'));
    }
  };

  const handleDeclineFriendRequest = async (userToDecline: UserInterface) => {
    setIsLoading(true);
    const resDeclineRequest: void | ApiErrorResponse = await declineFriend(
      userToDecline.id,
    );
    setIsLoading(false);

    // if (notifications.length == 0) setAnchorElNotification(null);
    if (typeof resDeclineRequest === 'object' && 'error' in resDeclineRequest)
      dispatch(setErrorSnackbar(resDeclineRequest));
    else {
      dispatch(reduxRemoveWaitingFriends(userToDecline));
      // dispatch(setMsgSnackbar('Friend request declined'));
    }
  };

  const handleDeclineJoinRoom = async (notif: NotificationInterface) => {
    const extractRoomId: number = parseInt(
      notif.invitationLink?.split('/')[4] as string,
    );
    console.log('room id : ', extractRoomId);
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
      // dispatch(setMsgSnackbar('Game invitation accepted'));
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
  const handleClickNotification = (notif: NotificationInterface) => {
    if (notif.type === 'friendRequest')
      navigate('/friends?tab=waiting_received');
  };

  const handleClickNotificationUser = (notif: NotificationInterface) => {
    navigate('/profile/' + notif.sender.login);
  };

  const handleDeleteNotification = (notif: NotificationInterface) => {
    if (notifications.length == 1) setNotifOpen(false);
    dispatch(reduxRemoveNotification(notif));
    localStorage.setItem(
      'notifications' + userData.id,
      JSON.stringify(
        JSON.parse(
          localStorage.getItem('notifications' + userData.id) as string,
        ).filter((n: NotificationInterface) => n.id !== notif.id),
      ),
    );
    console.log('notif length : ', notifications.length);
  };

  const handleAcceptActionNotification = async (
    notif: NotificationInterface,
  ) => {
    console.log('notif accept : ', notif);

    if (notif.type === 'friendRequest')
      await handleAcceptFriendRequest(notif.sender);
    if (notif.type === 'roomInvite')
      navigate(notif.invitationLink ? notif.invitationLink : '/chat');
    if (notif.type === 'gameInvite') await handleAcceptGameInvite(notif);
    if (notif.type === 'gameInviteAccepted')
      navigate(notif.invitationLink ? notif.invitationLink : '/chat');
    handleDeleteNotification(notif);
  };

  const handleDenyActionNotification = async (notif: NotificationInterface) => {
    console.log('notif deny : ', notif);
    if (notif.type === 'friendRequest')
      await handleDeclineFriendRequest(notif.sender);
    if (notif.type === 'roomInvite') await handleDeclineJoinRoom(notif);
    if (notif.type === 'gameInvite') await handleDeclineGameInvitation(notif);
    if (notif.type === 'gameInviteAccepted')
      await handleGameInvitationAccepted(notif);
    handleDeleteNotification(notif);
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
      className={`flex justify-between items-center border-y-[1px] border-gray-300 max-w-[600px]
      ${notification.read ? 'bg-gray-100' : 'bg-gray-200'}
    `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-grow overflow-hidden whitespace-nowrap text-overflow-ellipsis">
        {isLoading ? <CircularProgress /> : null}
        <p
          className="font-bold ml-5 mr-1"
          onClick={() => handleClickNotificationUser(notification)}
        >
          {notification.sender.login}
        </p>
        <p
          title={notification.content}
          className="mr-12"
          onClick={() => handleClickNotification(notification)}
        >
          {notification.content}
        </p>
      </div>

      <div className="flex max-w-[200px] mr-1">
        <Button
          onClick={() => handleAcceptActionNotification(notification)}
          color="primary"
        >
          Accept
        </Button>
        <Button
          onClick={() => handleDenyActionNotification(notification)}
          color="error"
        >
          Refuse
        </Button>
        <Tooltip
          title="Close"
          arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton
            onClick={() => handleDeleteNotification(notification)}
            color="warning"
          >
            <CloseIcon color="error" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default NotificationItem;

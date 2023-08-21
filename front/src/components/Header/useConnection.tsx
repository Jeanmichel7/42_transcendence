import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import {
  reduxAddConversationList,
  reduxAddNotReadMP,
  reduxUpdateStatusUserConvList,
} from '../../store/convListSlice';
import {
  reduxAddNotification,
  reduxRemoveNotification,
} from '../../store/notificationSlice';
import { setMsgSnackbar, setSnackbar } from '../../store/snackbarSlice';
import {
  reduxAddWaitingFriends,
  reduxAcceptedRequest,
  reduxDeclinedRequest,
  reduxRemoveWaitingFriends,
  reduxRemoveFriends,
  reduxUpdateUserStatus,
} from '../../store/userSlice';
import {
  MessageInterface,
  NotificationInterface,
  PutSnackbarInterface,
  UserInterface,
  UserStatusInterface,
} from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../store';

const useConnection = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData,
  );
  // const userIsLogged: boolean = useSelector(
  //   (state: RootState) => state.user.isLogged,
  // );
  const socketRef = useRef<Socket>();
  const pathRef = useRef<string>(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    /* MP */
    socketRef.current?.on(
      'notification_private_message',
      (message: MessageInterface) => {
        if (
          pathRef.current.split('/')[1] === 'chat' &&
          pathRef.current.split('/')[4] === message.ownerUser.id.toString()
        )
          return;

        const snackbar: PutSnackbarInterface = {
          open: true,
          loginFrom: message.ownerUser.login,
          message:
            message.text.length > 10
              ? message.text.substring(0, 7) + '...'
              : message.text,
          severity: 'info',
          link:
            '/chat/conv/x/' +
            message.ownerUser.id +
            '/' +
            message.ownerUser.login,
          avatar: message.ownerUser.avatar,
        };
        dispatch(setSnackbar(snackbar));
        dispatch(
          reduxAddNotReadMP({
            userIdFrom: message.ownerUser.id,
            userId: userData.id,
          }),
        );
      },
    );
    return () => {
      socketRef.current?.off('notification_private_message');
    };
  }, [pathRef.current, userData.id, socketRef.current]);

  useEffect(() => {
    if (!userData.id || userData.id === -1) return;
    // console.log('api url : ', API_URL);
    const socket = io('/notification', {
      withCredentials: true,
    });

    //connect room
    socket.emit('joinNotificationRoom', {
      userId: userData.id,
    });

    socket.on(
      'notification_friend_request',
      (notification: NotificationInterface) => {
        dispatch(reduxAddNotification(notification));
        dispatch(reduxAddWaitingFriends(notification.sender));
      },
    );

    socket.on(
      'notification_friend_request_accepted',
      (notification: NotificationInterface) => {
        dispatch(
          setMsgSnackbar(
            notification.sender.login + ': Friend request accepted',
          ),
        );
        dispatch(reduxAcceptedRequest(notification));
        dispatch(
          reduxAddConversationList({
            item: notification.sender,
            userId: userData.id,
          }),
        );
      },
    );

    socket.on(
      'notification_friend_request_declined',
      (notification: NotificationInterface) => {
        dispatch(
          setMsgSnackbar(
            notification.sender.login + ': Friend request declined',
          ),
        );
        dispatch(reduxDeclinedRequest(notification));
      },
    );

    socket.on(
      'notification_friend_request_canceled',
      (notification: NotificationInterface) => {
        dispatch(
          reduxRemoveNotification({
            notifId: notification.id,
            userId: userData.id,
          }),
        );
        dispatch(
          setMsgSnackbar(
            notification.sender.login + ': Friend request canceled',
          ),
        );
        dispatch(reduxRemoveWaitingFriends(notification.sender));
      },
    );

    socket.on(
      'notification_friend_deleted',
      (notification: NotificationInterface) => {
        dispatch(reduxRemoveFriends(notification.sender.id));
      },
    );

    socket.on(
      'notification_block_user',
      (notification: NotificationInterface) => {
        dispatch(reduxRemoveFriends(notification.sender.id));
      },
    );

    /* ROOM */
    socket.on(
      'notification_room_invite',
      (notification: NotificationInterface) => {
        dispatch(reduxAddNotification(notification));
      },
    );

    /* user update status */
    socket.on('update_user_status', (userStatus: UserStatusInterface) => {
      dispatch(reduxUpdateUserStatus(userStatus));
      dispatch(
        reduxUpdateStatusUserConvList({
          item: [userStatus],
          userId: userData.id,
        }),
      );
    });

    /* GAME */
    socket.on(
      'notification_game_invite',
      (notification: NotificationInterface) => {
        // console.log('notification_game_invite : ', notification);
        dispatch(reduxAddNotification(notification));
      },
    );

    socket.on(
      'notification_game_invite_accepted',
      (notification: NotificationInterface) => {
        // console.log('notification_game_invite_accepted : ', notification);
        dispatch(reduxAddNotification(notification));
      },
    );

    socket.on(
      'notification_game_invite_declined',
      (notification: NotificationInterface) => {
        // console.log('notification_game_invite_declined : ', notification);
        dispatch(
          setMsgSnackbar(notification.sender.login + ': Game request declined'),
        );
      },
    );

    /* TROPHY */
    socket.on('notification_trophee', (notif: NotificationInterface) => {
      const trophyName = notif.content.split(' : ')[1];
      const snackbar: PutSnackbarInterface = {
        open: true,
        message: notif.content,
        severity: 'info',
        trophyImg: trophyName,
        vertical: 'top',
      };
      dispatch(setSnackbar(snackbar));
      dispatch(
        reduxAddNotReadMP({
          userIdFrom: -1,
          userId: userData.id,
        }),
      );
    });

    socketRef.current = socket;

    return () => {
      // if (userIsLogged) return;
      socket.off('notification_friend_request');
      socket.off('notification_friend_request_accepted');
      socket.off('notification_friend_request_declined');
      socket.off('notification_friend_request_canceled');
      socket.off('notification_friend_deleted');
      socket.off('notification_block_user');
      socket.off('notification_unblock_user');
      socket.off('notification_room_invite');
      socket.off('update_user_status');
      socket.off('notification_game_invite');
      socket.off('notification_game_invite_accepted');
      socket.off('notification_game_invite_declined');
      socket.disconnect();
    };
  }, [dispatch, userData.id]);
};

export default useConnection;

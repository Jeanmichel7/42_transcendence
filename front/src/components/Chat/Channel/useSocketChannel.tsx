import {
  ChatMsgInterface,
  ConversationInterface,
  RoomInterface,
} from '../../../types';
import { Socket } from 'socket.io-client';
import {
  reduxRemoveConversationToList,
  reduxUpdateRoomConvList,
} from '../../../store/convListSlice';
import {
  setWarningSnackbar,
  setMsgSnackbar,
} from '../../../store/snackbarSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useNavigate } from 'react-router-dom';

export const useConnectionSocketChannel = (
  socket: Socket,
  id: string,
  userId: number,
  convId: number,
  setMessages: React.Dispatch<React.SetStateAction<ChatMsgInterface[]>>,
  setOffsetPagniation: React.Dispatch<React.SetStateAction<number>>,
) => {
  const { room } = useSelector(
    (state: RootState) =>
      state.chat.conversationsList.find(c => c.id === convId) ||
      ({} as ConversationInterface),
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (room && room.id && socket.connected)
      socket.emit('joinRoom', { roomId: id });
    return () => {
      if (socket && socket.connected) {
        socket.emit('leaveRoom', {
          roomId: id,
        });
      }
    };
  }, [convId]);

  useEffect(() => {
    if (socket) {
      /* MESSAGE */
      socket.on('chat_message', (message: ChatMsgInterface) => {
        setMessages(prevMessages => [...prevMessages, message]);
        setOffsetPagniation(prev => prev + 1);
      });

      socket.on('chat_message_edit', message => {
        setMessages(prevMessages => {
          const newMessages = prevMessages.map(msg => {
            if (msg.id === message.id) {
              return {
                ...msg,
                text: message.text,
                updatedAt: message.updatedAt,
              };
            }
            return msg;
          });
          return newMessages;
        });
      });

      socket.on('chat_message_delete', message => {
        setMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== message.id),
        );
        setOffsetPagniation(prev => prev - 1);
      });

      /* ROOM ADMIN */
      socket.on('room_admin_added', (roomId, user) => {
        if (roomId !== id) return;
        const roomUpdated: RoomInterface = {
          ...room,
          admins: room.admins ? [...room.admins, user] : [user],
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );

        if (userId === user.id) {
          dispatch(
            setMsgSnackbar('You are now admin of the room ' + room.name),
          );
        }
      });

      socket.on('room_admin_removed', (roomId, userIdUnAdmin) => {
        if (roomId !== id) return;
        const roomUpdated: RoomInterface = {
          ...room,
          admins: room.admins?.filter(u => u.id !== userIdUnAdmin),
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );

        if (userId === userId) {
          dispatch(
            setWarningSnackbar(
              'You are no longer admin of the room ' + room.name,
            ),
          );
        }
      });

      /* OWNER */
      socket.on('room_owner_added', (roomId, user) => {
        if (roomId !== id) return;
        const roomUpdated: RoomInterface = {
          ...room,
          ownerUser: user,
        };
        dispatch(
          reduxUpdateRoomConvList({ item: roomUpdated, userId: userId }),
        );

        if (userId === user.id) {
          dispatch(
            setMsgSnackbar('You are now owner of the room ' + room.name),
          );
        }
      });

      socket.on('room_owner_deleted', roomId => {
        if (roomId !== id) return;
        dispatch(
          reduxRemoveConversationToList({ convId: convId, userId: userId }),
        );
        dispatch(
          setWarningSnackbar('The room ' + room.name + ' has been deleted'),
        );
        navigate('/chat/channel');
      });

      return () => {
        socket.off('chat_message');
        socket.off('chat_message_edit');
        socket.off('chat_message_delete');
        socket.off('room_join');
        socket.off('room_leave');
        socket.off('room_muted');
        socket.off('room_unmuted');
        socket.off('room_kicked');
        socket.off('room_banned');
        socket.off('room_unbanned');
        socket.off('room_admin_added');
        socket.off('room_admin_removed');
        socket.off('room_owner_added');
        socket.off('room_owner_deleted');
      };
    }
  }, [convId, room, socket]);
};

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Socket } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import {
  setErrorSnackbar,
  setMsgSnackbar,
  setPersonalizedErrorSnackbar,
  setWarningSnackbar,
} from '../../../store/snackbarSlice';

import MessageItem from '../MessageItem';

import {
  chatOldMessages,
  deleteChatMessage,
  getRoomData,
} from '../../../api/chat';

import { ApiErrorResponse } from '../../../types';
import {
  ChatMsgInterface,
  ConversationInterface,
  RoomInterface,
} from '../../../types/ChatTypes';

import { HttpStatusCode } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store';
import SideBarAdmin from './admin/SidebarAdmin';
import {
  reduxRemoveConversationToList,
  reduxUpdateRoomConvList,
} from '../../../store/convListSlice';
import ChatMembers from './Members';
import InvitationRoom from './admin/InvitationRoom';
import { useConnectionSocketChannel } from './useSocketChannel';
import FormChannel from './FormChannel';

interface ChannelConversationProps {
  conv: ConversationInterface;
  socketRef: React.MutableRefObject<Socket>;
}

const ChannelConversation: React.FC<ChannelConversationProps> = memo(
  ({ conv, socketRef }) => {
    const id = useParams<{ id: string }>().id || '-1';
    const name = useParams<{ name: string }>().name || 'unknown';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { room } = useSelector(
      (state: RootState) =>
        state.chat.conversationsList.find(c => c.id === conv.id) ||
        ({} as ConversationInterface),
    );
    const { userData } = useSelector((state: RootState) => state.user);
    const { userBlocked } = useSelector((state: RootState) => state.user);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
    const [pageDisplay, setPageDisplay] = useState<number>(1);
    const [messages, setMessages] = useState<ChatMsgInterface[]>([]);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    // const [isLoadingPagination, setIsLoadingPagination] =
    //   useState<boolean>(false);
    const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] =
      useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useConnectionSocketChannel(
      socketRef.current,
      id,
      userData.id,
      conv.id,
      setMessages,
      setOffsetPagniation,
    );

    const fetchOldMessages = useCallback(async () => {
      if (id === '-1' || !conv) return;
      setShouldScrollToBottom(false);

      // setIsLoadingPagination(true);
      const allMessages: ChatMsgInterface[] | ApiErrorResponse =
        await chatOldMessages(id, pageDisplay, offsetPagniation);
      // setIsLoadingPagination(false);

      if ('error' in allMessages) dispatch(setErrorSnackbar(allMessages));
      else {
        if (allMessages.length === 0) return;

        //save pos scrool
        const scrollContainer = document.querySelector('.overflow-y-auto');
        if (!scrollContainer) return;
        const oldScrollHeight = scrollContainer.scrollHeight;

        if (pageDisplay === 1) {
          setMessages(allMessages.reverse());
        } else {
          const reversedMessageArray = allMessages
            .reverse()
            .filter(message => !messages.some(msg => msg.id === message.id));
          setMessages(prev => [...reversedMessageArray, ...prev]);
        }

        //set pos scrool to top old messages
        requestAnimationFrame(() => {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop += newScrollHeight - oldScrollHeight;
          setShouldScrollToBottom(true);
        });
      }
    }, [id, conv, pageDisplay]);

    useEffect(() => {
      if (!room || !userData.id || userData.id === -1 || id === '-1') return;
      fetchOldMessages();
    }, [pageDisplay, userData.id, id, fetchOldMessages]);

    const fetchRoomData = useCallback(async () => {
      if (conv == null) {
        dispatch(setPersonalizedErrorSnackbar('Not allow...'));
        navigate('/chat/channel');
        return;
      }
      if (!conv.room.id || conv.room.id === -1 || userData.id === -1) return;
      const roomData: RoomInterface | ApiErrorResponse = await getRoomData(
        conv.room.id.toString(),
      );
      if (roomData && 'statusCode' in roomData && roomData.statusCode === 403) {
        dispatch(
          setPersonalizedErrorSnackbar(
            'You are not allowed to access this room or just be kicked from it',
          ),
        );
        socketRef.current?.emit('leaveRoom', {
          roomId: id,
        });
        dispatch(
          reduxRemoveConversationToList({
            convId: conv.id,
            userId: userData.id,
          }),
        );
        navigate('/chat/channel');
      } else if (roomData && 'error' in roomData) {
        dispatch(setErrorSnackbar(roomData));
      } else {
        dispatch(
          reduxUpdateRoomConvList({ item: roomData, userId: userData.id }),
        );

        //check if user is accepted in room
        if (roomData.users && roomData.acceptedUsers) {
          const isUserInRoom =
            roomData.users.some(u => u.id === userData.id) ||
            roomData.acceptedUsers.some(u => u.id === userData.id);
          if (!isUserInRoom) {
            socketRef.current?.emit('leaveRoom', {
              roomId: id,
            });
            dispatch(
              reduxRemoveConversationToList({
                convId: conv.id,
                userId: userData.id,
              }),
            );
            dispatch(
              setWarningSnackbar('You are not in the room ' + conv.room.name),
            );
            navigate('/chat/channel');
          }

          // check if channel removed
        } else if (!roomData.users) {
          socketRef.current?.emit('leaveRoom', {
            roomId: id,
          });
          dispatch(
            reduxRemoveConversationToList({
              convId: conv.id,
              userId: userData.id,
            }),
          );
          dispatch(
            setWarningSnackbar('Room ' + conv.room.name + ' was deleted'),
          );
          navigate('/chat/channel');
        } else {
          console.error('WTF ?');
        }
      }
    }, [dispatch, id, name, navigate, userData.id]);

    useEffect(() => {
      if (!userData.id || userData.id == -1) return;
      fetchRoomData();
    }, [fetchRoomData, id, userData.id]);

    useEffect(() => {
      if (!room || !userData) return;
      if (room.admins)
        setIsAdmin(room.admins.some(admin => admin.id === userData.id));
    }, [room, userData]);

    // scroll to bottom
    useEffect(() => {
      if (shouldScrollToBottom && bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
    }, [messages]);

    const handleDeleteMessage = async (msgId: number) => {
      setIsLoadingDeleteMsg(true);
      const res: HttpStatusCode | ApiErrorResponse = await deleteChatMessage(
        msgId,
      );
      setIsLoadingDeleteMsg(false);

      if (typeof res === 'object' && 'error' in res)
        dispatch(setErrorSnackbar(res));
      else {
        setMessages(prev => prev.filter(message => message.id !== msgId));
        dispatch(setMsgSnackbar('Message deleted'));
      }
    };

    //scrool top = fetch new page messages
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const element = e.target as HTMLDivElement;
      if (element.scrollTop === 0) {
        setPageDisplay(prev => prev + 1);
      }
    };

    return (
      <>
        {!room ? (
          <p>loading...</p>
        ) : (
          <div className="flex h-full">
            <div className="flex flex-grow flex-col h-full justify-between">
              <div className="w-full flex text-lg justify-between">
                {room && isAdmin ? (
                  <InvitationRoom room={room} />
                ) : (
                  <span></span>
                )}
                <p className="font-bold text-lg py-1">{name.toUpperCase()}</p>
                {room && isAdmin ? (
                  <SideBarAdmin room={room} convId={conv.id} />
                ) : (
                  <span></span>
                )}
              </div>

              <div
                className="overflow-y-auto max-h-[calc(100vh-110px)]"
                onScroll={handleScroll}
                ref={scrollContainerRef}
              >
                {/* display messages */}
                {messages && userBlocked && (
                  <div className="align-end flex-grow text-lg m-1 p-2 ">
                    {messages.map((message: ChatMsgInterface) =>
                      userBlocked.some(
                        u => u.id === message.ownerUser.id,
                      ) ? null : (
                        <MessageItem
                          key={message.id}
                          message={message}
                          isLoadingDeleteMsg={isLoadingDeleteMsg}
                          handleDeleteMessage={handleDeleteMessage}
                        />
                      ),
                    )}
                    {/* display form message */}
                    <div className="sticky bottom-0 px-1 pb-1 bg-[#efeff8]">
                      <FormChannel
                        setShouldScrollToBottom={setShouldScrollToBottom}
                      />
                    </div>
                  </div>
                )}
                <div ref={bottomRef}></div>
              </div>
            </div>

            <ChatMembers room={room} />
          </div>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.conv.id !== nextProps.conv.id) return false;
    return true;
  },
);

export default ChannelConversation;

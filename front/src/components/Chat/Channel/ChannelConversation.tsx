import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Socket } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import {
  setErrorSnackbar,
  setMsgSnackbar,
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
// import Loaderperosnalized from '../../../utils/LoaderPerosnalized ';
// import ErrorBoundary from './errorBoundaries';

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
    // const [isAdminMenuOpen, setIsAdminMenuOpen] = useState<boolean>(false);
    const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
    const [pageDisplay, setPageDisplay] = useState<number>(1);
    const [messages, setMessages] = useState<ChatMsgInterface[]>([]);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [isLoadingPagination, setIsLoadingPagination] =
      useState<boolean>(false);
    const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] =
      useState<boolean>(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [allMessagesDisplayed, setAllMessagesDisplayed] =
      useState<boolean>(false);

    useConnectionSocketChannel(
      socketRef.current,
      id, //room id
      userData.id,
      conv.id,
      setMessages,
      setOffsetPagniation,
    );

    // get messages
    const fetchOldMessages = useCallback(async () => {
      if (id === '-1' || !conv) return;
      if (allMessagesDisplayed) return;
      setShouldScrollToBottom(false);
      // console.log('fetch old messages');

      setIsLoadingPagination(true);
      const allMessages: ChatMsgInterface[] | ApiErrorResponse =
        await chatOldMessages(id, pageDisplay, offsetPagniation);

      if ('error' in allMessages)
        dispatch(
          setErrorSnackbar(
            allMessages.error + allMessages.message
              ? ': ' + allMessages.message
              : '',
          ),
        );
      else {
        if (allMessages.length === 0) return;
        if (allMessages.length < 20) setAllMessagesDisplayed(true);

        //save pos scrool
        const scrollContainer = document.querySelector('.overflow-y-auto');
        if (!scrollContainer) {
          setIsLoadingPagination(false);
          return;
        }
        const oldScrollHeight = scrollContainer.scrollHeight;

        const reversedMessageFiltred = allMessages
          .reverse()
          .filter(message => !messages.some(msg => msg.id === message.id));
        if (pageDisplay === 1) setMessages(reversedMessageFiltred);
        else setMessages(prev => [...reversedMessageFiltred, ...prev]);

        //set pos scrool to top old messages
        requestAnimationFrame(() => {
          const newScrollHeight = scrollContainer.scrollHeight;
          scrollContainer.scrollTop += newScrollHeight - oldScrollHeight;
          setShouldScrollToBottom(true);
        });
      }
      setIsLoadingPagination(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageDisplay]);

    useEffect(() => {
      if (!room || !userData.id || userData.id === -1 || id === '-1') return;
      fetchOldMessages();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchOldMessages, room?.id]);

    const fetchRoomData = useCallback(async () => {
      if (conv == null) {
        dispatch(setErrorSnackbar('Nop'));
        navigate('/chat/channel');
        return;
      }
      if (!conv.room.id || conv.room.id === -1 || userData.id === -1) return;
      const roomData: RoomInterface | ApiErrorResponse = await getRoomData(
        conv.room.id.toString(),
      );
      // console.log('roomData : ', roomData);
      if (roomData && 'statusCode' in roomData && roomData.statusCode === 403) {
        dispatch(
          setErrorSnackbar(
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
      } else if (roomData && 'error' in roomData)
        dispatch(
          setErrorSnackbar(
            roomData.error + roomData.message ? ': ' + roomData.message : '',
          ),
        );
      else {
        // setRoom(roomData);
        dispatch(
          reduxUpdateRoomConvList({ item: roomData, userId: userData.id }),
        );

        //check if user is accepted in room
        if (roomData.users && roomData.acceptedUsers) {
          const isUserInRoom =
            roomData.users.some(u => u.id === userData.id) ||
            roomData.acceptedUsers.some(u => u.id === userData.id);
          // || roomData.;
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
          } else {
            // console.log('user already in room');
          }

          // check if channel removed
        } else if (!roomData.users) {
          socketRef.current?.emit('leaveRoom', {
            roomId: id,
          });
          console.log('room delete, conv : ', conv);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, id, navigate, userData.id]);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    // delete message
    const handleDeleteMessage = async (msgId: number) => {
      setIsLoadingDeleteMsg(true);
      const res: HttpStatusCode | ApiErrorResponse = await deleteChatMessage(
        msgId,
      );
      setIsLoadingDeleteMsg(false);

      if (typeof res === 'object' && 'error' in res)
        dispatch(
          setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''),
        );
      else {
        setMessages(prev => prev.filter(message => message.id !== msgId));
        dispatch(setMsgSnackbar('Message deleted'));
      }
    };

    //scrool top = fetch new page messages
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const element = e.target as HTMLDivElement;
      if (
        element.scrollTop === 0 &&
        !isLoadingPagination &&
        !allMessagesDisplayed
      ) {
        setPageDisplay(prev => prev + 1);
        //display waiting message
      }
    };

    return (
      <>
        {!room ? (
          <p>loading...</p>
        ) : (
          <div className="flex h-full">
            <div className="flex flex-grow flex-col h-full justify-between">
              <div className="w-full flex text-lg text-blue justify-between">
                {isAdmin && room && <InvitationRoom room={room} />}
                <p className="font-bold text-lg py-1">{name.toUpperCase()}</p>
                {isAdmin && room && (
                  <SideBarAdmin
                    room={room}
                    convId={conv.id}
                    // setIsAdminMenuOpen={setIsAdminMenuOpen}
                  />
                )}
              </div>

              <div
                className="overflow-y-auto max-h-[calc(100vh-125px)] h-full bg-[#efeff8] 
                flex flex-col"
                onScroll={handleScroll}
              >
                {/* display messages */}
                {messages && userBlocked && (
                  <div className="align-end flex-grow text-lg m-1 p-2 ">
                    {messages.map(
                      (message: ChatMsgInterface) =>
                        userBlocked.some(
                          u => u.id === message.ownerUser.id,
                        ) ? null : (
                          // <ErrorBoundary>
                          <MessageItem
                            key={message.id}
                            message={message}
                            isLoadingDeleteMsg={isLoadingDeleteMsg}
                            handleDeleteMessage={handleDeleteMessage}
                            // isAdminMenuOpen={isAdminMenuOpen}
                          />
                        ),
                      // </ErrorBoundary>
                    )}
                  </div>
                )}
                <div className="sticky bottom-0 px-1 pb-1 bg-[#efeff8]">
                  <FormChannel
                    setShouldScrollToBottom={setShouldScrollToBottom}
                  />
                </div>
                <div ref={bottomRef}></div>
              </div>
            </div>

            {/* display members */}
            <div className="w-[150px]">
              <ChatMembers room={room} />
            </div>
          </div>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.conv.id !== nextProps.conv.id) return false;
    // if (prevProps.conv.room.id !== nextProps.conv.room.id) return false;
    // if (prevProps.conv.room.name !== nextProps.conv.room.name) return false;
    // if (prevProps.conv.room.users !== nextProps.conv.room.users) return false;
    return true;
  },
);

export default ChannelConversation;

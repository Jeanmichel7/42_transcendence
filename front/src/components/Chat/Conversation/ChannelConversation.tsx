import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar, setWarningSnackbar } from '../../../store/snackbarSlice';

import MessageItem from './MessageItem';

import { chatOldMessages, deleteChannel, deleteChatMessage, getRoomData, sendChatMessage } from '../../../api/chat';

import { ApiErrorResponse } from '../../../types';
import { ChatMsgInterface, ConversationInterface, RoomInterface } from '../../../types/ChatTypes';

import { BiPaperPlane } from 'react-icons/bi';
import { TextareaAutosize } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store';
import SideBarAdmin from '../Channel/admin/SidebarAdmin';
import { reduxRemoveConversationToList, reduxUpdateRoomConvList } from '../../../store/convListSlice';
import ChatMembers from './Members';
import InvitationRoom from '../Channel/admin/InvitationRoom';

interface ChannelConversationProps {
  conv: ConversationInterface,
}

const ChannelConversation: React.FC<ChannelConversationProps> = ({ conv }) => {
  const id = (useParams<{ id: string }>().id || '-1');
  const name = (useParams<{ name: string }>().name || 'unknown');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { room } = useSelector((state: RootState) => state.chat.conversationsList.find((c) => c.id === conv.id) || {} as ConversationInterface);
  const { userData } = useSelector((state: RootState) => state.user);
  const { userBlocked } = useSelector((state: RootState) => state.user);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState<boolean>(false);
  // const [isInvitMenuOpen, setIsInvitMenuOpen] = useState<boolean>(false);

  // const [indexMsgChatBot, setIndexMsgChatBot] = useState<number>(-1);
  // const [room, setRoom] = useState<RoomInterface | null | undefined>(undefined);
  const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<(ChatMsgInterface)[]>([]);
  const [text, setText] = useState<string>('');
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isLoadingPagination, setIsLoadingPagination] = useState<boolean>(false);
  const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // connect socket
  const connectSocketChat = useCallback(() => {
    if (!userData.id || userData.id === -1) return;
    const socket = io('http://localhost:3000/chat', {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    // socket.on('room_joined', (message) => {
    //   console.log('room joined ! ', message);
    // });

    /* MESSAGES */
    socket.on('chat_message', (message: ChatMsgInterface, acknowledge) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
      setOffsetPagniation((prev) => prev + 1);
      acknowledge(true);
    });

    socket.on('chat_message_edit', (message) => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages.map((msg) => {
          if (msg.id === message.id) {
            return { ...msg, text: message.text, updatedAt: message.updatedAt };
          }
          return msg;
        });
        return newMessages;
      });
    });

    socket.on('chat_message_delete', (message) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
      setOffsetPagniation((prev) => prev - 1);
    });


    /* ROOM */
    socket.on('room_join', (roomId, user) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = { 
        ...conv.room,
        users: conv.room.users ? [...conv.room.users, user] : [user],
        acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== user.id),
      };
      console.log('usr add ws : ', user);
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));
    });

    socket.on('room_leave', (roomId, userId) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        users: conv.room.users?.filter((u) => u.id !== userId),
        admins: conv.room.admins?.filter((u) => u.id !== userId),
        // acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== userId),
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));
    });

    /* ROOM ADMIN */
    socket.on('room_muted', (roomId, user) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        mutedUsers: conv.room.mutedUsers ? [...conv.room.mutedUsers, user] : [user],
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));
    });

    socket.on('room_unmuted', (roomId, userId) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        mutedUsers: conv.room.mutedUsers?.filter((u) => u.id !== userId),
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));
    });

    socket.on('room_kicked', (roomId, userId) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        users: conv.room.users?.filter((u) => u.id !== userId),
        admins: conv.room.admins?.filter((u) => u.id !== userId),
        // acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== userId),
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));

      if (userData.id === userId) {
        socket.emit('leaveRoom', {
          roomId: id,
        });
        dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
        navigate('/chat/channel');
        dispatch(setWarningSnackbar('You have been kicked from the room ' + conv.room.name));
      }
    });

    socket.on('room_banned', (roomId, user) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        bannedUsers: conv.room.bannedUsers ? [...conv.room.bannedUsers, user] : [user],
        admins: conv.room.admins?.filter((u) => u.id !== user.id),
        acceptedUsers: conv.room.acceptedUsers?.filter((u) => u.id !== user.id),
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));

      if (userData.id === user.id) {
        socket.emit('leaveRoom', {
          roomId: id,
        });
        dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
        navigate('/chat/channel');
        dispatch(setWarningSnackbar('You have been banned from the room ' + conv.room.name));
      }
    });

    socket.on('room_unbanned', (roomId, userId) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        bannedUsers: conv.room.bannedUsers?.filter((u) => u.id !== userId),
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));
    });

    /* ROOM ADMIN */
    socket.on('room_admin_added', (roomId, user) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        admins: conv.room.admins ? [...conv.room.admins, user] : [user],
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));

      if (userData.id === user.id) {
        // setIsAdmin(true);
        dispatch(setMsgSnackbar('You are now admin of the room ' + conv.room.name));
      }
    });

    socket.on('room_admin_removed', (roomId, userId) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        admins: conv.room.admins?.filter((u) => u.id !== userId),
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));

      if (userData.id === userId) {
        // setIsAdmin(false);
        dispatch(setWarningSnackbar('You are no longer admin of the room ' + conv.room.name));
      }
    });

    /* OWNER */
    socket.on('room_owner_added', (roomId, user) => {
      if (roomId !== id) return;
      const roomUpdated: RoomInterface = {
        ...conv.room,
        ownerUser: user,
      };
      dispatch(reduxUpdateRoomConvList({ item: roomUpdated, userId: userData.id }));

      if (userData.id === user.id) {
        dispatch(setMsgSnackbar('You are now owner of the room ' + conv.room.name));
      }
    });

    socket.on('room_owner_deleted', (roomId) => {
      if (roomId !== id) return;
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
      dispatch(setWarningSnackbar('The room ' + conv.room.name + ' has been deleted'));
      navigate('/chat/channel');
    });

    /* ROOM USER */
    // socket.on('room_user_accepted', (roomId, user) => {

    socket.on('error', (error) => { console.log('erreur socket : ', error); });

    //connect to room
    socket.emit('joinRoom', {
      roomId: id,
    });

    socketRef.current = socket;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userData.id]);

  // get messages
  const fetchOldMessages = useCallback(async () => {
    if (id === '-1' || !conv) return;
    setShouldScrollToBottom(false);

    setIsLoadingPagination(true);
    console.log('FETCH OLD MESSAGES');
    const allMessages: ChatMsgInterface[] | ApiErrorResponse = await chatOldMessages(id, pageDisplay, offsetPagniation);
    
    if ('error' in allMessages)
      dispatch(setErrorSnackbar(allMessages.error + allMessages.message ? ': ' + allMessages.message : ''));
    else {
      if (allMessages.length === 0) return;

      //save pos scrool
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (!scrollContainer) return;
      const oldScrollHeight = scrollContainer.scrollHeight;

      const reversedMessageFiltred = allMessages.reverse().filter((message) => !messages.some((msg) => msg.id === message.id));
      if (pageDisplay === 1)
        setMessages(reversedMessageFiltred);
      else
        setMessages((prev) => [...reversedMessageFiltred, ...prev]);

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

  const fetchRoomData = useCallback(async () => {
    if (conv == null) {
      dispatch(setErrorSnackbar('Nop'));
      navigate('/chat/channel');
      return;
    }
    if (!conv.room.id || conv.room.id === -1 || userData.id === -1) return;
    console.log('FEEEEEEECTH ROOM DATA');
    const roomData: RoomInterface | ApiErrorResponse = await getRoomData((conv.room.id).toString());
    if (roomData && 'statusCode' in roomData && roomData.statusCode === 403) {
      dispatch(setErrorSnackbar('You are not allowed to access this room or just be kicked from it'));
      socketRef.current?.emit('leaveRoom', {
        roomId: id,
      });
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
      navigate('/chat/channel');
    } else if (roomData && 'error' in roomData)
      dispatch(setErrorSnackbar(roomData.error + roomData.message ? ': ' + roomData.message : ''));
    else {
      // setRoom(roomData);
      dispatch(reduxUpdateRoomConvList({ item: roomData, userId: userData.id }));

      //check if user is accepted in room
      if (roomData.users && roomData.acceptedUsers) {
        const isUserInRoom = roomData.users.some((u) => u.id === userData.id)
          || roomData.acceptedUsers.some((u) => u.id === userData.id);
          // || roomData.;
        // console.log('is user in room; ', isUserInRoom);
        if (!isUserInRoom) {
          socketRef.current?.emit('leaveRoom', {
            roomId: id,
          });
          dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
          dispatch(setWarningSnackbar('You are not in the room ' + conv.room.name));
          navigate('/chat/channel');
        } else {
          // console.log('user already in room');
        }
      
      // check if channel removed
      } else if (!roomData.users) {
        socketRef.current?.emit('leaveRoom', {
          roomId: id,
        });
        dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
        dispatch(setWarningSnackbar('Room ' + conv.room.name + ' was deleted'));
        navigate('/chat/channel');
      } else {
        console.error('WTF ?');
      }
    }
  }, [conv, dispatch, id, navigate, userData.id]);

  useEffect(() => {
    if (!room || !userData) return;
    if (room.admins) setIsAdmin(room.admins.some((admin) => admin.id === userData.id));
  }, [room, userData]);

  useEffect(() => {
    if (!room || !userData.id || userData.id === -1 || id === '-1') return;
    if (room.bannedUsers?.some((u) => u.id === userData.id)) {
      socketRef.current?.emit('leaveRoom', {
        roomId: id,
      });
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
      navigate('/chat/channel');
      dispatch(setWarningSnackbar('You have been banned from the room ' + conv.room.name));
    }
    connectSocketChat();
    return () => {
      if (socketRef.current !== null && socketRef.current !== undefined && userData.id !== -1 && id !== '-1'
      && room?.bannedUsers !== undefined && room?.bannedUsers !== null && !room?.bannedUsers.some((u) => u.id === userData.id)) {
        console.log('AUTO DEMONTAGE CHANNEL CONVERSATION DISCONNECT');
        socketRef.current.off('chat_message');
        socketRef.current.off('chat_message_edit');
        socketRef.current.off('chat_message_delete');
        socketRef.current.emit('leaveRoom', {
          roomId: id,
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userData.id, id, room?.bannedUsers, connectSocketChat, dispatch, navigate]);

  useEffect(() => {
    fetchOldMessages();
  }, [fetchOldMessages, room?.id]);

  useEffect(() => {
    if (!userData.id || userData.id == -1) return;
    fetchRoomData();
  }, [fetchRoomData, id, userData.id]);

  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
    // console.log('messages : ', messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);







  // delete message
  const handleDeleteMessage = async (msgId: number) => {
    // console.log('delete message : ', msgId);
    setIsLoadingDeleteMsg(true);
    const res: HttpStatusCode | ApiErrorResponse = await deleteChatMessage(msgId);
    // console.log('res : ', res);
    setIsLoadingDeleteMsg(false);

    if (typeof res === 'object' && 'error' in res)
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    else {
      setMessages((prev) => prev.filter((message) => message.id !== msgId));
      dispatch(setMsgSnackbar('Message deleted'));
    }
  };

  // send message
  const handleSubmit = () => async (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e === null) return;
    if ('key' in e) {
      if (e.shiftKey && e.key === 'Enter') {
        setText((prev) => prev + '\n');
        e.preventDefault();
        return;
      } else if (e.key !== 'Enter')
        return;
    }
    e.preventDefault();
    if (text.trim() === '') {
      setText('');
      return;
    }
    setStatusSendMsg('pending');
    const newMessage: ChatMsgInterface | ApiErrorResponse = await sendChatMessage(id, {
      text: text,
    });
    if ('error' in newMessage)
      setStatusSendMsg(newMessage.message);
    else
      setStatusSendMsg('');
    setText('');
    setShouldScrollToBottom(true);
  };





  /* set text input currying + callback */
  const handleChangeTextArea = useCallback(
    (setTextFn: React.Dispatch<React.SetStateAction<string>>) => (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setTextFn(e.target.value);
    }, [],
  );


  //scrool top = fetch new page messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.target as HTMLDivElement;
    if (element.scrollTop === 0 && !isLoadingPagination) {
      setPageDisplay((prev) => prev + 1);
      //display waiting message
    }
  };

  const handleDeleteChannel = async () => {
    if (!room) return;
    const resDeleteChannel: RoomInterface | ApiErrorResponse = await deleteChannel(room.id);
    if (typeof resDeleteChannel === 'object' && 'error' in resDeleteChannel)
      dispatch(setErrorSnackbar(resDeleteChannel.error + resDeleteChannel.message ? ': ' + resDeleteChannel.message : ''));
    else {
      dispatch(setMsgSnackbar('Channel deleted'));
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
      setIsAdminMenuOpen(false);
      navigate('/chat');
    }
  };

  // useEffect(() => {
  //   console.log('room : ', room);
  // }, [room]);


  return (
    <>
      {!room ? <p>loading...</p> :
        <div className="flex flex-col h-full">
          <div className="w-full flex text-lg text-blue justify-between">

            {isAdmin && room && 
              <InvitationRoom room={room}
            /> }
            
            <p className='font-bold text-lg py-1'>{name.toUpperCase()}</p>
            
            {isAdmin && room && 
              <SideBarAdmin
                room={room}
                setIsAdminMenuOpen={setIsAdminMenuOpen}
                handleDeleteChannel={handleDeleteChannel}
              />}
          </div>

          <div className='flex h-full'>
            <div className="flex-grow self-end overflow-y-auto max-h-[calc(100vh-275px)] bg-[#efeff8] " onScroll={handleScroll}>
              {/* display messages */}
              {messages && userBlocked &&
                <div className='text-lg m-1 p-2 '>
                  {/* { isLoadingPagination && <CircularProgress className='mx-auto' />} */}
                  {messages.map((message: ChatMsgInterface) => (
                    //check if message is from blocked user
                    userBlocked.some((u) => u.id === message.ownerUser.id) ? null :
                    <MessageItem
                      key={message.id}
                      message={message}
                      isLoadingDeleteMsg={isLoadingDeleteMsg}
                      handleDeleteMessage={handleDeleteMessage}
                      isAdminMenuOpen={isAdminMenuOpen}
                    />
                  ))}
                  {/* display form message */}
                  <form className="rounded-md shadow-md flex border-2 border-zinc-400 mt-2">
                    <TextareaAutosize
                      ref={textareaRef}
                      name="text"
                      value={text}
                      onChange={handleChangeTextArea(setText)}
                      onKeyDown={handleSubmit()}
                      placeholder="Enter your text here..."
                      className="w-full p-2 rounded-sm m-1 pb-1 shadow-sm font-sans resize-none"
                    />
                    <button className='flex justify-center items-center'
                      onClick={handleSubmit()}
                    >
                      <BiPaperPlane className=' text-2xl mx-2 text-cyan' />
                    </button>

                    {/* display status send message */}
                    {statusSendMsg !== '' &&
                      <span className={`${statusSendMsg == 'pending' ? 'bg-yellow-500' : 'bg-red-500'}
                        bottom-16  text-white p-2 rounded-xl shadow-lg`}
                        onClick={() => setStatusSendMsg('')}
                      >
                        {statusSendMsg}
                      </span>
                    }
                  </form>

                </div>}
              <div ref={bottomRef}></div>
            </div>

            {/* display members */}
            {room.users && room.acceptedUsers && room.admins &&
              <div className='w-[150px]'>
                <ChatMembers 
                  admins={room.admins}
                  users={room.users} 
                  acceptedUsers={room.acceptedUsers}
                />
              </div> }
          </div>
        </div>
      }
    </>
  );
};

export default ChannelConversation;

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
import { reduxRemoveConversationToList } from '../../../store/chatSlicer';
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
  const { userData } = useSelector((state: RootState) => state.user);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState<boolean>(false);
  // const [isInvitMenuOpen, setIsInvitMenuOpen] = useState<boolean>(false);

  // const [indexMsgChatBot, setIndexMsgChatBot] = useState<number>(-1);
  const [room, setRoom] = useState<RoomInterface | null | undefined>(undefined);
  const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<(ChatMsgInterface)[]>([]);
  const [text, setText] = useState<string>('');
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  // const [isLoadingPagination, setIsLoadingPagination] = useState<boolean>(false);
  const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // connect socket
  const connectSocketChat = useCallback(() => {
    if (!userData) return;
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
      setRoom((prev) => prev ? {
        ...prev,
        users: prev.users ? [...prev.users, user] : [user],
        acceptedUsers: prev.acceptedUsers?.filter((u) => u.id !== user.id),
      } : null);
    });

    socket.on('room_leave', (roomId, userId) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        users: prev.users?.filter((u) => u.id !== userId),
        admins: prev.admins?.filter((u) => u.id !== userId),
      } : null);
      //accepted user ?
      // setRoom((prev) => prev ? { ...prev,
      //   acceptedUsers: prev.acceptedUsers?.filter((u) => u.id !== userId) } : null);
    });

    /* ROOM ADMIN */
    socket.on('room_muted', (roomId, user) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        mutedUsers: prev.mutedUsers ? [...prev.mutedUsers, user] : [user],
      } : null);
    });

    socket.on('room_unmuted', (roomId, userId) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        mutedUsers: prev.mutedUsers?.filter((u) => u.id !== userId),
      } : null);
    });

    socket.on('room_kicked', (roomId, userId) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        users: prev.users?.filter((u) => u.id !== userId),
        admins: prev.admins?.filter((u) => u.id !== userId),
      } : null);
      if (userData.id === userId) {
        socket.emit('leaveRoom', {
          roomId: id,
        });
        dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
        navigate('/chat/channel');
        dispatch(setWarningSnackbar('You have been kicked from the room ' + conv.room.name));
      }
      //accepted user ?
      // setRoom((prev) => prev ? { ...prev,
      //   acceptedUsers: prev.acceptedUsers?.filter((u) => u.id !== user.id) } : null);  
    });

    socket.on('room_banned', (roomId, user) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        bannedUsers: prev.bannedUsers ? [...prev.bannedUsers, user] : [user],
        admins: prev.admins?.filter((u) => u.id !== user.id),
        acceptedUsers: prev.acceptedUsers?.filter((u) => u.id !== user.id),
      } : null);
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
      setRoom((prev) => prev ? {
        ...prev,
        bannedUsers: prev.bannedUsers?.filter((u) => u.id !== userId),
      } : null);
    });

    /* ROOM ADMIN */
    socket.on('room_admin_added', (roomId, user) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        admins: prev.admins ? [...prev.admins, user] : [user],
      } : null);
      if (userData.id === user.id) {
        // setIsAdmin(true);
        dispatch(setMsgSnackbar('You are now admin of the room ' + conv.room.name));
      }
    });

    socket.on('room_admin_removed', (roomId, userId) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        admins: prev.admins?.filter((u) => u.id !== userId),
      } : null);
      if (userData.id === userId) {
        // setIsAdmin(false);
        dispatch(setWarningSnackbar('You are no longer admin of the room ' + conv.room.name));
      }
    });

    /* OWNER */
    socket.on('room_owner_added', (roomId, user) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        owner: user,
      } : null);
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
  }, [conv, dispatch, id, navigate, userData]);

  // get messages
  const fetchOldMessages = useCallback(async () => {
    if (id === '-1' || !conv) return;
    setShouldScrollToBottom(false);
    console.log('fetch old messages');

    // setIsLoadingPagination(true);
    const allMessages: ChatMsgInterface[] | ApiErrorResponse = await chatOldMessages(id, pageDisplay, offsetPagniation);
    // setIsLoadingPagination(false);

    if ('error' in allMessages)
      dispatch(setErrorSnackbar(allMessages.error + allMessages.message ? ': ' + allMessages.message : ''));
    else {
      if (allMessages.length === 0) return;

      //save pos scrool
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (!scrollContainer) return;
      const oldScrollHeight = scrollContainer.scrollHeight;

      if (pageDisplay === 1)
        setMessages(allMessages.reverse());
      else {
        const reversedMessageArray = allMessages.reverse().filter((message) => !messages.some((msg) => msg.id === message.id));
        setMessages((prev) => [...reversedMessageArray, ...prev]);
      }

      //set pos scrool to top old messages
      requestAnimationFrame(() => {
        const newScrollHeight = scrollContainer.scrollHeight;
        scrollContainer.scrollTop += newScrollHeight - oldScrollHeight;
        setShouldScrollToBottom(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageDisplay]);

  const fetchRoomData = useCallback(async () => {
    if (conv == null) {
      dispatch(setErrorSnackbar('Nop'));
      navigate('/chat/channel');
      return;
    }
    if (!conv.room.id || conv.room.id === -1) return;
    const roomData: RoomInterface | ApiErrorResponse = await getRoomData((conv.room.id).toString());
    // console.log('roomData : ', roomData);
    if (roomData && 'error' in roomData)
      dispatch(setErrorSnackbar(roomData.error + roomData.message ? ': ' + roomData.message : ''));
    else {
      setRoom(roomData);

      //check if user is accepted in room
      if (roomData.users && roomData.acceptedUsers) {
        const isUserInRoom = roomData.users.some((u) => u.id === userData.id)
          || roomData.acceptedUsers.some((u) => u.id === userData.id);
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
        console.log('room delete, conv : ', conv);
        dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
        dispatch(setWarningSnackbar('Room ' + conv.room.name + ' was deleted'));
        navigate('/chat/channel');
      } else {
        console.log('WTF ?');
      }
    }
  }, [conv, dispatch, id, navigate, userData]);

  useEffect(() => {
    if (!room || !userData) return;
    if (room.admins) setIsAdmin(room.admins.some((admin) => admin.id === userData.id));
  }, [room, userData]);



  useEffect(() => {
    if (!room || !userData.id ) return;
    if (room.bannedUsers?.some((u) => u.id === userData.id)) {
      console.log('kick user');
      socketRef.current?.emit('leaveRoom', {
        roomId: id,
      });
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
      navigate('/chat/channel');
      dispatch(setWarningSnackbar('You have been banned from the room ' + conv.room.name));
    }
    connectSocketChat();
    return () => {
      if (socketRef.current) {
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
  }, [connectSocketChat, id, room, userData.id, room?.bannedUsers, dispatch, conv, navigate]);

  useEffect(() => {
    fetchOldMessages();
  }, [fetchOldMessages, room]);

  useEffect(() => {
    if (!userData.id || userData.id == -1) return;
    fetchRoomData();
  }, [fetchRoomData, id, userData.id]);

  // useEffect(() => {
  //   console.log('conv : ', conv);
  // }, [conv]);

  // useEffect(() => {
  //   console.log('room : ', room);
  // }, [room]);






  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
    console.log('messages : ', messages);
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
    if (element.scrollTop === 0) {
      setPageDisplay((prev) => prev + 1);
      //display waiting message
    }
  };

  const handleDeleteChannel = async () => {
    if (!room) return;
    const resDeleteChannel: RoomInterface | ApiErrorResponse = await deleteChannel(room.id);
    console.log('resDeleteChannel : ', resDeleteChannel);
    if (typeof resDeleteChannel === 'object' && 'error' in resDeleteChannel)
      dispatch(setErrorSnackbar(resDeleteChannel.error + resDeleteChannel.message ? ': ' + resDeleteChannel.message : ''));
    else {
      dispatch(setMsgSnackbar('Channel deleted'));
      dispatch(reduxRemoveConversationToList({ item: conv, userId: userData.id }));
      setIsAdminMenuOpen(false);
      navigate('/chat');
    }
  };


  return (
    <>
      {!room ? <p>loading...</p> :
        <div className="flex flex-col h-full">
          <div className="w-full flex text-lg text-blue justify-between">

            {isAdmin && room && <InvitationRoom room={room} setRoom={setRoom} /> }
            {/* <div className="w-full text-center"> */}
              <p className='font-bold text-lg py-1'>{name.toUpperCase()}</p>
            {/* </div> */}
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
              {messages &&
                <div className='text-lg m-1 p-2 '>
                  {/* { isLoadingPagination && <CircularProgress className='mx-auto' />} */}
                  {messages.map((message: ChatMsgInterface) => (
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
                      <span className={`
                  ${statusSendMsg == 'pending' ? 'bg-yellow-500' : 'bg-red-500'}
                  bottom-16 
                  text-white
                  p-2
                  rounded-xl
                  shadow-lg`}
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
            { room.users && room.acceptedUsers && room.admins &&
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

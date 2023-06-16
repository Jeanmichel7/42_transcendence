import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar, setWarningSnackbar } from '../../../store/snackbarSlice';

import MessageItem from './MessageItem';

import { chatOldMessages, deleteChatMessage, getRoomData, sendChatMessage } from '../../../api/chat';

import { ApiErrorResponse } from '../../../types';
import { ChatMsgInterface, ConversationInterface, RoomInterface } from '../../../types/ChatTypes';

import { BiPaperPlane } from 'react-icons/bi';
import { Badge, Button, TextareaAutosize, Typography } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store';
import SideBarAdmin from '../Channel/admin/SidebarAdmin';
import { reduxRemoveConversationToList } from '../../../store/chatSlicer';

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

  // const [indexMsgChatBot, setIndexMsgChatBot] = useState<number>(-1);
  const [room, setRoom] = useState<RoomInterface | null>(null);
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
      } : null);
    });

    socket.on('room_leave', (roomId, userId) => {
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        users: prev.users?.filter((u) => u.id !== userId),
      } : null);
      setRoom((prev) => prev ? {
        ...prev,
        admins: prev.admins?.filter((u) => u.id !== userId),
      } : null);
      //accepted user ?
      // setRoom((prev) => prev ? { ...prev,
      //   acceptedUsers: prev.acceptedUsers?.filter((u) => u.id !== userId) } : null);
    });

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
      console.log('room_kicked : ', roomId, userId);
      if (roomId !== id) return;
      setRoom((prev) => prev ? {
        ...prev,
        users: prev.users?.filter((u) => u.id !== userId),
      } : null);
      setRoom((prev) => prev ? {
        ...prev,
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
      } : null);
      // setRoom((prev) => prev ? { ...prev,
      // users: prev.users?.filter((u) => u.id !== user.id) } : null);
      setRoom((prev) => prev ? {
        ...prev,
        admins: prev.admins?.filter((u) => u.id !== user.id),
      } : null);
      //accepted user ?
      // setRoom((prev) => prev ? { ...prev,
      //   acceptedUsers: prev.acceptedUsers?.filter((u) => u.id !== user.id) } : null);
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

    socket.on('error', (error) => { console.log('erreur socket : ', error); });

    //connect to room
    socket.emit('joinRoom', {
      roomId: id,
    });

    socketRef.current = socket;
  }, [id]);

  // get messages
  const fetchOldMessages = useCallback(async () => {
    if (id === '-1') return;
    setShouldScrollToBottom(false);

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
    if (!conv.room.id || conv.room.id === -1) return;
    const roomData: RoomInterface | ApiErrorResponse = await getRoomData((conv.room.id).toString());
    if (roomData && 'error' in roomData)
      dispatch(setErrorSnackbar(roomData.error + roomData.message ? ': ' + roomData.message : ''));
    else {
      setRoom(roomData);

    }
  }, [dispatch, conv]);

  useEffect(() => {
    if (!room || !userData) return;
    if (room.admins) setIsAdmin(room.admins.some((admin) => admin.id === userData.id));
  }, [room, userData]);




  useEffect(() => {
    if (!room || !userData.id || !room.bannedUsers) return;
    if (room?.bannedUsers?.some((u) => u.id === userData.id)) {
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
  }, [fetchOldMessages]);

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData, id]);

  useEffect(() => {
    console.log('conv : ', conv);
  }, [conv]);

  useEffect(() => {
    console.log('room : ', room);
  }, [room]);






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
    if (element.scrollTop === 0) {
      setPageDisplay((prev) => prev + 1);
      //display waiting message
    }
  };


  return (
    <>
      <div className="flex flex-col h-full">
        <div className="w-full flex text-lg text-blue">

          <Button
            className='text-blue-500'
            onClick={() => dispatch(setMsgSnackbar('Coming soon'))}
            sx={{ mr: 2 }}
          >
            Invite
          </Button>
          <div className="w-full text-center">
            <p className='font-bold text-lg py-1'>{name.toUpperCase()}</p>
          </div>

          {isAdmin && room && <SideBarAdmin room={room} setIsAdminMenuOpen={setIsAdminMenuOpen} />}
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
          <div className='w-[150px]'>
            {room && room.users && <h3> MEMBRES - {room.users.length} </h3>
              && room.users.map((user) => (
                <Link 
                  key={user.id} 
                  to={'/profile/' + user.login}
                  className="flex flex-grow text-black p-1 pl-2 items-center "
                >
                  <Badge
                    color={
                      user.status === 'online' ? 'success' :
                        user.status === 'absent' ? 'warning' :
                          'error'
                    }
                    overlap="circular"
                    badgeContent=" "
                    variant="dot"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    sx={{ '.MuiBadge-badge': { transform: 'scale(1.2) translate(-25%, 25%)' } }}
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover mr-2 "
                      src={user.avatar}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
                      }}
                      alt="avatar"
                    />
                  </Badge>
                  <Typography component="span"
                    sx={{
                      overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
                      color: user.status === 'online' ? 'success' : 'error',
                    }}
                    title={user.login}
                  >
                    {user.login.length > 15 ? user.login.slice(0, 12) + '...' : user.login}
                  </Typography>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelConversation;

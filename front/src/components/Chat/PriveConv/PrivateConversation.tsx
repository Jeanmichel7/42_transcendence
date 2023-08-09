import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import FormPriveConv from './FormPriveConv';
import MessageItem from '../MessageItem';
import { getOldMessages, apiDeleteMessage } from '../../../api/message';
import { ApiErrorResponse, GameInterface, UserInterface, UserRelation } from '../../../types';
import { MessageInterface } from '../../../types/ChatTypes';

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';

import { CircularProgress, IconButton, Tooltip, Zoom } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { inviteGameUser } from '../../../api/game';
import { reduxRemoveConversationToList, reduxResetNotReadMP } from '../../../store/convListSlice';
import { apiBlockUser, deleteFriend, requestAddFriend } from '../../../api/relation';
import { reduxAddUserBlocked, reduxAddWaitingFriendsSent, reduxRemoveFriends } from '../../../store/userSlice';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getProfileByPseudo } from '../../../api/user';

const PrivateConversation: React.FC = () => {
  const convId = (useParams<{ convId: string }>().convId || '-1') ;
  const id = (useParams<{ id: string }>().id || '-1') ;
  const login = (useParams<{ login: string }>().login || 'unknown') ;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const userFriend: UserInterface[] = useSelector((state: RootState) => state.user.userFriends);

  const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  // const [isLoadingPagination, setIsLoadingPagination] = useState<boolean>(false);
  const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const isFriends = userFriend?.some((friend) => friend.id === id) || false;

  // useEffect(() => {
  //   console.log('userFriend : ', userFriend);
  // }, [userFriend]);

  const fetchOldMessages = useCallback(async () => {
    if (id == '-1' || userData.id == -1 ) return;
    setShouldScrollToBottom(false);

    const allMessages: MessageInterface[] | ApiErrorResponse = await getOldMessages(id, pageDisplay, offsetPagniation);
    if ('error' in allMessages)
      dispatch(setErrorSnackbar(allMessages.error + allMessages.message ? ': ' + allMessages.message : ''));
    else {
      dispatch(
        reduxResetNotReadMP({ userIdFrom: id, userId: userData.id }),
      );
      if (allMessages.length === 0) return;
      //save pos scrool
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if (!scrollContainer) return;
      const oldScrollHeight = scrollContainer.scrollHeight;

      if (pageDisplay === 1) {
        setMessages(allMessages.reverse());
      } else {
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
  }, [id, userData.id, pageDisplay]);

  const connectSocket = useCallback(() => {
    if (id == '-1' || userData.id == -1 ) return;
    const socket = io('http://localhost:3000/messagerie', {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    //listen on /message
    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
      setOffsetPagniation((prev) => prev + 1);
    });

    socket.on('editMessage', (message) => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages.map((msg) => {
          if (msg.id === message.id)
            return { ...msg, text: message.text, updatedAt: message.updatedAt };
          return msg;
        });
        return newMessages;
      });
    });

    socket.on('deleteMessage', (message) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
      setOffsetPagniation((prev) => prev - 1);
    });

    socket.on('error', (error) => { console.log('erreur socket : ', error); });

    socket.emit('joinPrivateRoom', {
      user1Id: userData.id,
      user2Id: id,
    });
    socketRef.current = socket;
  }, [userData.id, id]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current === null) return;
      socketRef.current.off('message');
      socketRef.current.off('editMessage');
      socketRef.current.off('deleteMessage');
      socketRef.current.emit('leavePrivateRoom', {
        user1Id: userData.id,
        user2Id: id,
      });
      socketRef.current.disconnect();
    };
  }, [userData.id, id, connectSocket]);

  useEffect(() => {
    fetchOldMessages();
  }, [pageDisplay, id, userData.id, fetchOldMessages, dispatch]);


  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    // console.log('messages : ', messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);



  //scrool top = fetch new page messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.target as HTMLDivElement;
    if (element.scrollTop === 0) {
      setPageDisplay((prev) => prev + 1);
      //display waiting message
    }
  };

  const handleBlockUser = async () => {
    setIsLoading(true);
    const resBlockRequest: UserRelation | ApiErrorResponse = await apiBlockUser(
      +id,
    );
    setIsLoading(false);

    if ('error' in resBlockRequest)
      dispatch(
        setErrorSnackbar(
          resBlockRequest.error + resBlockRequest.message
            ? ': ' + resBlockRequest.message
            : '',
        ),
      );
    else {
      dispatch(reduxAddUserBlocked(+id));
      dispatch(setMsgSnackbar('User blocked'));
    }
  };

  const handleDeleteFriend = async () => {
    setIsLoading(true);
    const resDeleteRequest: void | ApiErrorResponse = await deleteFriend(
      +id,
    );
    setIsLoading(false);

    if (typeof resDeleteRequest === 'object' && 'error' in resDeleteRequest)
      dispatch(
        setErrorSnackbar(
          resDeleteRequest.error + resDeleteRequest.message
            ? ': ' + resDeleteRequest.message
            : '',
        ),
      );
    else {
      dispatch(reduxRemoveFriends(+id));
      dispatch(reduxRemoveConversationToList({
        convId: +convId,
        userId: userData.id,
      }));
      // dispatch(setMsgSnackbar('Friend deleted'));
      navigate('/chat');
    }
  };

  const handleAddFriend = async () => {

    const getUser: UserInterface | ApiErrorResponse = await getProfileByPseudo(login);
    if ('error' in getUser)
      return dispatch(setErrorSnackbar(getUser.error + getUser.message ? ': ' + getUser.message : ''));
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(
      +id,
    );
    if ('error' in res) {
      dispatch(
        setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''),
      );
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(getUser));
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    setIsLoadingDeleteMsg(true);
    const res: HttpStatusCode | ApiErrorResponse = await apiDeleteMessage(msgId);
    setIsLoadingDeleteMsg(false);

    if (typeof res === 'object' && 'error' in res)
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    else {
      setMessages((prev) => prev.filter((message) => message.id !== msgId));
      dispatch(setMsgSnackbar('Message deleted'));
    }
  };

  const handleDefi = async () => {
    const resInvitGameUser: GameInterface | ApiErrorResponse =
       await inviteGameUser(parseInt(id));
    if ('error' in resInvitGameUser)
      return dispatch(setErrorSnackbar(resInvitGameUser.error + resInvitGameUser.message ? ': ' + resInvitGameUser.message : ''));
    dispatch(setMsgSnackbar('Invitation sent'));
  };


  return (
    <>
      {/* { (id == '-1' || login == 'unknown' || userData.id == -1 ) ?
       <CircularProgress className='mx-auto' />
        : */}
      <div className="flex flex-col h-full justify-between">
        <div className="flex w-full justify-between items-center text-lg text-blue text-center">
          <div className='mr-6'>
          <Tooltip
              title="Defi"
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
              sx={{ p:0, paddingX:1, m:0 }}
            >
              <IconButton
                onClick={handleDefi}
                color="success"
              >
                <SportsEsportsIcon />
              </IconButton>
            </Tooltip>
          </div>

          <p className='font-bold text-lg py-1'>
            <Link to={`/profile/${login}`} >
              {login.toUpperCase()}
            </Link>
          </p>

          <div>
            {isFriends
              ? <Tooltip
                  title="Remove friend"
                  arrow
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 600 }}
                  sx={{ p: 0, paddingX: 1, m: 0 }}
                >
                  <IconButton
                    onClick={handleDeleteFriend}
                    color="warning"
                  >
                    <PersonRemoveIcon />
                  </IconButton>
                </Tooltip>
              : <Tooltip
                  title="Add friend"
                  arrow
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 600 }}
                  sx={{ p: 0, paddingX: 1, m: 0 }}
                >
                  <IconButton
                    onClick={handleAddFriend}
                    color="success"
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
            }
            <Tooltip
              title="Block friend"
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
              sx={{ p:0, paddingX:1, m:0 }}
            >
              <IconButton
                onClick={handleBlockUser}
                color="error"
              >
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </div>
          {isLoading && <CircularProgress />}
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-108px)] bg-[#efeff8]" onScroll={handleScroll}>
          {/* display messages */}
          {messages &&
            <div className='text-lg m-1 p-2 '>
              {/* { isLoadingPagination && <CircularProgress className='mx-auto' />} */}
              {messages.map((message: MessageInterface) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isLoadingDeleteMsg={isLoadingDeleteMsg}
                  handleDeleteMessage={handleDeleteMessage}
                />
              ))}

              {/* display form message */}
              <div className="sticky bottom-0 px-1 pb-1 bg-[#efeff8]">
                <FormPriveConv setShouldScrollToBottom={setShouldScrollToBottom} />
              </div>
            </div>
          }
          <div ref={bottomRef}></div>
        </div>

      </div>
      {/* } */}
    </>
  );
};

export default PrivateConversation;




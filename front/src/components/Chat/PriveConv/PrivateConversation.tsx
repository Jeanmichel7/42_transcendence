import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import FormPriveConv from './FormPriveConv';
import MessageItem from '../MessageItem';
import { getOldMessages, apiDeleteMessage } from '../../../api/message';
import {
  ApiErrorResponse,
  GameInterface,
  UserInterface,
  UserRelation,
} from '../../../types';
import {
  ConversationInterface,
  MessageInterface,
} from '../../../types/ChatTypes';

import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import BlockIcon from '@mui/icons-material/Block';

import { CircularProgress, IconButton, Tooltip, Zoom } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { inviteGameUser } from '../../../api/game';
import {
  reduxAddConversationList,
  reduxRemoveConversationToList,
  reduxResetNotReadMP,
  reduxUpdatePrivateConvList,
} from '../../../store/convListSlice';
import {
  apiBlockUser,
  apiUnblockUser,
  deleteFriend,
  requestAddFriend,
} from '../../../api/relation';
import {
  reduxAddUserBlocked,
  reduxAddWaitingFriendsSent,
  reduxRemoveFriends,
  reduxRemoveUserBlocked,
} from '../../../store/userSlice';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getProfileByPseudo } from '../../../api/user';

const PrivateConversation: React.FC = () => {
  const convId = +(useParams<{ convId: string }>().convId || '-1');
  const id = +(useParams<{ id: string }>().id || '-1');
  const login = useParams<{ login: string }>().login || 'unknown';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData: UserInterface = useSelector(
    (state: RootState) => state.user.userData,
  );
  const userFriend: UserInterface[] | null = useSelector(
    (state: RootState) => state.user.userFriends,
  );
  const userBlocked: UserInterface[] | null = useSelector(
    (state: RootState) => state.user.userBlocked,
  );
  const ConversationList: ConversationInterface[] | null = useSelector(
    (state: RootState) => state.chat.conversationsList,
  );

  const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDefi, setIsLoadingDefi] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(true);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const fetchOldMessages = useCallback(async () => {
    if (id == -1 || userData.id == -1) return;
    setShouldScrollToBottom(false);

    const allMessages: MessageInterface[] | ApiErrorResponse =
      await getOldMessages(id, pageDisplay, offsetPagniation);
    if ('error' in allMessages) dispatch(setErrorSnackbar(allMessages));
    else {
      dispatch(reduxResetNotReadMP({ userIdFrom: id, userId: userData.id }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userData.id, pageDisplay]);

  const connectSocket = useCallback(() => {
    if (id == -1 || userData.id == -1) return;
    const socket = io('/messagerie', {
      withCredentials: true,
    });
    socket.on('message', message => {
      setMessages(prevMessages => [...prevMessages, message]);
      setOffsetPagniation(prev => prev + 1);
    });

    socket.on('editMessage', message => {
      setMessages(prevMessages => {
        const newMessages = prevMessages.map(msg => {
          if (msg.id === message.id)
            return { ...msg, text: message.text, updatedAt: message.updatedAt };
          return msg;
        });
        return newMessages;
      });
    });

    socket.on('deleteMessage', message => {
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.id !== message.id),
      );
      setOffsetPagniation(prev => prev - 1);
    });

    socket.on('error', error => {
      console.warn('erreur socket : ', error);
    });

    socket.emit('joinPrivateRoom', {
      user1Id: userData.id,
      user2Id: id,
    });
    socketRef.current = socket;
  }, [userData.id, id]);

  const checkUpdateUser = useCallback(async () => {
    if (id == -1 || userData.id == -1 || !login) return;

    const userFetch: UserInterface | ApiErrorResponse =
      await getProfileByPseudo(login);
    if ('error' in userFetch) dispatch(setErrorSnackbar(userFetch));
    else {
      // check diff before update
      dispatch(
        reduxUpdatePrivateConvList({
          item: userFetch,
          userId: userData.id,
        }),
      );

      if (ConversationList === null) return;
      if (ConversationList.some(conv => conv.id == convId)) return;
      dispatch(
        reduxAddConversationList({
          item: userFetch,
          userId: userData.id,
        }),
      );
    }
  }, [id, userData.id, login, dispatch]);

  useEffect(() => {
    connectSocket();
    checkUpdateUser();

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
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (id == -1 || !userFriend) return;
    setIsFriend(userFriend.some(f => f.id == id));
  }, [id, userFriend]);

  useEffect(() => {
    if (id == -1 || !userBlocked) return;
    setIsBlocked(userBlocked.some(f => f.id == id));
  }, [id, userBlocked]);

  //scrool top = fetch new page messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = e.target as HTMLDivElement;
    if (element.scrollTop === 0) {
      setPageDisplay(prev => prev + 1);
    }
  };

  /* USER RELATION */
  const handleBlockUser = async () => {
    setIsLoading(true);
    const getUser: UserInterface | ApiErrorResponse = await getProfileByPseudo(
      login,
    );
    if ('error' in getUser) return dispatch(setErrorSnackbar(getUser));
    const resBlockRequest: UserRelation | ApiErrorResponse = await apiBlockUser(
      id,
    );
    if ('error' in resBlockRequest) dispatch(setErrorSnackbar(resBlockRequest));
    else {
      dispatch(reduxAddUserBlocked(getUser));
      dispatch(setMsgSnackbar('User blocked'));
    }
    setIsLoading(false);
  };

  const handleUnblockUser = async () => {
    setIsLoading(true);
    const resUnblockRequest: void | ApiErrorResponse = await apiUnblockUser(id);
    setIsLoading(false);

    if (typeof resUnblockRequest === 'object' && 'error' in resUnblockRequest)
      dispatch(setErrorSnackbar(resUnblockRequest));
    else {
      dispatch(reduxRemoveUserBlocked(id));
      dispatch(setMsgSnackbar('User unblocked'));
    }
  };

  const handleAddFriend = async () => {
    const getUser: UserInterface | ApiErrorResponse = await getProfileByPseudo(
      login,
    );
    if ('error' in getUser) return dispatch(setErrorSnackbar(getUser));
    const res: UserRelation | ApiErrorResponse = await requestAddFriend(id);
    if ('error' in res) {
      dispatch(setErrorSnackbar(res));
    } else {
      dispatch(setMsgSnackbar('Request sent'));
      dispatch(reduxAddWaitingFriendsSent(getUser));
    }
  };

  const handleDeleteFriend = async () => {
    setIsLoading(true);
    const resDeleteRequest: void | ApiErrorResponse = await deleteFriend(id);
    setIsLoading(false);

    if (typeof resDeleteRequest === 'object' && 'error' in resDeleteRequest)
      dispatch(setErrorSnackbar(resDeleteRequest));
    else {
      dispatch(reduxRemoveFriends(id));
      dispatch(
        reduxRemoveConversationToList({
          convId: convId,
          userId: userData.id,
        }),
      );
      navigate('/chat');
    }
  };

  /* HANDLE MESSAGE*/
  const handleDeleteMessage = async (msgId: number) => {
    setIsLoadingDeleteMsg(true);
    const res: HttpStatusCode | ApiErrorResponse = await apiDeleteMessage(
      msgId,
    );
    setIsLoadingDeleteMsg(false);

    if (typeof res === 'object' && 'error' in res)
      dispatch(setErrorSnackbar(res));
    else {
      setMessages(prev => prev.filter(message => message.id !== msgId));
    }
  };

  const handleDefi = async () => {
    setIsLoadingDefi(true);
    const resInvitGameUser: GameInterface | ApiErrorResponse =
      await inviteGameUser(id);
    if ('error' in resInvitGameUser)
      return dispatch(setErrorSnackbar(resInvitGameUser));
    dispatch(setMsgSnackbar('Invitation sent'));
    setTimeout(() => {
      setIsLoadingDefi(false);
    }, 3 * 1000);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex w-full justify-between items-center text-lg text-blue text-center bg-slate-200">
        <div className="mr-6">
          <Tooltip
            title="Defi"
            arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
            sx={{ p: 0, paddingX: 1, m: 0 }}
          >
            <IconButton
              onClick={handleDefi}
              color="success"
              disabled={isLoadingDefi}
            >
              <SportsEsportsIcon />
            </IconButton>
          </Tooltip>
        </div>

        <p className="font-bold text-lg py-1">
          <Link to={`/profile/${login}`}>{login.toUpperCase()}</Link>
        </p>

        <div>
          {isFriend ? (
            <Tooltip
              title="Remove friend"
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
              sx={{ p: 0, paddingX: 1, m: 0 }}
            >
              <IconButton onClick={handleDeleteFriend} color="warning">
                <PersonRemoveIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip
              title="Add friend"
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
              sx={{ p: 0, paddingX: 1, m: 0 }}
            >
              <IconButton onClick={handleAddFriend} color="success">
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
          )}
          {isBlocked ? (
            <Tooltip
              title="Unblock friend"
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
              sx={{ p: 0, paddingX: 1, m: 0 }}
            >
              <IconButton onClick={handleUnblockUser} color="warning">
                <BlockIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip
              title="Block friend"
              arrow
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 600 }}
              sx={{ p: 0, paddingX: 1, m: 0 }}
            >
              <IconButton onClick={handleBlockUser} color="error">
                <BlockIcon />
              </IconButton>
            </Tooltip>
          )}
        </div>
        {isLoading && <CircularProgress />}
      </div>

      <div
        className="overflow-y-auto max-h-[calc(100vh-108px)]"
        onScroll={handleScroll}
      >
        {/* display messages */}
        {messages && (
          <div className="text-lg m-1 p-2 ">
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
              <FormPriveConv
                setShouldScrollToBottom={setShouldScrollToBottom}
              />
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default PrivateConversation;

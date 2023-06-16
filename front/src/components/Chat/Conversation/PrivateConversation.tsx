import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import MessageItem from './MessageItem';

import { sendMessage, getOldMessages, apiDeleteMessage } from '../../../api/message';

import { ApiErrorResponse, UserInterface } from '../../../types';
import { MessageInterface } from '../../../types/ChatTypes';

import { BiPaperPlane } from 'react-icons/bi';
import { TextareaAutosize } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useParams } from 'react-router-dom';



const PrivateConversation: React.FC = () => {
  const id = (useParams<{ id: string }>().id || '-1') ;
  const login = (useParams<{ login: string }>().login || 'unknown') ;
  const dispatch = useDispatch();

  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [text, setText] = useState<string>('');
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  // const [isLoadingPagination, setIsLoadingPagination] = useState<boolean>(false);
  const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] = useState<boolean>(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const fetchOldMessages = useCallback(async () => {
    console.log('fetchOldMessages');
    if (id == '-1' || userData.id == -1 ) return;
    setShouldScrollToBottom(false);

    // setIsLoadingPagination(true);
    const allMessages: MessageInterface[] | ApiErrorResponse = await getOldMessages(id, pageDisplay, offsetPagniation);
    // setIsLoadingPagination(false);

    if ('error' in allMessages)
      dispatch(setErrorSnackbar(allMessages.error + allMessages.message ? ': ' + allMessages.message : ''));
    else {
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
    console.log('connectSocket user ', id);
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
          if (msg.id === message.id) {
            return { ...msg, text: message.text, updatedAt: message.updatedAt };
          }
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
      console.log('disconnectSocket');
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
  }, [pageDisplay, id, userData.id, fetchOldMessages]);








  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    console.log('messages : ', messages);
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

  // delete message
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

    const newMessage: MessageInterface | ApiErrorResponse = await sendMessage(text, id);
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

  return (
    <>
      {/* { (id == '-1' || login == 'unknown' || userData.id == -1 ) ?
       <CircularProgress className='mx-auto' />
        : */}
      <div className="flex flex-col h-full justify-between">
        <div className="w-full text-lg text-blue text-center">
          <p className='font-bold text-lg py-1'>{login.toUpperCase()}</p>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-275px)] bg-[#efeff8]" onScroll={handleScroll}>
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




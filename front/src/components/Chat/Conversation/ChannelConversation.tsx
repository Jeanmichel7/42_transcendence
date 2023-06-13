import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

import { useDispatch } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import MessageItem from './MessageItem';

import { chatOldMessages, deleteChatMessage, sendChatMessage } from '../../../api/chat';

import { ApiErrorResponse } from '../../../types';
import { ChatMsgInterface } from '../../../types/ChatTypes';

import { BiPaperPlane } from 'react-icons/bi';
import { Button, TextareaAutosize } from '@mui/material';
import { HttpStatusCode } from 'axios';
import { useParams } from 'react-router-dom';

const ChannelConversation: React.FC = () => {
  const id = (useParams<{ id: string }>().id || '-1') ;
  const name = (useParams<{ name: string }>().name || 'unknown') ;
  const dispatch = useDispatch();

  const [offsetPagniation, setOffsetPagniation] = useState<number>(0);
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<ChatMsgInterface[]>([]);
  const [text, setText] = useState<string>('');
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  // const [isLoadingPagination, setIsLoadingPagination] = useState<boolean>(false);
  const [isLoadingDeleteMsg, setIsLoadingDeleteMsg] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // connect socket
  const connectSocketChat = useCallback(() => {
    console.log('conection to socket room id : ', id);
    const socket = io('http://localhost:3000/chat', {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    socket.on('room_joined', (message) => {
      console.log('room joined ! ', message);
    });

    //listen on /message
    socket.on('chat_message', (message: ChatMsgInterface, acknowledge) => {
      console.log('new message : ', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
      setOffsetPagniation((prev) => prev + 1);
      acknowledge(true);
    });

    socket.on('chat_message_edit', (message) => {
      console.log('edit message : ', message);
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
      console.log('delete message : ', message);
      // console.log('message id : ', message.id);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));
      setOffsetPagniation((prev) => prev - 1);
    });

    socket.on('error', (error) => { console.log('erreur socket : ', error); });

    //connect to room
    socket.emit('joinRoom', {
      roomId: id,
    });

    return () => {
      socket.off('chat_message');
      socket.off('chat_message_edit');
      socket.off('chat_message_delete');
      socket.emit('leaveRoom', {
        roomId: id,
      });
      socket.disconnect();
    };

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

  
  useEffect(() => {
    connectSocketChat();
  }, [connectSocketChat]);

  useEffect(() => {
    fetchOldMessages();
  }, [fetchOldMessages]);

  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
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


  return (
    <>
      <div className="flex flex-col h-full justify-between">
        <div className="w-full flex justify-between items-center text-lg text-blue text-center">
          <div className="w-full text-center">
            <p className='font-bold text-lg py-1'>{name.toUpperCase()}</p>
          </div>
          <Button
            className='text-blue-500'
            onClick={() => dispatch(setMsgSnackbar('Coming soon'))}
            sx={{ mr: 2 }}
          >
            Invite
          </Button>
          <Button
            className='text-blue-500'
            onClick={() => dispatch(setMsgSnackbar('Coming soon'))}
            sx={{ mr: 2 }}
          >
            Adminitration
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-275px)] bg-[#efeff8]" onScroll={handleScroll}>
          {/* display messages */}
          { messages &&
            <div className='text-lg m-1 p-2 '>
              {/* { isLoadingPagination && <CircularProgress className='mx-auto' />} */}
              {messages.map((message: ChatMsgInterface) => (
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

            </div> }
          <div ref={bottomRef}></div>
        </div>

      </div>
    </>
  );
};

export default ChannelConversation;

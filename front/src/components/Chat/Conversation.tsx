import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';

import MessageItem from './ConversationItem';

import { sendMessage, getOldMessages, apiDeleteMessage } from '../../api/chat';

import { ApiErrorResponse, UserInterface } from '../../types';
import { MessageInterface } from '../../types/ChatTypes';

import { BiPaperPlane } from 'react-icons/bi';
import { TextareaAutosize } from '@mui/material';

interface ConversationProps {
  id: number;
}

const Conversation: React.FC<ConversationProps> = ({ id }) => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [text, setText] = useState<string>('');
  const [pageDisplay, setPageDisplay] = useState<number>(1);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // connect socket
  const connectSocket = useCallback(() => {
    if (id == -1) return;
    if (userData.id == -1) return;
    const socket = io('http://localhost:3000/messagerie', {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });


    //connect to room
    socket.emit('joinPrivateRoom', {
      user1Id: userData.id,
      user2Id: id,
    });
 
    //listen on /message
    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
    });

    return () => {
      socket.off('message');
      // socket.emit('leaveRoom', {
      //   user1Id: userData.id,
      //   user2Id: id,
      // });
      socket.disconnect();
    };
  }, [userData.id, id]);

  // get messages
  const fetchOldMessages = useCallback(async () => {
    if (id == -1) return;
    setShouldScrollToBottom(false);

    const allMessages: MessageInterface[] | ApiErrorResponse = await getOldMessages(id, pageDisplay);
    if ('error' in allMessages)
      dispatch(setErrorSnackbar('Error get old messages: ' + allMessages.error));
    else {
      //save pos scrool
      const scrollContainer = document.querySelector('.overflow-y-auto');
      if ( !scrollContainer ) return;
      const oldScrollHeight = scrollContainer.scrollHeight;

      const reversedMessageArray = allMessages.reverse();
      setMessages((prev) => [...reversedMessageArray, ...prev]);
      
      //set pos scrool to top old messages
      requestAnimationFrame(() => {
        const newScrollHeight = scrollContainer.scrollHeight;
        scrollContainer.scrollTop += newScrollHeight - oldScrollHeight;
        setShouldScrollToBottom(true);
      });
    }
  }, [dispatch, pageDisplay, id]);



  useEffect(() => {
    connectSocket();
  }, [connectSocket]);


  // get old messages en fct de l'user selectionne
  useEffect(() => {
    fetchOldMessages();
  }, [pageDisplay, fetchOldMessages]);

  // scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
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
    const res = await apiDeleteMessage(id);
    if (typeof res === 'object' && 'error' in res)
      dispatch(setErrorSnackbar('Error delete message: ' + res.error));
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
    if (text.trim() === '') return;
    e.preventDefault();
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
      {id == -1 ?
        <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
          Select a user to start a conversation
        </div>
        :
        <div className="flex flex-col h-full justify-between">
          {/* <div className="w-full text-lg text-blue text-center">
            {login}
          </div> */}

          <div className="overflow-y-auto" onScroll={handleScroll}>

            {/* display messages */}
            <div className='text-lg m-1 p-2 '>
              {messages.map((message: MessageInterface) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  userDataId={userData.id}
                  handleDeleteMessage={handleDeleteMessage}
                />
              ))}
            </div>

 
            {/* display form message */}
            <form className="bg-gray-100 rounded-xl shadow-md flex border-2 border-zinc-400 mx-2">
              <TextareaAutosize
                ref={textareaRef}
                name="text"
                value={text}
                onChange={handleChangeTextArea(setText)}
                onKeyDown={handleSubmit()}
                placeholder="Enter your text here..."
                className="w-full p-2 rounded-lg m-1 pb-1 shadow-sm font-sans resize-none"
              />
              <button className='flex justify-center items-center'
                onClick={handleSubmit()}
              >
                <BiPaperPlane className=' text-2xl mx-2 text-cyan' />
              </button>

              {/* display status send message */}
              { statusSendMsg !== '' &&
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
                  <button className="absolute right-2 top-1" >X</button>
                </span>
              }
            </form>

          <div ref={bottomRef}></div>
          </div>

        </div>
      }
    </>
  );
};

export default Conversation;

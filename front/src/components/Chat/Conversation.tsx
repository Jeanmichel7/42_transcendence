import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setErrorSnackbar } from '../../store/snackbarSlice';

import MessageItem from './ConversationItem';

import { sendMessage, getOldMessages } from '../../api/chat';

import { ApiErrorResponse, UserInterface } from '../../types';
import { MessageInterface } from '../../types/ChatTypes';

import { BiPaperPlane } from 'react-icons/bi';


const Conversation = (userSelected: UserInterface) => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [text, setText] = useState<string>('');
  const [rows, setRows] = useState<number>(1);
  // const [hoveredMessageId, setHoveredMessageId] = useState<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // get old messages en fct de l'user selectionne
  useEffect(() => {
    if (userSelected.id == -1) return;

    // console.log('join room : ', userData);
    const socket = io('http://localhost:3000/messagerie', {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    //connect to room
    socket.emit('joinPrivateRoom', {
      user1Id: userData.id,
      user2Id: userSelected.id,
    });

    //listen on /message
    socket.on('message', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
    });


    async function fetchOldMessages() {
      const allMessages: MessageInterface[] | ApiErrorResponse = await getOldMessages(userSelected.id);
      if ('error' in allMessages)
        dispatch(setErrorSnackbar('Error get old messages: ' + allMessages.error));
      else
        setMessages(allMessages);
    }
    fetchOldMessages();

    return () => {
      socket.disconnect();
    };
  }, [userData.id, userSelected.id, dispatch]);


  // set approximatif de la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      if (text.length > 0) {
        setRows(
          Math.floor(text.length / (textareaRef.current.offsetWidth / 7))
          + text.split('\n').length,
        );
      } else {
        setRows(1);
      }
    }
  }, [text]);



  // scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, rows]);





  // send message
  const handleSubmit = () => async (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (e === null) return;
    if (typeof e === 'object' && 'key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    setStatusSendMsg('pending');
    const newMessage: MessageInterface | ApiErrorResponse = await sendMessage(text, userSelected.id);
    if ('error' in newMessage)
      setStatusSendMsg(newMessage.message);
    else
      setStatusSendMsg('');
    setText('');
  };

  /* currying method handler */
  const handleChangeTextArea = useCallback(
    (setTextFn: React.Dispatch<React.SetStateAction<string>>) => (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setTextFn(e.target.value);
    }, [],
  );


  return (
    userSelected.id == -1 &&
    <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
      Select a user to start a conversation
    </div>
    ||
    // <div ref={ref} className="flex flex-col h-full justify-between">
    <div className="flex flex-col h-full justify-between">
      <div className="w-full text-lg text-blue text-center">
        {userSelected.login}
      </div>

      <div className="overflow-y-auto">

        {/* display messages */}
        <div className='text-lg m-1 p-2 '>
          {messages.map((message: MessageInterface) => (
            <MessageItem
              key={message.id}
              message={message}
              // setMessages={setMessages}
            />
          ))}
           <div ref={bottomRef}></div>
        </div>

        {/* display form message */}
        <form
          className="bg-gray-100 rounded-xl shadow-md flex border-2 border-zinc-400 mx-2"
        >
          <textarea
            ref={textareaRef}
            name="text"
            rows={rows}
            value={text}
            onChange={handleChangeTextArea(setText)}
            onKeyDown={handleSubmit()}
            placeholder="Enter your text here..."
            className=" w-full p-2 rounded-lg m-1 pb-1 shadow-sm font-sans resize-none"
          ></textarea>
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
              <button className="absolute right-2 top-1" >X</button>
            </span>
          }
        </form>

      </div>
    </div>
  );
};


export default Conversation;

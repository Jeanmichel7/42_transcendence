import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sendMessage, getOldMessages } from '../../api/chat';
import { BiPaperPlane } from 'react-icons/bi';
import { io } from 'socket.io-client';
import { ApiErrorResponse, UserInterface } from '../../types';
import { RootState } from '../../store';
import { MessageInterface } from '../../types/ChatTypes';


const Conversation = (userSelected: UserInterface) => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);

  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [text, setText] = useState<string>('');
  const [rows, setRows] = useState<number>(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ref = useRef(document.createElement('div'));


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
        console.log(allMessages);
      else
        setMessages(allMessages);
    }
    fetchOldMessages();

    return () => {
      socket.disconnect();
    };
  }, [userData.id, userSelected.id]);


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
  }, [messages]);


  // send message
  const handleSubmit = async (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setStatusSendMsg('pending');
    const newMessage: MessageInterface | ApiErrorResponse = await sendMessage(text, userSelected.id);
    if ('error' in newMessage)
      setStatusSendMsg(newMessage.message);
    else
      setStatusSendMsg('');
    setText('');
  };


  function getTimeSince(time: Date): string {
    const now = new Date();
    const dataTime = new Date(time);
    const diff = now.getTime() - dataTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    let result = '';

    if (hours > 24)
      result += 'Le ' + dataTime.toLocaleDateString();
    else {
      result += 'Il y a ';
      if (hours >= 1) {
        result += `${hours}h`;
      } else if (minutes >= 1) {
        result += `${minutes}m`;
      } else {
        result += `${seconds}s`;
      }
    }
    return result;
  }


  return (
    userSelected.id == -1 && 
    <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
      Select a user to start a conversation
    </div> 
    ||
    <div ref={ref} className="flex flex-col h-full justify-between">
      <div className="w-full text-lg text-blue text-center">
        {userSelected.login}
      </div>

      <div className="overflow-y-auto">
        {/* <BarAdmin /> */}

        {/* display old messages */}
        <div className='text-lg m-1 p-2 '>
          {messages.map((message: MessageInterface, index: number) => (
            <div 
              className='w-full flex my-2' 
              key={message.id}
              ref={index === messages.length - 1 ? bottomRef : null}
            >
              <img
                className="w-10 h-10 rounded-full m-2 object-cover "
                src={'http://localhost:3000/avatars/' + message.ownerUser.avatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
                }}
                alt="avatar"
              />
              <div className=''>
                <div className='font-semibold'>{message.ownerUser.login}
                  <span className='text-xs text-gray-500 font-normal ml-2'> 
                    { getTimeSince(message.createdAt) } 
                  </span>
                </div>
                <div className=''>{message.text}</div>
              </div>
            </div>
          ))}
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
            onChange={e => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { handleSubmit(e); } }}
            placeholder="Enter your text here..."
            className=" w-full p-2 rounded-lg m-1 pb-1 shadow-sm font-sans resize-none"
          ></textarea>
          <button className='flex justify-center items-center'
            onClick={(e) => handleSubmit(e)}
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
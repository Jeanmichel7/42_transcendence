import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getOldMessages, imgExist } from '../../api/chat';
import { BiPaperPlane } from "react-icons/bi";
import io from 'socket.io-client';

import { useSelector, useDispatch } from 'react-redux'




const Conversation = (userSelected: any) => {
  // console.log('userSelected : ', userSelected);

  const userData: any = useSelector((state: any) => state.user.userData);

  const [statusSendMsg, setStatusSendMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [rows, setRows] = useState(1);

  const textareaRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  let ref = useRef(document.createElement('div'));

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside) }
  }, [ref]);


  // get old messages en fct de l'user selectionne
  useEffect(() => {
    if(userSelected.user.id == -1) return;
    joinRoom();
    async function fetchOldMessages() {
      const res = await getOldMessages(userSelected.user.id);
      setMessages(res);
    }
    fetchOldMessages();
  }, [userSelected.user.id]);


  // set approximatif de la hauteur du textarea
  useEffect(() => {
    if (textareaRef.current) {
      if (text.length > 0) {
        setRows(
          Math.floor(text.length / (textareaRef.current.offsetWidth / 7))
          + text.split('\n').length
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
  const HandleSubmit = async (e: any) => {
    e.preventDefault();
    setStatusSendMsg('pending')
    let res = await sendMessage(
      text,
      userSelected.user.id,
    );
    console.log('res big data: ', res)
    if(!res.status)
      setStatusSendMsg('')
    else
      setStatusSendMsg(res.data.message)
    setText('')
  }

  const joinRoom = () => {
    console.log("join room : ", userData)
    const socket = io(`http://localhost:3000/messagerie`, {
      reconnectionDelayMax: 10000,
      withCredentials: true,
    });

    //connect to room
    socket.emit('joinPrivateRoom', { 
      user1Id: userData.id,
      user2Id: userSelected.user.id
    });

    //listen on /message
    socket.on('message', (message, id) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message
      ]);
    });
  };

  function getTimeSince(time: Date) {
    // console.log('time : ', time)
    const now = new Date();
    const dataTime = new Date(time);
    const diff = now.getTime() - dataTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 24) {
      return dataTime.toLocaleDateString();
    } else if (hours >= 1) {
      return `${hours}h`;
    } else if (minutes >= 1) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }


  return (
    userSelected.user.id == -1 && 
    <div className="w-full h-full flex justify-center items-center text-2xl text-gray-500">
      Select a user to start a conversation
    </div> 
    ||
    <div ref={ref} className="flex flex-col h-full justify-between">
      <div className="w-full text-lg text-blue text-center">
        {userSelected.user.login}
      </div>

      <div className="overflow-y-auto">
        {/* <BarAdmin /> */}

        {/* display old messages */}
        <div className='text-lg m-1 p-2 '>
          {messages.map((message: any, index: number) => (
            <div 
              className='w-full flex my-2' 
              key={message.id}
              ref={index === messages.length - 1 ? bottomRef : null}
            >
              <img
                className="w-10 h-10 rounded-full m-2 object-cover "
                src={`http://localhost:3000/avatars/` + message.ownerUser.avatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src="http://localhost:3000/avatars/defaultAvatar.png"
                }}
                alt="avatar"
              />
              <div className=''>
                <div className='font-semibold'>{message.ownerUser.login}
                  <span className='text-xs text-gray-500 font-normal ml-2'> 
                    { `Il y a `+ getTimeSince(message.createdAt) } 
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
            onKeyDown={(e) => { if (e.key === 'Enter') { HandleSubmit(e) } }}
            placeholder="Enter your text here..."
            className=" w-full p-2 rounded-lg m-1 pb-1 shadow-sm font-sans resize-none"
          ></textarea>
          <button className='flex justify-center items-center'
            onClick={HandleSubmit}
          >
            <BiPaperPlane className=' text-2xl mx-2 text-cyan' />
          </button>
          {/* display status send message */}
          {statusSendMsg !== '' &&
            <span className={`
                ${statusSendMsg == 'pending' ? `bg-yellow-500` : `bg-red-500`}
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
  )
}

export default Conversation
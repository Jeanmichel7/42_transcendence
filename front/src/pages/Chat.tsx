import { useState } from 'react'
import ButtonNewChannel from '../components/Chat/ButtonNewChannel'
import ButtonUser from '../components/Chat/ButtonUser'
import ChatRoom from '../components/Chat/ChatRoom'
import Friends from '../components/Chat/Friends'


import React from 'react'
import { useRef, useEffect } from 'react'
import { BiPaperPlane } from "react-icons/bi";
import BarAdmin from '../components/Chat/barAdmin';

import { sendMessage, getOldMessages } from '../api/chat'




const OpenChat = (user: any) => {
  console.log('user : ', user);

  const [statusSendMsg, setStatusSendMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [oldMessage, setOldMessage] = useState<any[]>([]);
  const inputRef: any = useRef();
  let ref = useRef(document.createElement('div'));

  const HandleSubmit = async (e: any) => {
    e.preventDefault();
    setStatusSendMsg('pending')
    let res = await sendMessage(
      inputRef.current.value,
      user.user.id,
    );
    if (res.status !== 201) {
      setStatusSendMsg(res.message)
    }
    inputRef.current.value = "";
    setStatusSendMsg('')
  }

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };

    document.addEventListener('mousedown', ClickOutside);
    return () => { document.removeEventListener('mousedown', ClickOutside) }
  }, [ref]);

  useEffect(() => {
    async function fetchOldMessages() {
      console.log('non ?')
      try {
        const res = await getOldMessages(user.user.id);
        console.log("res get old messages : ", res)
        setOldMessage(res);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    fetchOldMessages();
  }, [user.user.id]);

  return (
    <>
  {user.user.id !== -1 &&
    <div ref={ref} className="flex flex-col h-full justify-between">
      

      <div className='w-full text-lg'>
        {user.user.login}
      </div>

      {/* <BarAdmin /> */}

      {/* display old messages */}
      <div className='text-lg m-1 flex-grow overflow-y-auto'>
        {oldMessage.map((message: any) => (
          <div key={message.id} className='w-full h-7 text-lg m-1'>
            {message.text + ' ' + message.createdAt}
          </div>
        ))}
      </div>

      {/* display new messages */}
      <form onSubmit={HandleSubmit} className="bg-gray-100 border rounded-xl shadow-md flex justify-center">
        <input ref={inputRef} placeholder="Enter your text here..." className=" border-2 border-zinc-500 text-center p-1 rounded-xl m-1 shadow-sm w-2/3 font-sans " type="text" />
        <button className='flex justify-center items-center'>
          <BiPaperPlane className=' text-2xl mx-2 text-zinc-500' />
        </button>
      </form>

      {/* display status send message */}
      {statusSendMsg !== '' &&
        <div className={`
        ${statusSendMsg == 'pending' ? `bg-yellow-500` : `bg-red-500`}
        absolute
        bottom-16 
        text-white
        p-2
        rounded-xl
        shadow-lg`}
          onClick={() => setStatusSendMsg('')}
        >
          {statusSendMsg}
          <button className="absolute right-2 top-1" >X</button>
        </div>
      }
    </div>
  }
</>
  )
}



function Chat() {
  const [currentChatUser, setCurrentChatUser] = useState({ id: -1 });


  return (
    <div className="h-full items-center justify-center border rounded-xl shadow-lg bg-[#F2F2FF] text-indigo-900 items-center p-5 flex">
        <div className="w-1/4">
          <Friends
            currentChatUser={currentChatUser}
            setCurrentChatUser={setCurrentChatUser}
          />
          <ButtonNewChannel />
          <ButtonUser />
          <ChatRoom />
        </div>

        <div className="w-3/4 min-h-lg ">
          <OpenChat user={currentChatUser} />
        </div>

      </div>
  )
}
export default Chat
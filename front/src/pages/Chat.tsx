import { useState, useRef, useEffect } from 'react'

import ButtonNewChannel from '../components/Chat/ButtonNewChannel'
import ButtonUser from '../components/Chat/ButtonUser'
import ChatRoom from '../components/Chat/ChatRoom'
import Friends from '../components/Chat/Friends'

import { BiPaperPlane } from "react-icons/bi";
import BarAdmin from '../components/Chat/barAdmin';

import { sendMessage, getOldMessages } from '../api/chat'


const OpenChat = (user: any) => {
  // console.log('user : ', user);

  const [statusSendMsg, setStatusSendMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [oldMessage, setOldMessage] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [rows, setRows] = useState(1);

  const inputRef: any = useRef();
  const textareaRef = useRef(null);

  let ref = useRef(document.createElement('div'));
  


  const HandleSubmit = async (e: any) => {
    e.preventDefault();
    setStatusSendMsg('pending')
    let res = await sendMessage(
      text,
      user.user.id,
    );
    if (res.status !== 201) {
      setStatusSendMsg(res.message)
    }
    // inputRef.current.value = "";
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

  useEffect(() => {
    console.log('text : ', text);
    console.log('rows : ', rows);

    if(textareaRef.current) {
      if (text.length > 0) {
        setRows(Math.floor(text.length / (textareaRef.current.offsetWidth / 7)) + 1);
      } else {
        setRows(1);
      }
    }
  }, [text]);


  return (
    <>
      {user.user.id !== -1 &&
        <div ref={ref} className="flex flex-col h-full justify-between">

          <div className="w-full text-lg text-blue text-center top-0">
            {user.user.login}
          </div>

          {/* <BarAdmin /> */}

          {/* display old messages */}
          <div className='text-lg m-1 flex-grow p-5'>
            {oldMessage.map((message: any) => (
              <div key={message.id} className='w-full flex my-2'>

                <img 
                  className="w-10 h-10 rounded-full m-2 object-cover "
                  src={`http://localhost:3000/avatars/` + message.ownerUser.avatar}
                  alt="avatar"
                />

                <div className=''>
                  <div className='font-semibold'>{message.ownerUser.login} 
                    <span className='text-xs text-gray-500 font-normal'> {message.createdAt} </span>
                  </div>
                  <div className=''>{message.text }</div>
                </div>

              </div>
            ))}
          </div>

          {/* display new messages */}
          <form 
            onSubmit={HandleSubmit}
            className="bg-gray-100 border rounded-xl shadow-md flex justify-center border-2 border-zinc-400 mx-2 "
          >
            <textarea 
              ref={textareaRef}
              name="text"
              rows={rows}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter your text here..." 
              className=" w-full p-2 rounded-lg m-1 shadow-sm font-sans resize-none" 
            ></textarea>
            <button className='flex justify-center items-center'>
              <BiPaperPlane className=' text-2xl mx-2 text-cyan' />
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
    <div className="
      h-full flex justify-center items-stretch
      border rounded-xl shadow-lg bg-[#F2F2FF] 
      text-indigo-900 p-5"
    >
      <div className="w-1/4 flex flex-col justify-between ">
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
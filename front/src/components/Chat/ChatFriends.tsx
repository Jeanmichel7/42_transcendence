import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { BiPaperPlane } from "react-icons/bi";
import BarAdmin from './barAdmin';
import axios from 'axios';
import io from 'socket.io-client';

/* Fonction qui fait apparaitre de nouvelle page de conversation*/
export function NewRoom ({id, firstName, userId}:{id: any, firstName: any, userId:any}) {

  const [open, setOpen] = useState(false);
  const inputRef:any = useRef();
  let ref = useRef(document.createElement('div'));
  let [conv, setConv] = useState<any>();
  const [messages, setMessages] = useState([]);
  const [messageInput1, setMessageInput1] = useState('');

/*  const HandleSubmit = (e:any) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    inputRef.current.value="";
}*/

/* Fonction click outside */
  useEffect(() => {
    const ClickOutside = (event:any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => {document.removeEventListener('mousedown', ClickOutside)}
  }, [ref]);

  /* Requete pour recuper conversation entre user */
  async function getData () {
    const response = await axios.get(`http://localhost:3000/messages/users/${id}`, {
      withCredentials: true,
    });
    return response.data
  }
 async function fetchData() {
    let Data = await getData();
    setConv(Data);
  }
 useEffect(() => {
    fetchData();
  }, []);

  /* Web socket */
  const joinRoom1 = () => {
    /* creat the socket */
    const socketEvent1 = io(`http://localhost:3000/messagerie`, {
      reconnectionDelayMax: 10000,
    });
    /* connect to room */
    socketEvent1.emit('joinPrivateRoom', { user1Id: {userId}, user2Id: {id} });
    /* */
    socketEvent1.on('message', (message, id) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${message.text} by ${message.ownerUser.login}`,
      ]);
    });
  };

/* Requete pour envoyer la variable dans base donné. */
  const sendMessage1 = () => {
    axios.post(`http://localhost:3000/messages/users/${id}/send`, {
        text: messageInput1,},{ 
        withCredentials: true,}
    );
  };

  return (
    <div>
      <div className={` m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer ${ open ? 'bg-gray-100' : '' } `} onClick={() =>{setOpen(!open); joinRoom1();}}> {firstName} </div>

      <div ref={ref} className= {` absolute left-1/3 top-0 h-full w-7/12 z-20 rounded-xl border-2 shadow-lg font-mono transition-all flex justify-center ${ open ? "" : " hidden  "} `}>
        <div className='absolute flex justify-center top-2 text-lg'>
          {firstName}
        </div>
        <BarAdmin />

        <div className='absolute flex flex-col-reverse bottom-20 h-4/6 text-sm overflow-auto w-full text-left  '>
          {conv && conv.map((item: any) => (
          <ul className=' m-1 mx-8 p-1 rounded-lg'>
            <div className='font-semibold'>{item.ownerUser.firstName}</div>
            <div>{item.text}</div>
          </ul>
          ))} 
        </div>

        <form className=" absolute bg-gray-100 border rounded-xl shadow-md bottom-4 w-11/12 p-1  flex ">
          <input value={messageInput1}
            // set input value into messageinput1
            onChange={(e) => setMessageInput1(e.target.value)} placeholder="Enter your text here ..." className=" border-2 border-zinc-500 text-center p-1 rounded-xl m-1 shadow-sm w-2/3 font-sans " type="text" />
          <button onClick={() => sendMessage1()} className='flex justify-center items-center'> <BiPaperPlane className=' text-2xl mx-2 text-zinc-500' /> </button>
        </form>
      </div>

    </div>
  )
}

/* Fonction qui oprend en charge composant 'ChatRoom' (fonction principale de la page) */
function ChatFriends({ MpData }: { MpData?: any }) {
  /* Check si MpData est pleine*/
  if (!MpData) {
    return <div>Loading...</div>;
  }

  /* Créer map idAndDestNameList qui contient id et firstName de destUser dans 'MpData' */
  const idAndDestNameList = MpData.reduce((acc: any[], item: any) => {
    const existingItem = acc.find((x) => x.id === item.destUser.id);
    if (!existingItem) {
      acc.push({
        id: item.destUser.id,
        destName: item.destUser.firstName,
        userId: item.ownerUser.id
      });
    }
    return acc;
  }, []);

  console.log('ICI', idAndDestNameList); 

  return (
    <div className=" overflow-auto m-2 text-center w-3/12 h-2/6 border-2 rounded-xl shadow-lg font-mono">
      <div className="m-2">Friends</div>
      <div>
      {idAndDestNameList.map((item: any) => (
        <NewRoom key={item.id} id={item.id} firstName={item.destName} userId={item.userId} />
      ))}
      </div>
    </div>
  );
}
export default ChatFriends;

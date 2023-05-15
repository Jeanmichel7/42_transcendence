import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { BiPaperPlane } from "react-icons/bi";
import BarAdmin from './barAdmin';
import axios from 'axios'

/* Fonction qui fait apparaitre de nouvelle page de conversation*/
export function NewRoom ({id, firstName}:{id: any, firstName: any}) {

  const [open, setOpen] = useState(false);
  const inputRef:any = useRef();
  let ref = useRef(document.createElement('div'));
  let [conv, setConv] = useState<any>();

  const HandleSubmit = (e:any) => {
    e.preventDefault();
    console.log(inputRef.current.value);
    inputRef.current.value="";
}
/* Fonction click outside */
  useEffect(() => {
    const ClickOutside = (event:any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', ClickOutside);
    return () => {document.removeEventListener('mousedown', ClickOutside)}
  }, [ref]);

  /* Recuper conversation entre user */
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

    console.log(conv)
  return (
    <div>
      <div className={` m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer ${ open ? 'bg-gray-100' : '' } `} onClick={() => setOpen(!open)}> {firstName} </div>

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

        <form onSubmit={HandleSubmit} className=" absolute bg-gray-100 border rounded-xl shadow-md bottom-4 w-11/12 p-1  flex ">
          <input ref={inputRef} placeholder="Enter your text here ..." className=" border-2 border-zinc-500 text-center p-1 rounded-xl m-1 shadow-sm w-2/3 font-sans " type="text" />
          <button className='flex justify-center items-center'> <BiPaperPlane className=' text-2xl mx-2 text-zinc-500' /> </button>
        </form>
      </div>

    </div>
  )
}

/* Fonction qui oprend en charge composant 'ChatRoom' (fonction principale de la page) */
function ChatRoom({ MpData }: { MpData?: any }) {
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
        destName: item.destUser.firstName
      });
    }
    return acc;
  }, []);

  /* console.log(idAndDestNameList); */ 

  return (
    <div className="bottom-1 m-2 my-5 text-center w-3/12 h-4/6 border-2 rounded-xl shadow-lg font-mono">
      <div className="m-2">Chat Room</div>
      <div>
      {idAndDestNameList.map((item: any) => (
        <NewRoom key={item.id} id={item.id} firstName={item.destName} />
      ))}
      </div>
    </div>
  );
}
export default ChatRoom;

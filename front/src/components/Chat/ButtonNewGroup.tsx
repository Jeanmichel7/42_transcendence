import axios from 'axios';
import { useState, useRef, useEffect } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';

import { getAllUsers } from "../../api/searchFriends";


function ButtonUser({ login }: { login: any }) {

  return (
    <button className=" m-1 p-1 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer " >{login}</button>
  )
}

function ButtonNewGroup() {

  const [userData, setUserData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [Public, setPublic] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');

  let ref = useRef(document.createElement("div"))

  useEffect(() => {
    async function fetchUsers() {
      const res = await getAllUsers();
      setUserData(res);
      console.log('res : ', res);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    }
    document.addEventListener('mousedown', ClickOutside)
    return () => { document.removeEventListener('mousedown', ClickOutside) };
  }, [ref]);

  const addUserList = userData.map((user: any) => (
    <ButtonUser key={user.id} login={user.login} />
  ));

  /* Create new Room without password */
  const addNewRoom = () => {
    axios.post(`http://localhost:3000/chat/rooms/add`, {
      type: "public",
      password: null,
    }, {
      withCredentials: true
    });
  };

  /* Create new Room with password */
  const addNewRoomPassword = () => {
    axios.post(`http://localhost:3000/chat/rooms/add`, {
      type: "public",
      password: password,
    }, {
      withCredentials: true
    });
  };

  return (
    <div >
      <button className={` absulte top-1 m-2 my-1  text-center w-3/12 py-2 border-2 shadow-lg rounded-xl font-mono cursor-pointer
                hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''} `} onClick={() => setOpen(!open)} >
        New Group
      </button>

      <div ref={ref} className={`absolute z-50 left-1/4 top-0 mt-5 m-10 p-2 border shadow-lg text-center w-3/12 rounded-xl bg-white ${open ? "" : "hidden"} transition-all`}  >

        <div className={` py-2 border font-bold font-mono rounded mt-2 shadow-sm hover:bg-gray-200 transition-all cursor-pointer ${Public ? 'bg-gray-300' : ''} `} onClick={() => setPublic(!Public)} >
          Public
        </div>

        <h1 className=" m-2 ">Or</h1>
        <div className="bg-white flex flex-col overflow-auto h-32 border rounded shadow-sm">
          <h1 className=" m-2i font-mono font-bold ">Selects users</h1>
          {addUserList}
        </div>

        <div className=" bg-white border rounded mt-2 shadow-sm ">
          <p className=" font-mono">Password: </p>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded text-center m-1 shadow-sm " type="text" />
        </div>

        <div className=" bg-white border rounded mt-2 shadow-sm ">
          <p className=" font-mono">Name: </p>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border rounded text-center m-1 shadow-sm " type="text" />
        </div>

        <button className=" bg-gray-100 border-2 rounded mt-2 shadow-sm hover:bg-white transition-all cursor-pointer" onClick={() => password === '' ? addNewRoom() : addNewRoomPassword()} >
          <p> Create </p>
        </button>

      </div>
    </div>
  )
}
export default ButtonNewGroup;
import axios from 'axios';
import { useState, useRef, useEffect } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';

import { getAllUsers } from "../../api/searchFriends";


function ButtonUser({ login }: { login: any }) {

  return (
    <button className=" m-1 p-1 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer " >{login}</button>
  )
}

export function ButtonNewGroup2() {

  let [userData, setUserData] = useState<any>([]);
  const [password, setPassword] = useState('');
  const [roomName, setRoomName] = useState('');

  /* requete pour avoir userData */
  async function getData () {
    const response = await axios.get('http://localhost:3000/users/all', {
      withCredentials: true,
    });
    return response.data;
  }
 async function fetchData() {
    let userProfileData = await getData();
    setUserData(userProfileData);
  }
 useEffect(() => {
    fetchData();
  }, []);

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

  return(
      <div className=' h-full m-full' >
        
        <div className={` py-2 border font-bold font-mono rounded mt-2 shadow-sm hover:bg-gray-200 transition-all cursor-pointer`}>
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
  )
}


function ButtonNewGroup({ setServiceToCall }: { setServiceToCall: Function }) {

  return (
    <div className={`max-w-sm text-center border-2 rounded-xl shadow-lg font-mono p-3 cursor-pointer 
        hover:bg-gray-100`}
      onClick={() => setServiceToCall('ButtonNewGroup2')}
    >
      <h2>Add Groups</h2>

    </div>
  )
}
export default ButtonNewGroup;
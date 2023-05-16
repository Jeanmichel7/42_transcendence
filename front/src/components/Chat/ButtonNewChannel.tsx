import axios from 'axios';
import { useState, useRef, useEffect } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside';

function ButtonNewChannel() {
  const [open, setOpen] = useState(false);
  let ref = useRef(document.createElement("div"))

  useEffect(() => {
    const ClickOutside = (event: any) => {
      if (!ref.current.contains(event.target))
        setOpen(false);
    }
    document.addEventListener('mousedown', ClickOutside)
    return () => { document.removeEventListener('mousedown', ClickOutside) };
  }, [ref]);


  const createRoom = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/chat/createRoom/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error while creating room:', error);
    }
  };

  const handleCreateClick = () => {
    // Remplacez 'selectedUserId' par la valeur réelle de l'utilisateur sélectionné
    const selectedUserId = 1;
    createRoom(selectedUserId);
  };

  return (
    <>
      <button className={`max-w-sm text-center p-3 border-2 shadow-lg rounded-xl font-mono cursor-pointer
        hover:bg-gray-100 transition-all ${open ? 'bg-gray-100' : ''}`} onClick={() => setOpen(!open)}>
        New channel
      </button>

      <div className={`absolute z-50 left-0 top-0 mt-12 p-2 border shadow-lg w-3/12 rounded-xl bg-white 
        ${open ? "" : "hidden"} transition-all`}
      >
        <div className="bg-white border rounded shadow-sm">
          <h1 className="m-2 font-bold">Select user:</h1>
          <ul className="m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer">User 1</ul>
          <ul className="m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer">User 2</ul>
          <ul className="m-2 p-2 border border-gray-200 rounded text-left hover:bg-gray-100 transition-all cursor-pointer">User 3</ul>
        </div>

        <div className="bg-white border rounded mt-2 shadow-sm">
          <p className="font-mono m-2">Password: </p>
          <input className="border rounded m-2 w-full shadow-sm" type="text" />
        </div>

        <div className="bg-white border rounded mt-2 shadow-sm">
          <p className="font-mono m-2">Name: </p>
          <input className="border rounded m-2 w-full shadow-sm" type="text" />
        </div>

        <div className="bg-gray-100 border-2 rounded mt-2 shadow-sm hover:bg-white transition-all cursor-pointer p-2" onClick={handleCreateClick}>
          <p className="text-center">Create</p>
        </div>
      </div>
    </>
  )
}
export default ButtonNewChannel;
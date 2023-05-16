import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { BiPaperPlane } from "react-icons/bi";
import BarAdmin from './barAdmin';



function ChatRoom() {
  return (
    <>
      <div className="text-center border-2 rounded-xl shadow-lg font-mono " >
        <div className="m-2" >
          Chat Room
        </div>
        {/* <NewRoom Name="User 1" />
      <NewRoom Name="User 2" /> */}

      </div>
    </>
  )
}

export default ChatRoom;
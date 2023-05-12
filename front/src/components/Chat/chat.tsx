import { useState } from 'react'
import ButtonNewChannel from './ButtonNewChannel'
import ButtonUser from './ButtonUser'
import ChatRoom from './ChatRoom'

function Chat() {

  return (
    <div className=" h-screen w-screen bg-[#1e1e4e] ">
      <div className=" h-5/6 w-11/12 items-center justify-center flex" >
        <div className='relative h-5/6 w-11/12  border rounded-xl shadow-lg bg-white items-center '>

          <ButtonNewChannel />
          <ButtonUser />
          <ChatRoom />

          {/* <PopUpKick visible={} /> */}
        </div>

      </div>
    </div>
  )
}
export default Chat
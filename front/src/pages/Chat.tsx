import { useState } from 'react'
import ButtonNewChannel from '../components/Chat/ButtonNewChannel'
import ButtonUser from '../components/Chat/ButtonUser'
import ChatRoom from '../components/Chat/ChatRoom'

function Chat() {

  return (
      <div className="items-center justify-center flex" >
        <div className='relative h-5/6 w-11/12 border rounded-xl shadow-lg bg-[#F2F2FF] text-indigo-900 items-center '>

          <ButtonNewChannel />
          <ButtonUser />
          <ChatRoom />

          {/* <PopUpKick visible={} /> */}
        </div>
      </div>
  )
}
export default Chat
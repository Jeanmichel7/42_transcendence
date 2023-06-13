import ConversationList from '../components/Chat/ConversationList/ConversationList';
import { Link, Outlet } from 'react-router-dom';
import { ButtonCreateGroup, ButtonInterfaceAddGroups, ButtonInterfaceAddFriends } from '../components/Chat/Channel/ChannelButtons';
import { Divider } from '@mui/material';

function Chat() {
  return (
    <div className='h-full flex justify-center bg-[#F2F2FF]'>
      <div className="flex flex-col h-full bg-[#e5e5f2]">
          <Link to='/chat/createChannel'>
            <ButtonCreateGroup />
          </Link>
        <div className="flex justify-center items-center">
          <Link to='/chat/addChannels' >
            <ButtonInterfaceAddGroups />
          </Link>
          <Link to='/chat/addFriends'>
            <ButtonInterfaceAddFriends />
          </Link>
        </div>
        <ConversationList />
      </div>

      <Divider orientation="vertical" flexItem />

      <div className="flex-grow h-full">
        <Outlet />
      </div>
    </div>
  );
}
export default Chat;
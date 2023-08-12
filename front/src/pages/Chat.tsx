import ConversationList from '../components/Chat/ConversationList/ConversationList';
import { Outlet } from 'react-router-dom';
import {
  ButtonCreateGroup,
  ButtonInterfaceAddGroups,
  ButtonInterfaceAddFriends,
} from '../components/Chat/ConversationList/outlet/ChannelButtons';
import { Divider } from '@mui/material';

function Chat() {
  return (
    <div className="flex h-screen w-full min-h-md relative ">

        <div className="h-full w-full max-w-[200px] min-w-fit bg-[#e5e5f2]">
          <div className="w-full justify-center items-center">
            <p className="p-[5px] bg-gray-300 text-blue-700 text-sm ">CHANNEL </p>
            <ButtonCreateGroup />
            <ButtonInterfaceAddGroups />
          </div>

          <ButtonInterfaceAddFriends />
          <ConversationList />
        </div>

        <Divider orientation="vertical" flexItem />

        <div className="flex-grow h-full w-full">
          <Outlet />
        </div>
    </div>
  );
}
export default Chat;

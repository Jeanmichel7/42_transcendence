import ConversationList from "../components/Chat/ConversationList/ConversationList";
import { Outlet } from "react-router-dom";
import {
  ButtonCreateGroup,
  ButtonInterfaceAddGroups,
  ButtonInterfaceAddFriends,
} from "../components/Chat/ConversationList/ChannelButtons";
import { Divider } from "@mui/material";

function Chat() {
  return (
    <div className="h-full flex justify-center bg-[#F2F2FF]">
      <div className="flex flex-col items-center h-full w-auto min-w-fit bg-[#e5e5f2]">
        <ButtonCreateGroup />
        <div className="flex justify-center items-center">
          <ButtonInterfaceAddGroups />
          <ButtonInterfaceAddFriends />
        </div>
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

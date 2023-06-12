import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reduxRemoveConversationToList } from '../../../store/chatSlicer';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { leaveRoom } from '../../../api/chat';
import { ApiErrorResponse, ConversationInterface, RoomInterface } from '../../../types';

import { CircularProgress, IconButton, Tooltip, Typography, Zoom } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


interface ConvProps {
  conv: ConversationInterface,
  setConvSelectedId: React.Dispatch<React.SetStateAction<number>>,
  setServiceToCall: React.Dispatch<React.SetStateAction<string>>
}

const ConversationListRoomItem: React.FC<ConvProps> = ({
  conv,
  setConvSelectedId,
  setServiceToCall,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const handleCloseConv = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(setMsgSnackbar('Conv Close'));
    dispatch(reduxRemoveConversationToList(conv));
  };

  const handleLeaveRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true);
    const resLeaveRoom: RoomInterface | ApiErrorResponse = await leaveRoom(conv.room.id);
    setIsLoading(false);

    if ('error' in resLeaveRoom)
      dispatch(setErrorSnackbar(resLeaveRoom.error + resLeaveRoom.message ? ': ' + resLeaveRoom.message : ''));
    else {
      dispatch(setMsgSnackbar('Leaved room'));
      dispatch(reduxRemoveConversationToList(conv));
    }

    //redirect to home if currentChatUserId is the user removed
    // if (currentChatUserId === userToRemove.id) {
    //   setCurrentChatUserId(-1);
    //   setServiceToCall('home');
    // }
  };

  const handleClickRaw = () => {
    setServiceToCall('channelConversation');
    setConvSelectedId(conv.id);
  };

  return (
    <div>
      <div className="border hover:bg-gray-100 transition-all 
        cursor-pointer flex flex-row items-center text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-grow text-black m-2 items-center "
          onClick={handleClickRaw}
        >
          <div className='flex flex-row items-center mr-2 bg-[#b2bdc3] rounded-full p-2'>
            <GroupIcon />
          </div>
          <Typography component="span"
            sx={{ 
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap',
            }}
            title={conv.room.name}
          >
            {conv.room.name.length > 15 ? conv.room.name.slice(0, 12) + '...' : conv.room.name}
          </Typography>
        </div>


        <Tooltip
          title="Close group" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton 
            onClick={(e) => handleCloseConv(e)} color='warning'
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Leave room" arrow
          TransitionComponent={Zoom}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton 
            onClick={(e) => handleLeaveRoom(e)} color='error'
            sx={{ visibility: isHovered ? 'visible' : 'hidden' }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>


        { isLoading && <CircularProgress />}


      </div>
    </div>
  );
};

export default ConversationListRoomItem;
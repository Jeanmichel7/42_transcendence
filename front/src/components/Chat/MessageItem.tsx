import { useState, FC, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';

import { apiEditMessage } from '../../api/message';

import { ApiErrorResponse, GameInterface, UserInterface } from '../../types';
import { ChatMsgInterface, MessageInterface } from '../../types/ChatTypes';
import { BiPaperPlane } from 'react-icons/bi';
import { CircularProgress, FormControl, IconButton, TextareaAutosize, Tooltip, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getTimeSince, isChatMsgInterface, isMsgInterface } from '../../utils/utils';
import { editChatMessage } from '../../api/chat';
import { RootState } from '../../store';
import { StyledLink } from './PriveConv/style';
import { inviteGameUser } from '../../api/game';

interface MessageItemProps {
  message: MessageInterface | ChatMsgInterface;
  isLoadingDeleteMsg: boolean;
  handleDeleteMessage: (id: number) => void;
  // isAdminMenuOpen?: boolean;
}

const MessageItem: FC<MessageItemProps> = ({
  message,
  isLoadingDeleteMsg,
  handleDeleteMessage,
  // isAdminMenuOpen,
}) => {
  const userData: UserInterface = useSelector((state: RootState) => state.user.userData);
  const [editMessage, setEditMessage] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>(message.text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageTime, setMessageTime] = useState<string>(getTimeSince(message.createdAt));
  const dispatch = useDispatch();

  const handleEdit = (id: number) => async (
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (e === null) return;

    if ('key' in e) {
      if (e.shiftKey && e.key === 'Enter') {
        setInputMessage((prev) => prev + '\n');
        e.preventDefault();
        return;
      } else if (e.key !== 'Enter') return;
    }
    if (inputMessage.trim() === '') return;
    e.stopPropagation();
    e.preventDefault();

    if (inputMessage === message.text) {
      setEditMessage(false);
      return;
    }

    setIsLoading(true);
    let res: (MessageInterface | ChatMsgInterface) | ApiErrorResponse;
    if (isMsgInterface(message)) {
      res = await apiEditMessage(id, inputMessage);
    } else if (isChatMsgInterface(message)) {
      res = await editChatMessage(id, inputMessage);
    } else {
      throw new Error('message type not supported');
    }
    setIsLoading(false);

    if ('error' in res)
      dispatch(setErrorSnackbar(res));
    else {
      // dispatch(setMsgSnackbar('Message edited'));
      setEditMessage(false);
      setInputMessage(inputMessage);
    }
  };

  const handleDelete = () => {
    handleDeleteMessage(message.id);
  };

  const handleDefi = async () => {
    const resInvitGameUser: GameInterface | ApiErrorResponse =
      await inviteGameUser(message.ownerUser.id);
    if ('error' in resInvitGameUser)
      return dispatch(setErrorSnackbar(resInvitGameUser));
    dispatch(setMsgSnackbar('Invitation sent'));
  };

  const handleOnChange = useCallback(
    (setInputFn: React.Dispatch<React.SetStateAction<string>>) => (
      e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setInputFn(e.target.value);
    }, [],
  );

  const handleCloseEdit = () => {
    setEditMessage(false);
    setInputMessage(message.text);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // update time since message created
  useEffect(() => {
    const fctTime = setInterval(() => {
      setMessageTime(getTimeSince(message.createdAt));
    }, 1000 * 30);
    return () => {
      clearInterval(fctTime);
    };
  }, [message.createdAt, message.text, message.updatedAt]);

  return (
    <>
      <div
        // ref={index === messages.length - 1 ? bottomRef : null}
        className={`w-full flex ${isHovered && 'bg-[#e7e7f7] rounded-lg'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/**
        * Display message
        */}
        {message && !message.ownerUser ? <p>t'as abuse bro</p> :
          <>
            <div className='flex-none w-14 mr-2'>
              <Link to={'/profile/' + message.ownerUser.login}>
                <img
                  className="w-10 h-10 rounded-full m-2 object-cover "
                  src={message.ownerUser.avatar}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'http://localhost:3000/avatars/defaultAvatar.png';
                  }}
                  alt="avatar"
                />
              </Link>
            </div>

            <div className='flex-grow'>
              <div className='font-semibold'>
                <Link to={'/profile/' + message.ownerUser.login}>
                  {message.ownerUser.login}
                </Link>
                <span className='text-xs text-gray-500 font-normal ml-2'>
                  {messageTime}
                </span>
              </div>
              <div
                className={message.ownerUser.id == 0 ? 'text-center font-light' : ''}
                style={{ wordBreak: 'break-word' }}
              >
                {message.text.split('\n').map((line, index) => {
                  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
                  // const urlLink = line.split(' ').find((word) => word.match(urlRegex));
                  const formatedLine = line.split(' ').map((word) => {
                    if (word.match(urlRegex))
                      return <StyledLink href={word} key={word}>{
                        word.includes('game?id=') ? 'Invitation game' : word + ' '
                      }</StyledLink>;
                    return word + ' ';
                  });

                  return (
                    <span key={index}>
                      {formatedLine}
                      {index !== message.text.split('\n').length - 1 && <br />}
                    </span>
                  );
                })}
                {message.updatedAt !== message.createdAt && <span className='text-gray-300 text-sm'> (edit)</span>}
              </div>
            </div>

            {/**
          * Display boutons edit et delete
          **/}
            <div className='flex-none flex w-30 h-full pt-2'>
              {isHovered && message.ownerUser.id === userData.id &&
                <>
                  <Tooltip
                    title="Edit message" arrow
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton onClick={() => setEditMessage(true)} color='primary'>
                      <EditOutlinedIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title="Delete message" arrow
                    TransitionComponent={Zoom}
                    TransitionProps={{ timeout: 600 }}
                  >
                    <IconButton
                      onClick={handleDelete}
                      color='warning'
                      disabled={isLoadingDeleteMsg}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </>
              }
              {isHovered && message.ownerUser.id !== userData.id &&
                <Tooltip
                  title="Defi" arrow
                  TransitionComponent={Zoom}
                  TransitionProps={{ timeout: 600 }}
                >
                  <IconButton
                    onClick={handleDefi}
                    color='success'
                    disabled={isLoadingDeleteMsg}
                  >
                    <SportsEsportsIcon />
                  </IconButton>
                </Tooltip>
              }
            </div>
          </>}
      </div>

      {/**
      * Formulaires edit message
      **/}
      {editMessage &&
        <form className="bg-gray-100 rounded-md shadow-md flex border-2 border-zinc-400 mx-2">
          <FormControl variant="standard" className='w-full'>
            <TextareaAutosize
              id={'edit-message' + message.id}
              aria-describedby={'edit-message' + message.id + '_text'}
              className="w-full p-2 rounded-md m-1 pb-1 shadow-sm font-sans resize-none"
              value={inputMessage}
              onChange={handleOnChange(setInputMessage)}
              onKeyDown={handleEdit(message.id)}
              autoFocus
            />
          </FormControl>

          <IconButton
            onClick={handleEdit(message.id)}
            color='primary'
            disabled={isLoading}
          >
            {isLoading && <CircularProgress />}
            <BiPaperPlane />
          </IconButton>

          <IconButton onClick={handleCloseEdit} color='error'>
            <CloseIcon />
          </IconButton>
        </form>
      }
    </>
  );
};
//  (prevProps, nextProps) => {
//   if (prevProps.message.id !== nextProps.message.id) return true;
//   if (prevProps.message.text !== nextProps.message.text) return false;
//   if (prevProps.message.updatedAt !== nextProps.message.updatedAt) return false;
//   return true;
// });

export default MessageItem;
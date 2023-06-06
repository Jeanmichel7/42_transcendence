import { useState, memo, FC } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../store/snackbarSlice';

import { apiEditMessage } from '../../api/chat';

import { ApiErrorResponse } from '../../types';
import { MessageInterface } from '../../types/ChatTypes';


import { BiPaperPlane } from 'react-icons/bi';
import { FormControl, IconButton, Input, Tooltip, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


interface MessageItemProps {
  message: MessageInterface;
  userDataId: number;
  handleDeleteMessage: (id: number) => void;
}

const MessageItem: FC<MessageItemProps> = memo(({
  message,
  userDataId,
  handleDeleteMessage,
}) => {
  const [editMessage, setEditMessage] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const dispatch = useDispatch();

  function getTimeSince(time: Date): string {
    const now: Date = new Date();
    const dataTime: Date = new Date(time);
    const diff: number = now.getTime() - dataTime.getTime();
    const seconds: number = Math.floor(diff / 1000);
    const minutes: number = Math.floor(seconds / 60);
    const hours: number = Math.floor(minutes / 60);
    let result = '';

    if (hours > 24)
      result += 'Le ' + dataTime.toLocaleDateString();
    else if (hours == 0 && minutes == 0 && seconds <= 30)
      result += 'Now';
    else {
      result += 'Il y a ';
      if (hours >= 1) {
        result += `${hours}h`;
      } else if (minutes >= 1) {
        result += `${minutes}m`;
      } else {
        result += `${seconds}s`;
      }
    }
    return result;
  }


  const handleEdit = (id: number) => async (e: React.SyntheticEvent) => {
    if (typeof e === 'object' && 'key' in e && e.key !== 'Enter') return;
    e.stopPropagation();

    const res: MessageInterface | ApiErrorResponse = await apiEditMessage(id, inputMessage);
    if ('error' in res)
      dispatch(setErrorSnackbar('Error edit message: ' + res.error));
    else {
      message.text = inputMessage;
      message.updatedAt = new Date();
      dispatch(setMsgSnackbar('Message edited'));
      setEditMessage(false);
      setInputMessage('');
    }
  };

  const handleDelete = () => {
    handleDeleteMessage(message.id);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleCloseEdit = () => {
    setEditMessage(false);
    setInputMessage('');
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div key={message.id}>
      <div
        // ref={index === messages.length - 1 ? bottomRef : null}
        className={`w-full flex my-2 ${isHovered ? 'bg-blue-100' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/**
        * Display message
        */}
        <div className='flex-none w-14 '>
          <Link to={'/profile/' + message.ownerUser.login}>
            <img
              className="w-10 h-10 rounded-full m-2 object-cover "
              src={'http://localhost:3000/avatars/' + message.ownerUser.avatar}
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
              {getTimeSince(message.createdAt)}
            </span>
          </div>
          <div className=''>
            {message.text}
            {message.updatedAt !== message.createdAt && <span className='text-gray-300 text-sm'> (edit)</span>}
          </div>
        </div>

        {/**
        * Display boutons edit et delete
        **/}
        <div className='flex-none flex w-20 h-full pt-1'>
          <Tooltip
            title="Edit message" arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
            sx={{ visibility: isHovered && message.ownerUser.id === userDataId ? 'visible' : 'hidden' }}
          >
            <IconButton onClick={() => setEditMessage(true)} color='primary'>
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Delete message" arrow
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 600 }}
            sx={{ visibility: isHovered && message.ownerUser.id === userDataId ? 'visible' : 'hidden' }}
          >
            <IconButton onClick={handleDelete} color='warning'>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/**
    * Formulaires edit message
    **/}
      {editMessage &&
        <div className='flex'>
          <FormControl variant="standard" className='w-full'>
            <Input
              id={'edit-message' + message.id}
              aria-describedby={'edit-message' + message.id + '_text'}
              className="w-full"
              defaultValue={message.text}
              onChange={handleOnChange}
              onKeyDown={handleEdit(message.id)}
              autoFocus
            />
          </FormControl>
          <IconButton onClick={handleEdit(message.id)} color='primary'>
            <BiPaperPlane />
          </IconButton>
          <IconButton onClick={handleCloseEdit} color='error'>
            <CloseIcon />
          </IconButton>
        </div>
      }
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.message.id !== nextProps.message.id) return false;
  return true;
});

export default MessageItem;
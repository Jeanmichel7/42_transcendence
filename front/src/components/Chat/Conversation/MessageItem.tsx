import { useState, memo, FC, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setErrorSnackbar, setMsgSnackbar } from '../../../store/snackbarSlice';

import { apiEditMessage } from '../../../api/message';

import { ApiErrorResponse } from '../../../types';
import { MessageInterface } from '../../../types/ChatTypes';


import { BiPaperPlane } from 'react-icons/bi';
import { FormControl, IconButton, TextareaAutosize, Tooltip, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getTimeSince } from '../../../utils/utils';


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
  const [inputMessage, setInputMessage] = useState<string>(message.text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [messageTime, setMessageTime] = useState<string>(getTimeSince(message.createdAt));
  const dispatch = useDispatch();


  const handleEdit = (id: number) => async (e:  React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    const res: MessageInterface | ApiErrorResponse = await apiEditMessage(id, inputMessage);
    if ('error' in res)
      dispatch(setErrorSnackbar(res.error + res.message ? ': ' + res.message : ''));
    else {
      dispatch(setMsgSnackbar('Message edited'));
      setEditMessage(false);
      setInputMessage(inputMessage);
    }
  };

  const handleDelete = () => {
    handleDeleteMessage(message.id);
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
    }, 1000 * 1); //10sec
    return () => {
      clearInterval(fctTime);
    };
  }, [message.createdAt, message.text, message.updatedAt]);

  return (
    <div key={message.id}>
      <div
        // ref={index === messages.length - 1 ? bottomRef : null}
        className={`w-full flex ${isHovered && 'bg-[#e7e7f7] rounded-lg'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/**
        * Display message
        */}
        <div className='flex-none w-14 mr-2'>
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
              {messageTime}
            </span>
          </div>
          <div className='' style={{ wordBreak: 'break-word' }} >
            { message.text.split('\n').map((line, index) => {
              return (
                <span key={index}>
                  {line} 
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
        <div className='flex-none flex w-20 h-full pt-2'>
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

          <IconButton onClick={handleEdit(message.id)} color='primary'>
            <BiPaperPlane />
          </IconButton>

          <IconButton onClick={handleCloseEdit} color='error'>
            <CloseIcon />
          </IconButton>
        </form>
      }
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.text !== nextProps.message.text) return false;
  if (prevProps.message.updatedAt !== nextProps.message.updatedAt) return false;
  return true;
});

export default MessageItem;
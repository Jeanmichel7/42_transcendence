import { useState, useCallback, useRef } from 'react';
import { IconButton, TextareaAutosize } from '@mui/material';
import { styled } from '@mui/system';
import { BiPaperPlane } from 'react-icons/bi';
import { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => {
  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
  };

  return {
    width: '100%',
    fontWeight: 400,
    lineHeight: 1.5,
    padding: 12,
    backgroundColor: 'inherit',

    borderRadius: 8,
    resize: 'none',

    '&:hover': {},
    '&:focus': {
      borderRight: `2px solid ${grey[400]}`,
      boxShadow: `0px 0px 4px 2px ${grey[200]}`,
      outline: 'none',
    },
  };
});

interface FormChannelProps {
  socket: Socket;
  gameId: string;
  type: string;
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormPriveGameConv = ({
  socket,
  gameId,
  type,
  setShouldScrollToBottom,
}: FormChannelProps) => {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { userData } = useSelector((state: RootState) => state.user);

  const handleSubmit = useCallback(
    (
      e:
        | React.KeyboardEvent<HTMLTextAreaElement>
        | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (e === null) return;
      if ('key' in e) {
        if (e.shiftKey && e.key === 'Enter') {
          setText(prev => prev + '\n');
          e.preventDefault();
          return;
        } else if (e.key !== 'Enter') return;
      }
      e.preventDefault();
      if (text.trim() === '') {
        setText('');
        return;
      }
      setTimeout(() => {
        socket.emit('sendMessage', {
          gameId: gameId,
          type: type,
          message: text,
          avatar: userData.avatar,
        });
      }, 100);
      setShouldScrollToBottom(true);
      setText('');
    },
    [text],
  );

  const handleChangeTextArea = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    [],
  );

  return (
    <>
      <form
        className="rounded-md shadow-md flex border-2 border-gray-400 mt-2 text-gray-100"
        id="formChatConv"
      >
        <StyledTextarea
          id="textareaFormGameConv"
          ref={textareaRef}
          name="text"
          value={text}
          onChange={handleChangeTextArea}
          onKeyDown={handleSubmit}
          placeholder="Type here..."
        />
        <IconButton
          className="flex justify-center items-center"
          onClick={handleSubmit}
        >
          <BiPaperPlane className="text-gray-400" />
        </IconButton>
      </form>
    </>
  );
};

export default FormPriveGameConv;

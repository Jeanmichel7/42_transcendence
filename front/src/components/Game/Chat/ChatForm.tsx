import { useState, useCallback, useRef } from 'react';
import { IconButton, TextareaAutosize } from '@mui/material';
import { BiPaperPlane } from 'react-icons/bi';
import { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface FormChannelProps {
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
  gameId: string;
  type: string;
}

const FormPriveGameConv = ({
  setShouldScrollToBottom,
  socket,
  gameId,
  type,
}: FormChannelProps) => {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { userData } = useSelector((state: RootState) => state.user);

  // send message
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
      // console.log('send text: ', text);
      socket.emit('sendMessage', {
        gameId: gameId,
        type: type,
        message: text,
        avatar: userData.avatar,
      });

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
      <form className="flex border-t-2 border-zinc-400 mt-2">
        <TextareaAutosize
          ref={textareaRef}
          name="text"
          value={text}
          onChange={handleChangeTextArea}
          onKeyDown={handleSubmit}
          placeholder="Type here..."
          className="w-full p-2 rounded-sm m-1 shadow-lg font-sans resize-none"
        />
        <IconButton
          className="flex justify-center items-center"
          onClick={handleSubmit}
          color="info"
        >
          <BiPaperPlane />
        </IconButton>
      </form>
    </>
  );
};

export default FormPriveGameConv;
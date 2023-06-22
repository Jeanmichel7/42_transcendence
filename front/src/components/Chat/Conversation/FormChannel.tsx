import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../../../api/chat';
import { ChatMsgInterface, ApiErrorResponse } from '../../../types';
import { TextareaAutosize } from '@mui/material';
import { BiPaperPlane } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

interface FormChannelProps {
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormChannel = ({
  setShouldScrollToBottom,
}: FormChannelProps ) => {
  const id = (useParams<{ id: string }>().id || '-1');
  const [text, setText] = useState<string>('');
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // send message
  const handleSubmit = useCallback(
    () => async (e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (e === null) return;
      if ('key' in e) {
        if (e.shiftKey && e.key === 'Enter') {
          setText((prev) => prev + '\n');
          e.preventDefault();
          return;
        } else if (e.key !== 'Enter')
          return;
      }
      e.preventDefault();
      if (text.trim() === '') {
        setText('');
        return;
      }
      setStatusSendMsg('pending');
      const newMessage: ChatMsgInterface | ApiErrorResponse = await sendChatMessage(id, {
        text: text,
      });
      if ('error' in newMessage)
        setStatusSendMsg(newMessage.message);
      else
        setStatusSendMsg('');
      setText('');
      setShouldScrollToBottom(true);
    }, [id, setShouldScrollToBottom, text],
  );


  /* set text input currying + callback */
  const handleChangeTextArea = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      console.log(e);
      setText(e.target.value);
    }, [],
  );


  return (
    <>
      {/* display form message */}
      <form className="rounded-md shadow-md flex border-2 border-zinc-400 mt-2">
        <TextareaAutosize
          ref={textareaRef}
          name="text"
          value={text}
          onChange={handleChangeTextArea}
          onKeyDown={handleSubmit()}
          placeholder="Enter your text here..."
          className="w-full p-2 rounded-sm m-1 pb-1 shadow-sm font-sans resize-none"
        />
        <button className='flex justify-center items-center'
          onClick={handleSubmit()}
        >
          <BiPaperPlane className=' text-2xl mx-2 text-cyan' />
        </button>

        {/* display status send message */}
        {statusSendMsg !== '' &&
          <span className={`${statusSendMsg == 'pending' ? 'bg-yellow-500' : 'bg-red-500'}
                        bottom-16  text-white p-2 rounded-xl shadow-lg`}
            onClick={() => setStatusSendMsg('')}
          >
            {statusSendMsg}
          </span>
        }
      </form>
    </>
  );
};


export default FormChannel;
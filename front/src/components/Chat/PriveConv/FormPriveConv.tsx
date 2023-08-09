import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiErrorResponse, MessageInterface } from '../../../types';
import { Button, FormHelperText, TextareaAutosize } from '@mui/material';
import { BiPaperPlane } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import { sendMessage } from '../../../api/message';

interface FormChannelProps {
  setShouldScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormPriveConv = ({
  setShouldScrollToBottom,
}: FormChannelProps ) => {
  const id = (useParams<{ id: string }>().id || '-1');
  const [isBlocked, setIsBlocked] = useState(false);
  const [text, setText] = useState<string>('');
  const [statusSendMsg, setStatusSendMsg] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);

  useEffect(() => {
    const sendMessages = async () => {
      if (isSending) return;
      if (messageQueue.length === 0) return setStatusSendMsg('');
      setIsSending(true);
      const message = messageQueue[0];
      setMessageQueue((prev) => prev.slice(1));
      const newMessage: MessageInterface | ApiErrorResponse 
        = await sendMessage( message, id);
      setIsSending(false);
      if ('error' in newMessage) {
        if (newMessage.error === 'Forbidden')
          setIsBlocked(true);
        setStatusSendMsg(newMessage.message); //display error
      } else {
        setShouldScrollToBottom(true);
      }
    };
    sendMessages();
  }, [messageQueue, id, isSending, setShouldScrollToBottom]);

  // send message
  const handleSubmit = useCallback((
    e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
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
    setMessageQueue((prev) => prev ? [...prev, text] : [text]);
    setStatusSendMsg('sending');
    setText('');
  }, [text]);


  const handleChangeTextArea = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
          disabled={isBlocked}
          onChange={handleChangeTextArea}
          onKeyDown={handleSubmit}
          placeholder="Enter your text here..."
          className="w-full p-2 rounded-sm m-1 pb-1 shadow-sm font-sans resize-none"
        />
        <Button className='flex justify-center items-center'
          onClick={handleSubmit}
          disabled={isBlocked}
        >
          <BiPaperPlane className=' text-2xl mx-2 text-cyan' />
        </Button>

        {/* display status send message */}
        {statusSendMsg !== '' &&
          <p className={`${statusSendMsg == 'sending' ? 'bg-yellow-500' : 'bg-red-500'}
          text-white p-1 rounded-md shadow-md flex whitespace-nowrap justify-center items-center px-2`}
            onClick={() => setStatusSendMsg('')}
          >
            { statusSendMsg } 
            { messageQueue.length > 0 && ' (' + messageQueue.length + ')' }
          </p>
        }
      </form>
      <FormHelperText error >{isBlocked && 'You are blocked'}</FormHelperText>
    </>
  );
};


export default FormPriveConv;
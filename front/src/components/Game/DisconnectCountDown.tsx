import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  flex-direction: column;
  color: white;
  font-size: 24px;
  color: green;
`;

const Timer = styled.span`
  margin-top: 10px;
  font-weight: bold;
  color: green;
`;

export const DisconnectCountDown = () => {
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [centisecondsLeft, setCentisecondsLeft] = useState(99);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCentisecondsLeft(prev => {
        if (prev > 0) return prev - 1;
        if (secondsLeft > 0) {
          setSecondsLeft(prevSec => prevSec - 1);
          return 99;
        }
        clearInterval(intervalId);
        return 0;
      });
    }, 10);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  return (
    <Overlay>
      Opponent Disconnect <br />
      Time left before win:
      <Timer>
        {secondsLeft}:{centisecondsLeft < 10 ? '0' : ''}{centisecondsLeft}
      </Timer>
    </Overlay>
  );
};


import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${props => props.position}: 0;
  bottom: 0;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  flex-direction: column;
  color: red;
  font-size: 24px;
`;

const Timer = styled.span`
  margin-top: 10px;
  font-weight: bold;
`;

interface Props {
  player1Connected: boolean;
  player2Connected: boolean;
  player1Username: string;
  player2Username: string;
}

export const DisconnectCountDownSpectator: React.FC<Props> = ({
  player1Connected,
  player2Connected,
  player1Username,
  player2Username,
}) => {
  const [secondsLeftPlayer1, setSecondsLeftPlayer1] = useState(30);
  const [secondsLeftPlayer2, setSecondsLeftPlayer2] = useState(30);

  useEffect(() => {
    if (!player1Connected) {
      const intervalId1 = setInterval(() => {
        setSecondsLeftPlayer1(prev => {
          if (prev > 0) return prev - 1;
          clearInterval(intervalId1);
          return 0;
        });
      }, 1000);
      return () => clearInterval(intervalId1);
    }
  }, [player1Connected]);

  useEffect(() => {
    if (!player2Connected) {
      const intervalId2 = setInterval(() => {
        setSecondsLeftPlayer2(prev => {
          if (prev > 0) return prev - 1;
          clearInterval(intervalId2);
          return 0;
        });
      }, 1000);
      return () => clearInterval(intervalId2);
    }
  }, [player2Connected]);

  return (
    <>
      {!player1Connected && (
        <Overlay position="left">
          {player1Username} Disconnected
          <Timer>{secondsLeftPlayer1}</Timer>
        </Overlay>
      )}
      {!player2Connected && (
        <Overlay position="right">
          {player2Username} Disconnected
          <Timer>{secondsLeftPlayer2}</Timer>
        </Overlay>
      )}
    </>
  );
};

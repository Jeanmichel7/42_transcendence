import { AiFillPropertySafety } from 'react-icons/ai';
import styled from 'styled-components';

const ScoreWrapper = styled.div`
  color: white;
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ScoreValue = styled.h1`
  font-size: 2rem;
  border: 1px solid white;
  border-radius: 10%;
  padding: 0.5rem;
`;

function Score({ scorePlayerLeft, scorePlayerRight }) {
  return (
    <ScoreWrapper>
      <ScoreValue>{scorePlayerLeft}</ScoreValue>
      <ScoreValue>{scorePlayerRight}</ScoreValue>
    </ScoreWrapper>
  );
}

export default Score;

import { AiFillPropertySafety } from 'react-icons/ai';
import styled from 'styled-components';

const ScoreWrapper = styled.div`
  color: white;
  position: absolute;
  display: flex;
  left: 50%;
`;

const ScoreValue = styled.h1`
  font-size: 2rem;
`;

function Score({ scorePlayerLeft, scorePlayerRight }) {
  return (
    <ScoreWrapper>
      <ScoreValue>{scorePlayerLeft}</ScoreValue>
      <ScoreValue>5</ScoreValue>
    </ScoreWrapper>
  );
}

export default Score;

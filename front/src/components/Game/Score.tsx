import { AiFillPropertySafety } from "react-icons/ai";
import styled from "styled-components";
import { pulsate } from "./NeonStyle";

const ScoreWrapper = styled.div`
  color: white;
  position: absolute;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 1rem;
`;

const ScoreValue = styled.h1`
  font-size: 2rem;
  padding: 0.5rem;
  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe,
    0 0 82px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe;
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

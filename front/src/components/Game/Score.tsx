import styled from 'styled-components';

export const ScoreValue = styled.h1`
  font-size: 2rem;
  padding: 0.5rem;
  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  height: 2.5em;
  text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #bc13fe,
    0 0 82px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  width: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Score({
  scorePlayerLeft,
  scorePlayerRight,
}: {
  scorePlayerLeft: number;
  scorePlayerRight: number;
}) {
  return (
    <>
      <ScoreValue>{scorePlayerLeft}</ScoreValue>
      <ScoreValue>{scorePlayerRight}</ScoreValue>
    </>
  );
}

export default Score;

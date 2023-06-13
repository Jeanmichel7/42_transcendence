import styled from 'styled-components';

const LooseWrapper = styled.div`
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  border: 10px dashed white;
  border-radius: 25%;
  position: absolute;
  background-color: black;
  color: black;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const StyledRetryButton = styled.button`
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
  &:hover {
    background-color: grey;
  }
`;
interface setCurrentPage {
  setLoose: React.Dispatch<React.SetStateAction<string>>;
}



function Loose({
  setCurrentPage,
  lastGameInfo,
}: {
  setCurrentPage: setCurrentPage;
  lastGameInfo: any;
}) {
  return (
    <LooseWrapper>
      {lastGameInfo.current.win ? (
        <StyledTitle>Gagne</StyledTitle>
      ) : (
        <StyledTitle>Perdu</StyledTitle>
      )}
      <StyledTitle>Vainqueur: {lastGameInfo.current.winnerName}</StyledTitle>
      <StyledTitle>Perdant: {lastGameInfo.current.looserName}</StyledTitle>
      <StyledRetryButton onClick={() => setCurrentPage('searchOpponent')}>Proposer une nouvelle partie</StyledRetryButton>
    </LooseWrapper>
  );
}

export default Loose;

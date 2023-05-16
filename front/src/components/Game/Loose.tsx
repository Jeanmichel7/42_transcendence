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

function Loose() {
  return (
    <LooseWrapper>
      <StyledTitle>Perdu</StyledTitle>
      <StyledRetryButton>Rejouer</StyledRetryButton>
    </LooseWrapper>
  );
}

export default Loose;

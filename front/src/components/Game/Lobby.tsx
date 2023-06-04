import styled from 'styled-components';

export const StyledButton = styled.button`
  background-color: white;
  color: black;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    background-color: grey;
  }
`;

const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

function Lobby({
  setCurrentPage,
}: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <ButtonWrapper>
      <StyledButton
        onClick={() => {
          setCurrentPage('searchOpponent');
        }}
      >
        Search Oponent
      </StyledButton>
    </ButtonWrapper>
  );
}

export default Lobby;

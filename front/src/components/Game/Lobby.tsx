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
  transform: translate(-50%, -50%);
`;

const ButtonWrapper = styled.div`
  left: 50%;
  top: 50%;
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

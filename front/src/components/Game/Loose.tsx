import styled from 'styled-components';

const LooseWrapper = styled.div`
  width: 200px;
  height: 100px;
  top: 250px;
  left: 300px;
  border: 10px dashed white;
  border-radius: 25%;
  position: absolute;
  background-color: black;
  color: black;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
`;

const StyledTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

function Loose() {
  return (
    <LooseWrapper>
      <StyledTitle>Perdu</StyledTitle>
    </LooseWrapper>
  );
}

export default Loose;

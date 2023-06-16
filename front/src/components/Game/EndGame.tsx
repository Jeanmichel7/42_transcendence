import styled, {keyframes} from 'styled-components';
import { StyledButton } from './Lobby';

const LooseWrapper = styled.div`
  position: absolute;
  background-color: black;
  color: black;
  align-items: center;
  height: 100%;
  width: 100%;
  justify-content: space-around;
  text-align: center;
  display: flex;
  flex-direction: column;
`;


const flicker  = keyframes`{
  0%, 18%, 22%, 25%, 53%, 57%, 100% {
    text-shadow:
      0 0 4px #fff,
      0 0 11px #fff,
      0 0 19px #fff,
      0 0 40px #0fa,
      0 0 80px #0fa,
      0 0 90px #0fa,
      0 0 100px #0fa,
      0 0 150px #0fa;
  }
  20%, 24%, 55% {       
    text-shadow: none;
  }
}`;
const StyledNeonH1 = styled.h1`
  color: #fff;
  animation: ${flicker} 2s infinite alternate;
  font-size: 2rem;
  
  text-shadow:
      -1 0 7px #fff,
      -1 0 10px #fff,
      -1 0 21px #fff,
      -1 0 42px #0fa,
      -1 0 82px #0fa,
      -1 0 92px #0fa,
      -1 0 102px #0fa,
      -1 0 151px #0fa;`

const neonAnimationStartUp = keyframes`
0% { 
    text-shadow: none; 
    color: #000;
  }
100% { 
  color: #fff;
  text-shadow:
    0 0 10px #FF00FF,
    0 0 20px #FF00FF,
    0 0 30px #FF00FF,
    0 0 40px #FF00FF;
    border: 0.2rem solid #fff;
    border-radius: 2rem;
    padding: 0.4em;
    box-shadow: 0 0 .2rem #fff,
              0 0 .2rem #fff,
              0 0 2rem #bc13fe,
              0 0 0.8rem #bc13fe,
              0 0 2.8rem #bc13fe,
              inset 0 0 1.3rem #bc13fe; 
}
`; 

const NeonSign = styled.div`
  font-size: 1em;
  position: absolute;
  left: 75%;
  top: 15%;
  rotate: 30deg;
  text-align: center;
  animation: ${neonAnimationStartUp} steps(1) 1s forwards;
  animation-delay: 1s; // The sign will start glowing after 1 second
`;
  const StyledNeonH2 = styled.h2`
  color: #fff;
  animation: ${flicker} 0.5s infinite alternate;
  font-size: 1rem;
  text-shadow:
  -1px 0px 7px #fff,
  -1px 0px 10px #fff,
  -1px 0px 21px #fff,
  -1px 0px 42px #800080, /* Ici, je remplace #0fa par #800080 */
  -1px 0px 82px #800080,
  -1px 0px 92px #800080,
  -1px 0px 102px #800080,
  -1px 0px 151px #800080; `


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
        <>
        <StyledNeonH1>Gagne</StyledNeonH1>
        <NeonSign>Bien Joue</NeonSign>
        </>
      ) : (
        <>
        <StyledNeonH1>Perdu</StyledNeonH1>
        <NeonSign>Dommage</NeonSign>
        </>
      )}
      <StyledNeonH1>Vainqueur: {lastGameInfo.current.winnerName}</StyledNeonH1>
      <StyledNeonH2>Perdant: {lastGameInfo.current.looserName}</StyledNeonH2>
      <StyledButton onClick={() => setCurrentPage('searchOpponent')}>Proposer une nouvelle partie</StyledButton>
    </LooseWrapper>
  );
}

export default Loose;

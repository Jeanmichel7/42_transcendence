import styled, {keyframes} from 'styled-components';
import { StyledButton } from './Lobby';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import './font.css' ;

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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;


const flicker  = keyframes`{
  40% {
    opacity: 1;
  }
  42% {
    opacity: 0.8;
  }
  43% {
    opacity: 1;
  }
  45% {
    opacity: 0.2;
  }
  46% {
    opacity: 1;
  }
}`;

const buzz = keyframes`
{
  70% {
    opacity: 0.80;
  }
}`
const StyledNeonH1 = styled.h1`
  color: #fff;
  -webkit-animation: ${buzz} 0.1s infinite alternate;
  font-size: 4rem;
  text-shadow: 0 0 0 transparent, 0 0 10px #2695ff, 0 0 20px rgba(38, 149, 255, 0.5), 0 0 40px #2695ff, 0 0 100px #2695ff, 0 0 200px #2695ff, 0 0 300px #2695ff, 0 0 500px #2695ff;
  `

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
  animation: ${flicker} 4s infinite alternate;
  font-size: 2rem;
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

const FullScreenCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; 
`;




function Loose({
  setCurrentPage,
  lastGameInfo,
}: {
  setCurrentPage: setCurrentPage;
  lastGameInfo: any;
}) {

  useEffect(() => {
    if(lastGameInfo.current.win){
      setTimeout(() => {
      const myConfetti = confetti.create(document.getElementById('myCanvas'), { useWorker: true, resize: true });
      myConfetti({
        particleCount: 100,
        spread: 160
      });
    }, 2000);
  }
  }, [lastGameInfo.current.win]);
  return (
    <LooseWrapper>
      {lastGameInfo.current.win ? (
        <>
        <StyledNeonH1>Victoire<br/>Vainqueur: {lastGameInfo.current.winnerName} </StyledNeonH1>
        <NeonSign>Bien Joue</NeonSign>
        <FullScreenCanvas id='myCanvas'></FullScreenCanvas>
        </>
      ) : (
        <>
        <StyledNeonH1>Defaite</StyledNeonH1>
        <NeonSign>Dommage</NeonSign>
        </>
      )}
      <StyledNeonH2>Perdant: {lastGameInfo.current.looserName}</StyledNeonH2>
      <StyledButton onClick={() => setCurrentPage('searchOpponent')}>Proposer une nouvelle partie</StyledButton>
    </LooseWrapper>
  );
}

export default Loose;

import styled, { keyframes, css } from 'styled-components';
import neonBrickWall from '../../assets/neonBrickWall.jpeg';
import { ReactNode } from 'react';

const arrival = keyframes`
  0% {
    top: -100%;
    left: -100%;
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
    opacity: 1;
  }
  60% {
    top: 120%;
    left: 120%;
    transform: translate(-50%, -50%) scale(0.5) rotate(1440deg);
    opacity: 1;
  }
  61% {
    opacity: 0;
  }
  69% {
    opacity: 1;
  } 
  70%{
    left: 80%; 
    top: -100%;
    transform: translate(-50%, -50%) scale(5) rotate(0deg);
  }
  100% {
    left: 50%;
    opacity: 1;
    transform: translate(-50%, -50%) scale(5) rotate(360deg);
    top: 50%; 
  }
`;

const sadEyes = keyframes`
  99% {
    background-color: black;
  }
  100% {
    background-color: transparent; 
  }
`;

const eat = keyframes`
  0% {
    background-color : transparent; 
    height: 20px; 
  }
  75% {
    background-color: transparent; 
    height: 20px;
  }
  76% {
    background-color: black;
    height: 20px;
    transform: scale(1);
  }
  100% {
    background-color: black;
    transform: scaleY(1.75) translateY(-14px) scale(2.25);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
`;

interface PacmanProps {
  mood: 'happy' | 'sad';
}
const Pacman = styled.div<PacmanProps>`
  width: 120px;
  height: 120px;
  position: absolute;
  background-color: ${({ mood }) =>
    mood === 'sad' ? 'var(--color-primary)' : 'var(--color-secondary)'};
  border-radius: 50%;
  left: 50%;
  top: -100%;
  animation: ${arrival} 5s forwards;
  transform: translate(-50%, -50%);
`;

interface EyeBrowProps {
  isLeft?: boolean;
}
const Eyebrow = styled.div<EyeBrowProps>`
  background-color: transparent;
  border-bottom: 3px solid black;
  position: absolute;
  left: ${({ isLeft }) => (isLeft ? '25px' : '75px')};
  top: 20px;
  width: 20px;
  transform: ${({ isLeft }) => (isLeft ? 'rotate(-30deg)' : 'rotate(30deg)')};
  height: 10px;
  border-radius: 40%;
`;

interface EyeProps {
  mood: 'happy' | 'sad';
  isLeft?: boolean;
}

const Eye = styled.div<EyeProps>`
  background-color: ${({ mood }) => (mood === 'sad' ? 'black' : 'transparent')};
  width: 20px;
  height: 16px;
  left: ${({ isLeft }) => (isLeft ? '30px' : '70px')};
  position: absolute;
  top: 35px;
  border-radius: 50%;
  border-bottom: solid black 4px;
  animation: ${({ mood }) =>
    mood === 'sad'
      ? css`
          ${sadEyes} 4.5s forwards
        `
      : 'none'};
  transform: ${({ mood }) =>
    mood === 'happy' ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

interface MouthProps {
  mood: 'happy' | 'sad';
}

const Mouth = styled.div<MouthProps>`
  position: absolute;
  width: 50px;
  top: 70px;
  left: 35px;
  height: 20px;
  background-image: url(${neonBrickWall});
  background-size: cover; // Pour s'assurer que l'image couvre toute la zone, sans répétition
  background-repeat: no-repeat; // Pour s'assurer que l'image ne se répète pas
  background-position: ${({ mood }) => (mood === 'sad' ? 'bottom' : 'top')};
  border-top: ${({ mood }) =>
    mood === 'sad' ? 'solid transparent 8px' : 'none'};
  border-bottom: ${({ mood }) =>
    mood === 'happy' ? 'solid transparent 8px' : 'none'};
  border-radius: 50%;
  box-sizing: content-box;
  animation: ${() =>
    css`
      ${eat} 6s forwards
    `};
`;

interface SmileyProps {
  children: ReactNode;
  mood: 'happy' | 'sad';
}
export const Smiley = ({ children, mood }: SmileyProps) => {
  return (
    <Wrapper>
      <Pacman mood={mood}>
        {mood === 'sad' && <Eyebrow isLeft />}
        <Eye mood={mood} isLeft />
        {mood === 'sad' && <Eyebrow />}
        <Eye mood={mood} />
        <Mouth mood={mood} />
      </Pacman>
      {children}
    </Wrapper>
  );
};

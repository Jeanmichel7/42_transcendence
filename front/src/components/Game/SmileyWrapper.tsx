import styled, { keyframes, css } from "styled-components";

const arrival = keyframes`
  0% {
    top: -100%;
    opacity: 0;
    left: 80%;
    transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
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

const Pacman = styled.div`
  width: 120px;
  height: 120px;
  position: absolute;
  background-color: ${({ mood }) =>
    mood === "sad" ? "var(--color-primary)" : "var(--color-secondary)"};
  border-radius: 50%;
  left: 50%;
  top: -100%;
  animation: ${arrival} 2s forwards;
  transform: translate(-50%, -50%);
`;

const Eyebrow = styled.div`
  background-color: transparent;
  border-bottom: 3px solid black;
  position: absolute;
  left: ${({ isLeft }) => (isLeft ? "25px" : "75px")};
  top: 20px;
  width: 20px;
  transform: ${({ isLeft }) => (isLeft ? "rotate(-30deg)" : "rotate(30deg)")};
  height: 10px;
  border-radius: 40%;
`;

const Eye = styled.div`
  background-color: ${({ mood }) => (mood === "sad" ? "black" : "transparent")};
  width: 20px;
  height: 16px;
  left: ${({ isLeft }) => (isLeft ? "30px" : "70px")};
  position: absolute;
  top: 35px;
  border-radius: 50%;
  border-bottom: solid black 4px;
  animation: ${({ mood }) =>
    mood === "sad" ? css`sadEyes} 1.5s forwards` : "none"};
  transform: ${({ mood }) =>
    mood === "happy" ? "rotate(180deg)" : "rotate(0deg)"};
`;

const Mouth = styled.div`
  position: absolute;
  width: 50px;
  top: 70px;
  left: 35px;
  height: 20px;
  background-color: ${({ mood }) =>
    mood === "happy" ? "transparent" : "black"};
  border-top: ${({ mood }) => (mood === "sad" ? "solid black 8px" : "none")};
  border-bottom: ${({ mood }) =>
    mood === "happy" ? "solid black 8px" : "none"};
  border-radius: 50%;
  box-sizing: content-box;
  animation: ${(props) =>
    css`
      ${eat} 3s forwards
    `};
`;

export const Smiley = ({ children, mood }) => {
  return (
    <Wrapper>
      <Pacman mood={mood}>
        {mood === "sad" && <Eyebrow isLeft />}
        <Eye mood={mood} isLeft />
        {mood === "sad" && <Eyebrow />}
        <Eye mood={mood} />
        <Mouth mood={mood} />
      </Pacman>
      {children}
    </Wrapper>
  );
};

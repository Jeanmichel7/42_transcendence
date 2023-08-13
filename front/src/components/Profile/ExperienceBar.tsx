import React from 'react';
import styled from 'styled-components';

interface Props {
  currentExp: number;
  currentLevel: number;
}

const ExperienceWrapper = styled.div`
  width: 70%;
  position: relative;
  height: 30px;
`;

const ExperienceBarWrapper = styled.div`
  width: 100%;
  height: 30px;
  border: 1px solid black;
  border-radius: 15px;
  position: relative;
  background-color: #f2f2f2;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => `${progress}%`};
  height: 100%;
  background-color: var(--color-primary);
  border-radius: 15px;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  transition: width 0.3s ease;
`;

const Graduation = styled.div`
  position: absolute;
  height: 50%;
  width: 2px;
  background-color: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:before {
    border-radius: 50%;
    content: '';
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    height: 6px;
    width: 6px;
    background-color: black;
  }
`;

// const Graduation = styled.div`
//   position: absolute;
//   height: 12px;
//   width: 7px;
//   background-color: black;
//   top: 50%;
//   left: 50%;
//   &:before {
//     border-radis: 50%;
//     content: "";
//     top: -50%;
//     left: 50%;
//     position: absolute;
//     height: 6px;
//     width: 6px;
//     background-color: black;
//     transform: translate(-50%, -50%);
//   }
// `;

const LevelLabel = styled.div<{ bottom?: boolean }>`
  position: absolute;
  font-weight: bold;
  z-index: 3;
  color: gray;
  ${({ bottom }) => (bottom ? 'top: 110% ' : 'bottom: 10%; color: black')};
`;

const ExperienceBar: React.FC<Props> = ({ currentExp, currentLevel }) => {
  const expForCurrentLevel = 5 * Math.pow(currentLevel, 2);
  const expForNextLevel = 5 * Math.pow(currentLevel + 1, 2);
  const progress =
    ((currentExp - expForCurrentLevel) /
      (expForNextLevel - expForCurrentLevel)) *
    100;

  return (
    <ExperienceWrapper>
      <LevelLabel style={{ left: '10px' }}>{currentLevel}</LevelLabel>
      <LevelLabel style={{ right: '10px' }}>{currentLevel + 1}</LevelLabel>
      <LevelLabel bottom style={{ left: '10px' }}>
        {expForCurrentLevel} XP
      </LevelLabel>
      <LevelLabel bottom style={{ right: '10px' }}>
        {expForNextLevel} XP
      </LevelLabel>
      <ExperienceBarWrapper>
        <ProgressBar progress={1} />

        {/* Graduations every 10% */}
        {[...Array(10)].map((_, index) => (
          <Graduation key={index} style={{ left: `${(index + 1) * 10}%` }} />
        ))}
      </ExperienceBarWrapper>
    </ExperienceWrapper>
  );
};

export default ExperienceBar;

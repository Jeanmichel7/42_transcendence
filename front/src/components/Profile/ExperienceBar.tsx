import React from 'react';
import styled from 'styled-components';

const ExperienceWrapper = styled.div`
  width: 70%;
  position: relative;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ExperienceBarWrapper = styled.div`
  width: 100%;
  height: 12px;
  border: 1px solid black;
  border-radius: 15px;
  position: relative;
  background-color: #f2f2f2;
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
    height: 3px;
    width: 1px;
    background-color: black;
  }
`;

const LevelLabel = styled.p<{ bottom?: boolean }>`
  font-weight: bold;
  font-size: 0.8rem;
  font-family: "Alegreya Sans SC", sans-serif;
  font-weight: bold;
  z-index: 3;
  color: gray;
  left: 10px;
  ${({ bottom }) => (bottom ? 'top: 110% ' : 'bottom: 10%; color: black')};
  overflow: hidden;
`;

interface Props {
  currentExp: number;
  currentLevel: number;
  displayGraduation?: boolean;
}

const ExperienceBar: React.FC<Props> = ({
  currentExp,
  currentLevel,
  displayGraduation,
}) => {
  const BASE_XP = 20;
  const expForNextLevel = BASE_XP * currentLevel;

  const computeLevel = (xp: number) => {
    let level = 1;
    while (xp >= BASE_XP * level) {
      xp -= BASE_XP * level;
      level++;
    }
    return xp;
  };
  const xpInLevel = computeLevel(currentExp);
  const progress = (xpInLevel * 100) / expForNextLevel;

  return (
    <ExperienceWrapper>
      <ExperienceBarWrapper>
        <ProgressBar progress={progress} />

        <div className="flex justify-between">
          <LevelLabel bottom>
            {xpInLevel}
            <span className="hidden md:inline">XP</span>
          </LevelLabel>
          <LevelLabel bottom>
            {expForNextLevel}
            <span className="hidden md:inline">XP</span>
          </LevelLabel>
        </div>

        {/* Graduations every 10% */}
        {displayGraduation != false && (
          <>
            {[...Array(10)].map(
              (_, index) =>
                index != 9 && (
                  <Graduation
                    key={index}
                    style={{ left: `${(index + 1) * 10}%` }}
                  />
                ),
            )}
          </>
        )}
      </ExperienceBarWrapper>
    </ExperienceWrapper>
  );
};

export default ExperienceBar;

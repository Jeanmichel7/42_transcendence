import styled from 'styled-components';
import Score, { ScoreValue } from './Score';
import BonusBox from './BonusBox';
import { PlayersInfo } from './Game';
import DisplayImg from '../../utils/displayImage';
import { memo } from 'react';

const StatutWrapper = styled.div`
  color: white;
  position: absolute;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 1rem;
  justify-content: between;
  align-items: center;
  height: 20%;
`;

interface StatutBarProps {
  playersInfo: PlayersInfo | undefined;
  scorePlayerLeft: number;
  scorePlayerRight: number;
  bonusActive: boolean;
  bonusIsLoading: boolean;
  bonusName: string | undefined;
  spectateMode?: boolean;
  bonusIsLoadingPlayerRight?: boolean;
  bonusNamePlayerRight?: string | undefined;
}

const StatutBar = ({
  playersInfo,
  scorePlayerLeft,
  scorePlayerRight,
  bonusActive,
  bonusIsLoading,
  bonusName,
  spectateMode,
  bonusIsLoadingPlayerRight,
  bonusNamePlayerRight,
}: StatutBarProps) => {
  return (
    <StatutWrapper>
      <div className="w-1/2 flex items-center justify-between">
        {bonusActive && (
          <BonusBox bonusIsLoading={bonusIsLoading} bonusName={bonusName} />
        )}
        {playersInfo && (
          <DisplayImg
            src={playersInfo?.playerLeftAvatar}
            alt="avatar"
            className="md:h-24 h-12 rounded-full"
          />
        )}
        <h2 className="md:text-xl font-bold w-1/4 text-center truncate">
          {playersInfo?.playerLeftUsername}
        </h2>
        <ScoreValue>{scorePlayerLeft}</ScoreValue>
      </div>

      <div className="w-1/2 flex items-center justify-between">
        <ScoreValue>{scorePlayerRight}</ScoreValue>
        <h2 className="md:text-xl font-bold w-1/4 text-center truncate">
          {playersInfo?.playerRightUsername}
        </h2>
        {playersInfo && (
          <DisplayImg
            src={playersInfo?.playerRightAvatar}
            alt="avatar"
            className="md:h-24 h-12 rounded-full"
          />
        )}
        {spectateMode && bonusActive && (
          <BonusBox
            bonusIsLoading={bonusIsLoadingPlayerRight}
            bonusName={bonusNamePlayerRight}
            left={false}
          />
        )}
      </div>
    </StatutWrapper>
  );
};

const areEqual = (prevProps: StatutBarProps, nextProps: StatutBarProps) => {
  return (
    prevProps.scorePlayerLeft === nextProps.scorePlayerLeft &&
    prevProps.scorePlayerRight === nextProps.scorePlayerRight &&
    prevProps.bonusActive === nextProps.bonusActive &&
    prevProps.bonusIsLoading === nextProps.bonusIsLoading &&
    prevProps.bonusName === nextProps.bonusName &&
    prevProps.bonusIsLoadingPlayerRight ===
      nextProps.bonusIsLoadingPlayerRight &&
    prevProps.bonusNamePlayerRight === nextProps.bonusNamePlayerRight &&
    prevProps.spectateMode === nextProps.spectateMode &&
    prevProps.playersInfo?.playerLeftAvatar ===
      nextProps.playersInfo?.playerLeftAvatar &&
    prevProps.playersInfo?.playerRightAvatar ===
      nextProps.playersInfo?.playerRightAvatar &&
    prevProps.playersInfo?.playerLeftUsername ===
      nextProps.playersInfo?.playerLeftUsername &&
    prevProps.playersInfo?.playerRightUsername ===
      nextProps.playersInfo?.playerRightUsername
  );
};

export default memo(StatutBar, areEqual);

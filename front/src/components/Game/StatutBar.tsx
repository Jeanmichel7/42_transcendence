import styled from 'styled-components';
import Score from './Score';
import BonusBox from './BonusBox';
import { PlayersInfo } from './Game';

const StatutWrapper = styled.div`
  color: white;
  position: absolute;
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 1rem;
  justify-content: between;
  align-items: center;
  height: 15%;
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

export function StatutBar({
  playersInfo,
  scorePlayerLeft,
  scorePlayerRight,
  bonusActive,
  bonusIsLoading,
  bonusName,
  spectateMode,
  bonusIsLoadingPlayerRight,
  bonusNamePlayerRight,
}: //... les autres props
StatutBarProps) {
  return (
    <StatutWrapper>
      {bonusActive && (
        <BonusBox bonusIsLoading={bonusIsLoading} bonusName={bonusName} />
      )}
      <img
        className="md:h-24 h-12 rounded-full"
        src={playersInfo?.playerLeftAvatar}
        title={'profile picture'}
      />
      <h2 className="md:text-xl font-bold  w-1/4 text-center  ">
        {playersInfo?.playerLeftUsername}
      </h2>

      <Score
        scorePlayerLeft={scorePlayerLeft}
        scorePlayerRight={scorePlayerRight}
      />

      <h2 className="md:text-xl font-bold  w-1/4 text-center">
        {playersInfo?.playerRightUsername}
      </h2>

      <img
        className="md:h-24 h-12 rounded-full"
        src={playersInfo?.playerRightAvatar}
        title={'profile picture'}
      />

      {spectateMode && bonusActive && bonusIsLoadingPlayerRight && (
        <BonusBox
          bonusIsLoading={bonusIsLoadingPlayerRight}
          bonusName={bonusNamePlayerRight}
          left={false}
        />
      )}
      {/* Ajoutez ici les autres composants que vous souhaitez inclure */}
    </StatutWrapper>
  );
}

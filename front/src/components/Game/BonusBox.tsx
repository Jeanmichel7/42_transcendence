import styled, { keyframes, css } from 'styled-components';
import laser from '../../assets/laser.png';
import slow from '../../assets/slow.png';
import bigRacket from '../../assets/bigRacket.png';
import spriteBonusSelection from '../../assets/spriteBonusSelection.png';

const images = [laser, slow, bigRacket];
images.forEach(imgSrc => {
  const img = new Image();
  img.src = imgSrc;
});

const getBonusImage = (bonusName: string) => {
  switch (bonusName) {
    case 'laser':
      return `url(${laser})`;
    case 'slow':
      return `url(${slow})`;
    case 'bigRacket':
      return `url(${bigRacket})`;
    default:
      return null;
  }
};
const ScrollImages = keyframes`
  0% {
    background-position: 0 0;
  }
  33% {
    background-position: 0 -75px;
  }
  66% {
    background-position: 0 -150px;
  }
  100% {
    background-position: 0 -225px;
  }
`;

const WhiteBackground = keyframes`
  0% {
    background-color: white;
  }
  50% {
    background-color: #f5f5f5;
  } 
  100% {
    background-color: transparent;
  }
  `;

interface BonusBoxWrapperProps {
  isLoading: boolean | undefined;
  bonusName: string;
  left: boolean;
}
const BonusBoxWrapper = styled.div<BonusBoxWrapperProps>`
  width: 75px;
  height: 75px;
  border: 1px solid white;
  left: ${props => (props.left ? '10px' : 'auto')};
  right: ${props => (!props.left ? '10px' : 'auto')};
  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  background-image: ${props =>
    props.isLoading
      ? `url(${spriteBonusSelection})`
      : getBonusImage(props.bonusName)};
  background-size: cover;
  ${props =>
    props.isLoading &&
    css`
      animation: ${ScrollImages} 0.5s steps(24) infinite;
    `}
  ${props =>
    !props.isLoading &&
    getBonusImage(props.bonusName) &&
    css`
      animation: ${WhiteBackground} 0.2s linear;
    `}
`;

interface BonusBoxProps {
  bonusIsLoading: boolean | undefined;
  bonusName: string | undefined;
  left?: boolean;
}
function BonusBox({ bonusIsLoading, bonusName, left }: BonusBoxProps) {
  return (
    <BonusBoxWrapper
      isLoading={bonusIsLoading}
      bonusName={bonusName ? bonusName : ''}
      left={left ?? true}
    ></BonusBoxWrapper>
  );
}

export default BonusBox;

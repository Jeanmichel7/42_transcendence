import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import laser from '../../assets/laser.png';
import slow from '../../assets/slow.png';
import bigRacket from '../../assets/bigRacket.png';

// Précharger les images
const images = [laser, slow, bigRacket];
images.forEach((imgSrc) => {
  const img = new Image();
  img.src = imgSrc;
});

// Keyframes pour l'animation
const ScrollImages = keyframes`
  0% {
    background-image: url(${laser});
  }
  33% {
    background-image: url(${slow});
  }
  66% {
    background-image: url(${bigRacket});
  }
  100% {
    background-image: url(${laser});
  }
`;

const getBonusImage = (bonusName) => {
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
}

const BonusBoxWrapper = styled.div`
  width: 75px;
  height: 75px;
  border : 1px solid white;
  position: absolute;
  left: 25px;
  top: 25px;
  background-size: cover;
  background-image: ${props => props.isLoading ? 'none' : getBonusImage(props.bonusName)};
  ${props => props.isLoading && css`
    animation: ${ScrollImages} 3s infinite;
  `}
`;

function BonusBox({ bonusIsLoading, bonusName}: any) {
  return (
    <BonusBoxWrapper isLoading={bonusIsLoading} bonusName={bonusName}>
    </BonusBoxWrapper>
  );
}

export default BonusBox;
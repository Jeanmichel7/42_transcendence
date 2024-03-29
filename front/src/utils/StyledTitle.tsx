import styled, { keyframes } from 'styled-components';

const shineAnimation = keyframes`
0% {
    background-position: 100% 50%;
}
5% {
  background-position: 100% 50%;
}
20% {
  background-position: 0% 50%;
}
100% {
  background-position: 0% 50%;
}
`;

// const shineAnimation = keyframes`
// 5% {
//   background-position: 0% 50%;
// }
// 20% {
//   background-position: 100% 50%;
// }
// 100% {
//   background-position: 100% 50%;
// }
// `;
const ShineSpan = styled.span`
  background: linear-gradient(
    var(--shine-angle),
    rgba(255, 0, 0, 0) 0%,
    rgba(255, 0, 0, 0) 45%,
    rgba(255, 255, 255, 0.98) 49.95%,
    rgba(255, 255, 255, 0.98) 50.15%,
    rgba(255, 0, 0, 0) 55%,
    rgba(255, 0, 0, 0)
  );
  -webkit-background-clip: text;
  background-size: 400% 100%;
  grid-area: text;
  animation: ${shineAnimation} 12s ease infinite;
  padding: 0em 0.07em;
  font-size: 1em;
  z-index: 10;
`;
const StickerSpan = styled.span`
  background: linear-gradient(
    to right,
    var(--c1),
    var(--c2),
    var(--c3),
    var(--c4),
    var(--c5)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 0.01em rgba(0, 0, 0, 0.6);
  grid-area: text;
  padding: 0em 0.07em;
  font-size: 1em;
  z-index: 10;
`;

const StickerWrapper = styled.span`
  --c1: #4a90e2; /* Bleu plus foncé */
  --c2: #1976d2; /* Bleu moyen, proche de #1976d2 */
  --c3: #1976d2; /* Bleu clair */
  --c4: #c95ddc; /* Variante de violet */
  --c5: #4a90e2; /* Bleu plus clair */
  --c6: #002244; /* Bleu très foncé */

  --shine-angle: 15deg;
  display: inline-grid;
  grid-template-areas: 'text';
  place-items: center;
  font-family: 'Alegreya Sans SC', sans-serif;
  font-weight: 900;
  width: 100%;
  font-style: italic;
  font-size: clamp(3rem, 3.8vw, 7rem);
  text-transform: uppercase;
  color: var(--c5);

  &::before {
    content: attr(data-text);
    color: #fff;
    grid-area: text;
    -webkit-text-stroke: 0.21em white;
    background: no-repeat linear-gradient(white, white) 15% 50% / 85% 45%;
  }

  &::after {
    content: attr(data-text);
    position: relative;
    color: #fff;
    z-index: -1;
    grid-area: text;
    text-shadow: 0.07em 0.08em 0.05em rgba(0, 0, 0, 0.75),
      -0.07em -0.05em 0.05em rgba(0, 0, 0, 0.75);
  }
`;

export const Sticker = ({ dataText }: { dataText: string }) => {
  return (
    <StickerWrapper data-text={dataText}>
      <StickerSpan>
        <ShineSpan>{dataText}</ShineSpan>
      </StickerSpan>
    </StickerWrapper>
  );
};

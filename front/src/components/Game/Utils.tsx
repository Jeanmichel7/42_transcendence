import styled, { keyframes } from 'styled-components';
import React from 'react';

const dotAnimation = keyframes`
  0%, 80%, 100% { 
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`;

const DotWrapper = styled.div`
  display: flex;
  justify-content: center;
  transform: translate(-50%, -50%);
  align-items: center;
  padding-bottom: 2rem;
`;

// Crée un composant Dot qui utilise l'animation
const Dot = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  margin: 0.5rem;
  animation: ${dotAnimation} 1s infinite ease-in-out both;
`;

const Dot1 = styled(Dot)`
  animation-delay: -0.32s;
`;

const Dot2 = styled(Dot)`
  animation-delay: -0.16s;
`;

export function DotWaitings() {
  return (
    <DotWrapper>
      <Dot1 />
      <Dot2 />
      <Dot />
    </DotWrapper>
  );
}

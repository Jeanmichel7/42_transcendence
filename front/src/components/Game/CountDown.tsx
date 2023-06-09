import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Définir une animation keyframes pour le fondu et le zoom.
const fadeAndZoomIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

const CountdownWrapper = styled.div`
  font-size: 2em;
  color: #333;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Number = styled.span`
  font-size: 8em; // Augmenter la taille de la police
  color: #;
  animation: ${fadeAndZoomIn} 1s ease-out;
`;

const Countdown = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((currentCount) => (currentCount - 1 <= 0 ? 0 : currentCount - 1));
    }, 1000);

    // Cleanup on unmount or when count reaches 0
    return () => {
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <CountdownWrapper>
      <Number key={count}>
        {count > 0 ? count : "Go!"}
      </Number>
    </CountdownWrapper>
  );
};

export default Countdown;
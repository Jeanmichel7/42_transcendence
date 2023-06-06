import React, { useState, useEffect } from "react";
import styled from "styled-components";

const CountdownWrapper = styled.div`
  font-size: 2em;
  color: #333;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
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
      {count > 0 ? count : "Go!"}
    </CountdownWrapper>
  );
};

export default Countdown;
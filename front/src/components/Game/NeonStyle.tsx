import styled from 'styled-components';
import { keyframes } from 'styled-components';

  export const pulsate = keyframes`
      
  100% {

      text-shadow:
      0 0 4px #fff,
      0 0 11px #fff,
      0 0 19px #fff,
      0 0 40px #bc13fe,
      0 0 80px #bc13fe,
      0 0 90px #bc13fe,
      0 0 100px #bc13fe,
      0 0 150px #bc13fe;
  
  }
  
  0% {

    text-shadow:
    0 0 2px #fff,
    0 0 4px #fff,
    0 0 6px #fff,
    0 0 10px #bc13fe,
    0 0 45px #bc13fe,
    0 0 55px #bc13fe,
    0 0 70px #bc13fe,
    0 0 80px #bc13fe;
  }`;



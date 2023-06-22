import { Link, NavLink } from "react-router-dom";
import "../utils/login.scss";
import styled, { keyframes, css } from "styled-components";
import "../fonts/fonts.css";
import { Button } from "@mui/material";
import { useState } from "react";
import ConnectPage from "./Connection";

const slideInFromBottom = keyframes`{
  0% {
    transform: translateY(200%);
  }
  100% {
    transform: translateY(0);
  }
}`;

const slideInFromBottomLink = keyframes`{
  0% {
    transform: translateY(200%);
  }
  50% {
    transform: translateY(200%);
  }
  100% {
    transform: translateY(0);
  }
}`;

const particleContainer = styled.div`
  background-color: #f9ecd0;
  height: 100vh;
`;

const TitleWrapper = styled.div`
  height: 200px;
  width: 80%;
  position: absolute;
  left: 20%;
  top: 20%;
  overflow: hidden;
  align-items: baseline;
  display: flex;
  flex-direction: line;
  @media (max-width: 768px) {
    flex-direction: column;
    height: 400px;
  }
`;

const Title = styled.h1`
  font-size: 8rem;
  animation: ${slideInFromBottom} 2s ease-out;
  color: white;
  font-family: "Exo", sans-serif;
`;

const BigCircle = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%)
    scale(${(props) => (props.expand ? 2.5 : props.hovered ? 0.3 : 0.2)});
  opacity: ${(props) => (props.expand ? 1 : props.hovered ? 0.5 : 0.02)};
  width: 100vh;
  height: 100vh;
  border-radius: 50%;
  background-color: white;
  z-index: 2;
  transition: transform 1s ease-out, opacity 1s ease-out;
`;

const StyledLink = styled(Link)`
  position: relative;
  font-family: "Exo", sans-serif;
  margin-left: 2rem;
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  padding: 1rem 1rem;
  border: 2px solid #fff;
  border-radius: 2rem;
  animation: ${slideInFromBottomLink} 3s ease-out;
  overflow: hidden;
  transition: color 0.3s ease;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #fff;
    transition: width 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: ${(props) => (!props.expand ? "#000" : "#fff")};
    &::before {
      width: 100%;
    }
  }
`;

const LoginWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

export default function Login() {
  const [isHovered, setIsHovered] = useState(false);
  const [expand, setExpand] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();

    setExpand(true);

    setTimeout(() => {
      // redirect after 1s
      window.location = e.target.href;
    }, 1000);
  };

  return (
    <LoginWrapper>
      <div className="particle-container">
        <div className="particles">
          <span className="circle"></span>
          <span className="circle 1"></span>
          <span className="circle 2"></span>
          <span className="circle 3"></span>
          <span className="circle 4"></span>
          <span className="circle 5"></span>
          <span className="circle 6"></span>
          <span className="circle 7"></span>
          <span className="circle 8"></span>
          <span className="circle 9"></span>
          <span className="circle 10"></span>
          <span className="circle 11"></span>
          <span className="circle 12"></span>
          <span className="circle 13"></span>
          <span className="circle 14"></span>
          <span className="circle 15"></span>
          <span className="circle 16"></span>
          <span className="circle 17"></span>
          <span className="circle 18"></span>
          <span className="circle 19"></span>
          <span className="circle 20"></span>
          <span className="circle 21"></span>
          <span className="circle 22"></span>
          <span className="circle 23"></span>
          <span className="circle 24"></span>
          <span className="circle 25"></span>
          <span className="circle 26"></span>
          <span className="circle 27"></span>
          <span className="circle 28"></span>
          <span className="circle 29"></span>
        </div>
      </div>
      <BigCircle hovered={isHovered} expand={expand} />
      <TitleWrapper>
        <Title>Pong</Title>
        <StyledLink
          onClick={handleClick}
          to="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-406bbf6d602e19bc839bfe3f45f42cf949704f9d71f1de286e9721bcdeff5171&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2FloginOAuth&response_type=code"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          expand={expand}
        >
          Login as a 42 student
        </StyledLink>
        <NavLink to="/fakeconnection">
          <Button sx={{ my: 2, color: "white", display: "block" }}>
            Login Fake
          </Button>
        </NavLink>
      </TitleWrapper>
    </LoginWrapper>
  );
}

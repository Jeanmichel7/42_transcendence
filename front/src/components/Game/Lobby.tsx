import styled, { keyframes } from "styled-components";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketInterface,
} from "./Interface";

export const StyledButton = styled.button`
  position: relative;
  font-family: "Exo", sans-serif;
  margin-left: 2rem;
  color: #fff;
  text-decoration: none;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  padding: 1rem 1rem;
  border: 2px solid #fff;
  border-radius: 3rem;
  transition: color 0.3s ease;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    height: 5rem;
    width: 5rem;
    background-color: #fff;
    border-radius: 3rem;
    transition: width 0.3s ease;
    z-index: -1;
    left: -50%;
  }

  &:hover {
    color: ${(props) => (!props.expand ? "#000" : "#fff")};
    &::before {
      width: 150%;
    }
  }
`;

const ButtonWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-direction: column;
  position: absolute;
  left: 40%;
`;

interface LobbyProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  // socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  socket: any;
}

function Lobby({ setCurrentPage, socket }: LobbyProps) {
  return (
    <ButtonWrapper>
      <StyledButton
        onClick={() => {
          socket.emit("userGameStatus", "searchNormal", (response) => {
            if (response === "error") {
              setCurrentPage("lobby");
            }
          });
          setCurrentPage("searchOpponent");
        }}
      >
        Normal Mode
      </StyledButton>
      <StyledButton
        onClick={() => {
          socket.emit("userGameStatus", "searchBonus", (response) => {
            if (response === "error") {
              setCurrentPage("lobby");
            }
          });
          setCurrentPage("searchOpponent");
        }}
      >
        Bonus Mode
      </StyledButton>
    </ButtonWrapper>
  );
}

export default Lobby;

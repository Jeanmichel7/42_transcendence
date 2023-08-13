import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Game } from './game.class';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface clientUpdate {
  posRacket: number;
  ArrowDown: boolean;
  ArrowUp: boolean;
  gameId: bigint;
  useBonus: boolean;
}

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
})
export class GameEvents {
  @WebSocketServer()
  server: Server;

  constructor(
    private gameService: GameService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    eventEmitter.on('updateLobbyRoomRequire', () => {
      this.server
        .to('LobbyRoom')
        .emit('lobbyRoomUpdate', this.gameService.getAllGamesInfo());
      // Faites ce que vous devez faire quand l'événement est déclenché
    });
    setInterval(() => {
      const games: Map<bigint, Game> = this.gameService.getGames();
      games.forEach(async (game) => {
        if (game.isBeingProcessed) return; // Skip si le jeu est en cours de traitement
        game.isBeingProcessed = true;
        const update = await this.gameService.updateGame(game);
        this.server.to(`gameRoom-${game.id}`).emit('gameUpdate', update);
        this.server.to(game.socketPlayer1Id).emit('gameUpdate', update);
        update.isPlayerRight = true;
        this.server.to(game.socketPlayer2Id).emit('gameUpdate', update);
        if (!game.isOver) game.isBeingProcessed = false;
      });
    }, 1000 / 60);
  }

  //conexion
  async handleConnection(client: Socket) {
    if (client.handshake.headers.cookie === undefined) return;
    const cookieArray = client.handshake.headers.cookie.split(';');
    let jwtToken = '';
    cookieArray.forEach((cookie) => {
      const cookieParts = cookie.split('=');
      if (cookieParts[0] === 'jwt' || cookieParts[0] === ' jwt') {
        jwtToken = cookieParts[1];
      }
    });

    if (!jwtToken) {
      // throw new UnauthorizedException("You're not logged in", 'No token found');
      return;
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(jwtToken, {
        secret: jwtSecret,
      });
      // Maintenant, vous avez validé le jeton et extrait le payload.
      // Vous pouvez utiliser le payload pour obtenir des informations sur l'utilisateur.

      // Par exemple, si vous avez l'ID de l'utilisateur dans le payload :
      client.data.userId = payload.login;
      // console.log(client.data);
    } catch (e) {
      throw new UnauthorizedException('Authorization error', e.message);
    }
    if (this.gameService.checkAlreadyInGame(client.data.userId)) {
      this.server.to(client.id).emit('userGameStatus', 'alreadyInGame');
      this.gameService.updateClientSocketId(client.id, client.data.userId);
    } else {
      this.server.to(client.id).emit('userGameStatus', 'notInGame');
    }
    return 'connected to GAME';
  }

  //desconexio
  handleDisconnect(client: Socket) {
    this.gameService.removeFromQueue(client.id);
  }

  @SubscribeMessage('spectateGame')
  handleSpectateGame(
    @MessageBody() gameId: bigint,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('VALEUR DE GAME ID', gameId);
    Object.keys(client.rooms).forEach((roomId) => {
      if (roomId !== client.id) {
        client.leave(roomId);
      }
    });
    console.log(`spectating game ${gameId}`);
    client.join(`gameRoom-${gameId}`);
  }

  @SubscribeMessage('joinLobbyRoom')
  handleJoinLobbyRoom(client: Socket) {
    client.join('LobbyRoom');
    client.emit('lobbyRoomUpdate', this.gameService.getAllGamesInfo());
  }

  @SubscribeMessage('leaveLobbyRoom')
  handleLeaveLobbyRoom(client: Socket) {
    client.leave('LobbyRoom');
  }

  @SubscribeMessage('privateLobby')
  async handlePrivateLobby(
    @MessageBody()
    update: { gameId: bigint; mode: string; ready: boolean; player1: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    if (
      !client.data.userId ||
      this.gameService.checkAlreadyInGame(client.data.userId)
    )
      return 'error when joining/creating private lobby';
    const data = {
      username: client.data.userId,
      socketId: client.id,
      gameId: update.gameId,
      mode: update.mode,
      ready: update.ready,
    };
    const gameStarted = this.gameService.updatePrivateLobby(
      update.player1,
      data,
    );
    const socket = this.gameService.getOtherPlayerSockerId(
      update.gameId,
      update.player1,
    );
    if (gameStarted) {
      this.server.to(socket).emit('userGameStatus', 'alreadyInGame');
      this.server.to(client.id).emit('userGameStatus', 'alreadyInGame');
      console.log('game started');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { socketId: _, ...newData } = data;
    if (socket) this.server.to(socket).emit('privateLobby', newData);
  }

  @SubscribeMessage('userGameStatus')
  async handleSearchOpponent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.userId) {
      return 'error';
    }
    if (message === 'cancel') {
      this.gameService.removeFromQueue(client.data.userId);
      return;
    } else if (message === 'searchNormal' || message === 'searchBonus') {
      const opponent = await this.gameService.addToQueue(
        client.id,
        client.data.userId,
        message === 'searchBonus',
      );
      if (opponent) {
        if (message === 'searchBonus') {
          this.server.to(client.id).emit('userGameStatus', 'foundBonus');
          this.server.to(opponent).emit('userGameStatus', 'foundBonus');
        } else {
          this.server.to(client.id).emit('userGameStatus', 'foundNormal');
          this.server.to(opponent).emit('userGameStatus', 'foundNormal');
        }
      }
    }
  }

  @SubscribeMessage('clientUpdate')
  handlePaddlePosition(
    @MessageBody() data: clientUpdate,
    @ConnectedSocket() client: Socket,
  ) {
    this.gameService.updateClientData(data, client.id);
  }

  // @SubscribeMessage('ballPosition')
  // handleBallPosition(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ) {}

  // @SubscribeMessage('gameEnd')
  // handleGameEnd(
  //   @MessageBody() data: string,
  //   @ConnectedSocket() client: Socket,
  // ) {}

  // @SubscribeMessage('message')
  // handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
  //   //this.server.emit('message', client.id, data)
  //   const rt_data = {
  //     message: 'hello',
  //     timestamp: Date.now(),
  //   };
  //   return rt_data;
  //   // recevoir un event (s'abonner a` un message)
  // }
}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Game } from './game.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

interface clientUpdate {
  posRacket: number;
  ArrowDown: boolean;
  ArrowUp: boolean;
  gameId: string;
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
  ) {
    setInterval(() => {
      const games: Map<string, Game> = this.gameService.getGames();
      games.forEach((game) => {
        const update = this.gameService.updateGame(game);
        this.server.to(game.socketPlayer1Id).emit('gameUpdate', update);
        update.isPlayerRight = true;
        this.server.to(game.socketPlayer2Id).emit('gameUpdate', update);
      });
    }, 1000 / 60);
  }

  //conexion
  async handleConnection(client: Socket) {
    //const token = client.handshake.headers.cookies['jwt'];

    let cookieArray = client.handshake.headers.cookie.split(';');
    let jwtToken = '';
    cookieArray.forEach((cookie) => {
      let cookieParts = cookie.split('=');
      if (cookieParts[0] === 'jwt') {
        jwtToken = cookieParts[1];
      }
    });

    if (!jwtToken) {
      throw new UnauthorizedException("You're not logged in", 'No token found');
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
      console.log(client.data);
    } catch (e) {
      throw new UnauthorizedException('Authorization error', e.message);
    }
    if (this.gameService.checkAlreadyInGame(client.data.userId)) {
      this.server.to(client.id).emit('userGameStatus', 'alreadyInGame');
      this.gameService.updateClientSocketId(client.id, client.data.userId);
    } else {
      this.server.to(client.id).emit('userGameStatus', 'notInGame');
    }
    return 'connected';
  }

  //desconexio
  handleDisconnect(client: Socket) {
    console.log('client disconnected: ' + client.id);
    this.gameService.removeFromQueue(client.id);
  }

  @SubscribeMessage('userGameStatus')
  handleSearchOpponent(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.userId) {
      return 'error';
    }
    if (message === 'cancel') {
      this.gameService.removeFromQueue(client.id);
      return;
    } else if (message === 'search') {
      const opponent = this.gameService.addToQueue(
        client.id,
        client.data.userId,
      );
      console.log('searching opponent for: ' + client.id);
      if (opponent) {
        console.log('opponent found: ' + opponent);
        this.server.to(client.id).emit('userGameStatus', 'found');
        this.server.to(opponent).emit('userGameStatus', 'found');
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

  @SubscribeMessage('ballPosition')
  handleBallPosition(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {}

  @SubscribeMessage('gameEnd')
  handleGameEnd(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {}

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    //this.server.emit('message', client.id, data)
    const rt_data = {
      message: 'hello',
      timestamp: Date.now(),
    };
    return rt_data;
    // recevoir un event (s'abonner a` un message)
  }
}

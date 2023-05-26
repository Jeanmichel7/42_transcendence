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

interface clientUpdate {
  posRacket: number;
  ArrowDown: boolean;
  ArrowUp: boolean;
  gameId: string;
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

  constructor(private gameService: GameService) {
    setInterval(() => {
      const games: Map<string, Game> = this.gameService.getGames();
      games.forEach((game) => {
        const update = this.gameService.updateGame(game);
        this.server.to(game.player1Id).emit('serverUpdate', update);
        update.isPlayerRight = true;
        this.server.to(game.player2Id).emit('serverUpdate', update);
      });
    }, 1000 / 20);
  }

  //conexion
  handleConnection(client: Socket) {
    this.gameService.addToQueue(client.id);
    console.log('client connected: ' + client.id);
  }

  //desconexion
  handleDisconnect(client: Socket) {
    console.log('client disconnected: ' + client.id);
  }

  @SubscribeMessage('SearchOpponent')
  handleSearchOpponent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {}

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

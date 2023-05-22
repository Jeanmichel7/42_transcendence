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
      const games = this.gameService.getGames();

      for (const game of games) {
        const update = this.gameService.updateGame(game);
        this.server.to(game.player1Id).emit('gameUpdate', update);
        this.server.to(game.player2Id).emit('gameUpdate', update);
      }
    }, 20);
  }

  //conexion
  handleConnection(client: Socket) {
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

  @SubscribeMessage('paddlePosition')
  handlePaddlePosition(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('paddlePosition: ' + data, client.id);
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
    console.log('message: ' + data);
    const rt_data = {
      message: 'hello',
      timestamp: Date.now(),
    };
    return rt_data;
    // recevoir un event (s'abonner a` un message)
  }
}

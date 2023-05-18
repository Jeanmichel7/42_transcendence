import {WebSocketGateway, WebSocketServer,} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {ConnectedSocket, MessageBody, SubscribeMessage} from '@nestjs/websockets';


@WebSocketGateway({
  namespace : '/game',
  cors: {
    origin: '*',
  }
})
export class GameEvents {
  @WebSocketServer()
  server: Server;

  //conexion
  handleConnection(client: Socket)
  {
    console.log('client connected: ' + client.id);
  }

  //desconexion
  handleDisconnect(client: Socket)
  {
    console.log('client disconnected: ' + client.id);
  }
  
  @SubscribeMessage('SearchOpponent')
  handleSearchOpponent(@MessageBody() data: string, @ConnectedSocket()client: Socket ) {}

  @SubscribeMessage('paddlePosition')
  handlePaddlePosition(@MessageBody() data: string, @ConnectedSocket()client: Socket ) {}

  @SubscribeMessage('ballPosition')
  handleBallPosition(@MessageBody() data: string, @ConnectedSocket()client: Socket ) {}

  @SubscribeMessage('gameEnd')
  handleGameEnd(@MessageBody() data: string, @ConnectedSocket()client: Socket ) {}
  

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string, @ConnectedSocket()client: Socket ) {

    //this.server.emit('message', client.id, data)
    console.log('message: ' + data)
    return (data)
  // recevoir un event (s'abonner a` un message)
  }

}
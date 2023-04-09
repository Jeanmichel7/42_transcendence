import { Param, Query } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageInterface } from "src/modules/messagerie/interfaces/message.interface";

@WebSocketGateway({
  namespace: 'messages',
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})
export class SocketEvents {
  @WebSocketServer() server: Server;

  /* ************************* */
  /*         Messagerie        */
  /* ************************* */





 
  @SubscribeMessage("joinPrivateRoom")
  async handleJoin(
    @MessageBody() data: { user1Id: string; user2Id: string },
    @ConnectedSocket() client: Socket
  ) {
    const privateRoomName = this.PrivateRoomName(data.user1Id, data.user2Id);
    client.join(privateRoomName);
    console.log("joined private room", privateRoomName , data);
  }

  emitMessage(message: MessageInterface) {
    const user1 = message.ownerUser.id;
    const user2 = message.destUser.id;
    const roomName = this.PrivateRoomName(user1, user2)
    this.server.to(roomName).emit("message", message);
    console.log("message sent to room" + roomName)
  }







  /* ************************* */
  /*           Chat            */
  /* ************************* */

    // async handleConnection(
  //   client: Socket,
  // ) {
  //   const token = client.handshake.auth.token;
  //   const userId = client.handshake.query.userId;
  //   // console.error("token = ", token)
  //   console.log("client connected", userId, client.id);
  //   // client.join(`user-${userId}`);
  // }

  // async handleDisconnect(client: Socket) {
  //   console.log("client disconnected", client.id);
  // }

  

    // @SubscribeMessage("message")
    // handleEvent(
    //   @MessageBody() data: string,
    //   @ConnectedSocket() client: Socket,
    // ): string {
    //   console.log("client message", data, client.id);
  
    //   // envoy data to all clients
    //   this.server.emit("message", data, client.id)
  
    //   return data;
    // }


  /* ************************* */
  /*           Utils           */
  /* ************************* */

  private PrivateRoomName(userId1, userId2) {
    // Assurez-vous que userId1 est toujours inférieur à userId2
    if (userId1 > userId2) {
      [userId1, userId2] = [userId2, userId1];
    }
    return `private_room_${userId1}_${userId2}`;
  }

















  // async handleJoin(client: Socket, data: any) {
  //   console.log("client join", client.id, data);
  // }

  // async handleLeave(client: Socket, data: any) {
  //   console.log("client leave", client.id, data);
  // }

  // async handlePing(client: Socket, data: any) {
  //   console.log("client ping", client.id, data);
  // }

  // async handlePong(client: Socket, data: any) {
  //   console.log("client pong", client.id, data);
  // }

  // async handleMessage(client: Socket, data: any) {
  //   console.log("client message", client.id, data);
  // }

  // async handleConnect(client: Socket, data: any) {
  //   console.log("client connect", client.id, data);
  // }

  // async handleConnectError(client: Socket, data: any) {
  //   console.log("client connect error", client.id, data);
  // }

  // async handleConnectTimeout(client: Socket, data: any) {
  //   console.log("client connect timeout", client.id, data);
  // }

  // async handleReconnect(client: Socket, data: any) {
  //   console.log("client reconnect", client.id, data);
  // }

  // async handleReconnectAttempt(client: Socket, data: any) {
  //   console.log("client reconnect attempt", client.id, data);
  // }

  // async handleReconnecting(client: Socket, data: any) {
  //   console.log("client reconnecting", client.id, data);
  // }

  // async handleReconnectError(client: Socket, data: any) {
  //   console.log("client reconnect error", client.id, data);
  // }

  // async handleReconnectFailed(client: Socket, data: any) {
  //   console.log("client reconnect failed", client.id, data);
  // }

  // async handleError(client: Socket, data: any) {
  //   console.log("client error", client.id, data);
  // }

  // async handleAny(client: Socket, data: any) {
  //   console.log("client any", client.id, data);
  // }

  // async handleCustomEvent(client: Socket, data: any) {
  //   console.log("client custom event", client.id, data);
  // }
  
}

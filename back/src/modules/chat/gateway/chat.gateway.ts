import { Param, Query } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageInterface } from "src/modules/messagerie/interfaces/message.interface";
import { ChatMsgInterface } from "../interfaces/chat.message.interface";

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log("user is connected", client.id);
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log("user is disconnected", client.id);
  }





  @SubscribeMessage("joinRoom")
  async handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(data.roomId);
    console.log("joined chat room", data.roomId, data);
  }

  @SubscribeMessage("leaveRoom")
  async handleLeaveRoom(
    @MessageBody() data: { roomName: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(data.roomName);
    console.log("left private room", data.roomName);
  }

  emitMessage(message: ChatMsgInterface) {
    this.server.to(message.room.id.toString()).emit("chat-message", message);
    console.log("message sent to room" + message.room.id)
  }

  emitJoinRoom(roomId: string, userId: string) {
    this.server.to(roomId).emit("join-room", `${userId} join the room`);
    console.log("user joined room" + roomId)
  }




  /* ************************* */
  /*           Chat            */
  /* ************************* */

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

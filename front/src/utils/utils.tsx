import { UserInterface, RoomInterface, ConversationInterface, MessageInterface, ChatMsgInterface } from '../types';

export function getTimeSince(time: Date): string {
  const now: Date = new Date();
  const dataTime: Date = new Date(time);
  const diff: number = now.getTime() - dataTime.getTime();
  const seconds: number = Math.floor(diff / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  let result = '';

  if (hours > 24)
    result += 'Le ' + dataTime.toLocaleDateString();
  else if (hours == 0 && minutes == 0 && seconds <= 30)
    result += 'Now';
  else {
    result += 'Il y a ';
    if (hours >= 1) {
      result += `${hours}h`;
    } else if (minutes >= 1) {
      result += `${minutes}m`;
    } else {
      result += `${seconds}s`;
    }
  }
  return result;
}

export function isUserInterface(obj: any): obj is UserInterface {
  return obj && obj.login !== undefined;
}

export function isRoomInterface(obj: any): obj is RoomInterface {
  return obj && obj.name !== undefined;
}

export function isConvAlreadyExist( // isConvEntityAlreadyExist
  conv: (UserInterface | RoomInterface),
  listConvs: ConversationInterface[],
): boolean {
  return listConvs.some((convInList) => {
    if (isRoomInterface(convInList.room) && isRoomInterface(conv)) {
      if (convInList.room.id === conv.id)
        return true;
      else
        return false;
    } else if (isUserInterface(convInList.user) && isUserInterface(conv)) {
      if (convInList.user.id === conv.id)
        return true;
      else
        return false;
    }
    return false;
  });
}

export function isMsgInterface(obj: any): obj is MessageInterface {
  return obj && obj.destUser !== undefined;
}
export function isChatMsgInterface(obj: any): obj is ChatMsgInterface {
  return obj && obj.room !== undefined;
}

export function getConvIdFromUserOrRoom(
  userOrRoom: (UserInterface | RoomInterface),
  listConvs: ConversationInterface[],
): number {
  let convId = -1;
  listConvs.forEach((convInList) => {
    if (isRoomInterface(convInList.room) && isRoomInterface(userOrRoom)) {
      if (convInList.room.id === userOrRoom.id) {
        convId = convInList.id;
      }
    } else if (isUserInterface(convInList.user) && isUserInterface(userOrRoom)) {
      if (convInList.user.id === userOrRoom.id) {
        convId = convInList.id;
      }
    }
  });
  return convId;
}
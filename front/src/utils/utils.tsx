import { UserInterface, RoomInterface, ConversationInterface } from '../types';

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

export function isConvAlreadyExist(
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
import { UserEntity } from 'src/modules/users/entity/users.entity';
import { UserRelationEntity } from 'src/modules/users_relations/entities/users_relation.entity';
import { MessageEntity } from 'src/modules/messagerie/entity/messages.entity';
import { ChatRoomEntity } from 'src/modules/chat/entity/chat.room.entity';
import { ChatMessageEntity } from 'src/modules/chat/entity/chat.message.entity';
import { GameEntity } from 'src/modules/game/entity/game.entity';
import { NotificationEntity } from 'src/modules/notification/entity/notification.entity';
import { TrophiesEntity } from 'src/modules/trophies/entity/trophies.entity';
import { UserTrophiesEntity } from 'src/modules/trophies/entity/userTrophiesProgress.entity';

const entities = [
  UserEntity,
  UserRelationEntity,
  MessageEntity,
  ChatRoomEntity,
  ChatMessageEntity,
  GameEntity,
  NotificationEntity,
  TrophiesEntity,
  UserTrophiesEntity,
];

export { UserEntity };
export { UserRelationEntity };
export { MessageEntity };
export { ChatRoomEntity };
export { ChatMessageEntity };
export { GameEntity };
export { NotificationEntity };
export { TrophiesEntity };
export default entities;

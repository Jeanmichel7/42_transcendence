import { UserEntity } from '../src/modules/users/entity/users.entity';
import { UserRelationEntity } from '../src/modules/users_relations/entities/users_relation.entity';
import { MessageEntity } from '../src/modules/messagerie/entity/messages.entity';
import { ChatRoomEntity } from '../src/modules/chat/entity/chat.room.entity';
import { ChatMessageEntity } from '../src/modules/chat/entity/chat.message.entity';

const entities = [
  UserEntity,
  UserRelationEntity,
  MessageEntity,
  ChatRoomEntity,
  ChatMessageEntity,
];

export { UserEntity };
export { UserRelationEntity };
export { MessageEntity };
export { ChatRoomEntity };
export { ChatMessageEntity };
export default entities;

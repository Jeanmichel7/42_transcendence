import { UserEntity } from "src/modules/users/entity/users.entity";
import { UserRelationEntity } from "src/modules/users/entity/user.relation.entity";
import { MessageEntity} from "src/modules/messagerie/entity/messages.entity";

const entities = [UserEntity, UserRelationEntity, MessageEntity];

export {UserEntity};
export {UserRelationEntity};
export {MessageEntity};
export default entities;

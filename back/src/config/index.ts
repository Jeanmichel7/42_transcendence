import { UserEntity } from "src/modules/users/entity/users.entity";
import { MessageEntity} from "src/modules/messagerie/entity/messages.entity";
// import { MessageInfo } from "src/modules/messages_Sse/entity/messages.entity";

const entities = [UserEntity, MessageEntity];

export {UserEntity};
export {MessageEntity};
export default entities;

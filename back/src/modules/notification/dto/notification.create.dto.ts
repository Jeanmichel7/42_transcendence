import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { UserEntity } from 'config';

export class NotificationCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 2048)
  content: string;

  @IsNotEmpty()
  @IsString()
  type:
    | 'friendRequest'
    | 'friendRequestAccepted'
    | 'friendRequestDeclined'
    | 'friendRequestCanceled'
    | 'friendDeleted'
    | 'blockUser'
    | 'unblockUser'
    | 'roomInvite'
    | 'message';

  @IsNotEmpty()
  sender: UserEntity;

  @IsNotEmpty()
  receiver: UserEntity;

  @IsOptional()
  @IsNotEmpty()
  invitationLink: string;
}
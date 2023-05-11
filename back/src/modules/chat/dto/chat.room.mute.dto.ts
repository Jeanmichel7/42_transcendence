import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ChatMuteUserDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  muteDurationSec: string;
}

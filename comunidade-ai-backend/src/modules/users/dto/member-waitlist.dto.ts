import { WaitlistTopic } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class MemberWaitlistDto {
  @IsEnum(WaitlistTopic)
  topic!: WaitlistTopic;
}

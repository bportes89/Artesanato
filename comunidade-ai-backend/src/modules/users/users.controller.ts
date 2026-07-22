import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '../auth/auth.decorators';
import { AuthUser } from '../auth/auth.types';
import { MemberWaitlistDto } from './dto/member-waitlist.dto';
import { TeacherApplicationDto } from './dto/teacher-application.dto';
import { UpdateMeDto } from './dto/update-profile.dto';
import { WaitlistDto } from './dto/waitlist.dto';
import { UsersService } from './users.service';
import { RequestWithTenant } from '../../tenant/tenant.middleware';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Public()
  @Post('waitlist')
  async waitlist(@Req() req: Request & RequestWithTenant, @Body() body: WaitlistDto) {
    if (!req.tenantId) throw new Error('Tenant não resolvido');
    return this.users.addToWaitlist({ tenantId: req.tenantId, email: body.email, name: body.name });
  }

  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    return this.users.findById(user.tenantId, user.userId);
  }

  @Get('me/waitlists')
  async myWaitlists(@CurrentUser() user: AuthUser) {
    return this.users.listMemberWaitlists({ tenantId: user.tenantId, userId: user.userId });
  }

  @Patch('me')
  async updateMe(@CurrentUser() user: AuthUser, @Body() body: UpdateMeDto) {
    return this.users.updateMe({ tenantId: user.tenantId, userId: user.userId, name: body.name });
  }

  @Post('me/waitlists')
  async joinWaitlist(@CurrentUser() user: AuthUser, @Body() body: MemberWaitlistDto) {
    return this.users.joinMemberWaitlist({ tenantId: user.tenantId, userId: user.userId, topic: body.topic });
  }

  @Post('me/teacher-application')
  async createTeacherApplication(@CurrentUser() user: AuthUser, @Body() body: TeacherApplicationDto) {
    return this.users.createTeacherApplication({
      tenantId: user.tenantId,
      userId: user.userId,
      name: body.name,
      city: body.city,
      technique: body.technique,
      experience: body.experience,
      whatsapp: body.whatsapp,
    });
  }
}

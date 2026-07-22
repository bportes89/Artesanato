import { Injectable } from '@nestjs/common';
import { WaitlistTopic } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private userSelect = {
    id: true,
    tenantId: true,
    email: true,
    name: true,
    status: true,
    createdAt: true,
    roles: {
      select: {
        role: {
          select: {
            key: true,
            name: true,
          },
        },
      },
    },
    memberWaitlists: {
      select: {
        topic: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc' as const,
      },
    },
  } as const;

  private mapUser(user: {
    id: string;
    tenantId: string;
    email: string;
    name: string | null;
    status: unknown;
    createdAt: Date;
    roles: Array<{ role: { key: string; name: string } }>;
    memberWaitlists: Array<{ topic: WaitlistTopic; createdAt: Date }>;
  }) {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      status: String(user.status),
      createdAt: user.createdAt,
      roles: user.roles.map((item) => item.role),
      waitlists: user.memberWaitlists,
    };
  }

  async findByEmail(tenantId: string, email: string) {
    return this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: email.toLowerCase() } },
      include: { credential: true },
    });
  }

  async findById(tenantId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { tenantId, id: userId },
      select: this.userSelect,
    });
    return user ? this.mapUser(user) : null;
  }

  async updateMe(params: { tenantId: string; userId: string; name?: string }) {
    const user = await this.prisma.user.update({
      where: { id: params.userId },
      data: { name: params.name ?? undefined },
      select: this.userSelect,
    });
    return this.mapUser(user);
  }

  async addToWaitlist(params: { tenantId: string; email: string; name?: string }) {
    const email = params.email.toLowerCase();
    const existing = await this.prisma.waitlistSubscriber.findUnique({
      where: { tenantId_email: { tenantId: params.tenantId, email } },
      select: { id: true },
    });

    if (!existing) {
      await this.prisma.waitlistSubscriber.create({
        data: { tenantId: params.tenantId, email, name: params.name ?? null },
        select: { id: true },
      });
      await this.prisma.outboxEvent.create({
        data: { tenantId: params.tenantId, topic: 'waitlist.subscribed', payload: { email, name: params.name ?? null } },
        select: { id: true },
      });
      return { ok: true };
    }

    await this.prisma.waitlistSubscriber.update({
      where: { id: existing.id },
      data: { name: params.name ?? undefined },
      select: { id: true },
    });
    return { ok: true };
  }

  async listMemberWaitlists(params: { tenantId: string; userId: string }) {
    return this.prisma.memberWaitlistEntry.findMany({
      where: { tenantId: params.tenantId, userId: params.userId },
      select: { topic: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async joinMemberWaitlist(params: { tenantId: string; userId: string; topic: WaitlistTopic }) {
    const existing = await this.prisma.memberWaitlistEntry.findUnique({
      where: {
        tenantId_userId_topic: {
          tenantId: params.tenantId,
          userId: params.userId,
          topic: params.topic,
        },
      },
      select: { id: true },
    });

    if (!existing) {
      await this.prisma.memberWaitlistEntry.create({
        data: {
          tenantId: params.tenantId,
          userId: params.userId,
          topic: params.topic,
        },
        select: { id: true },
      });
      await this.prisma.outboxEvent.create({
        data: {
          tenantId: params.tenantId,
          topic: 'member_waitlist.subscribed',
          payload: {
            userId: params.userId,
            topic: params.topic,
          },
        },
        select: { id: true },
      });
    }

    return {
      ok: true,
      alreadyJoined: Boolean(existing),
      waitlists: await this.listMemberWaitlists(params),
    };
  }

  async createTeacherApplication(params: {
    tenantId: string;
    userId: string;
    name: string;
    city: string;
    technique: string;
    experience: string;
    whatsapp: string;
  }) {
    const application = await this.prisma.teacherApplication.create({
      data: {
        tenantId: params.tenantId,
        userId: params.userId,
        name: params.name,
        city: params.city,
        technique: params.technique,
        experience: params.experience,
        whatsapp: params.whatsapp,
      },
      select: {
        id: true,
        name: true,
        city: true,
        technique: true,
        experience: true,
        whatsapp: true,
        status: true,
        createdAt: true,
      },
    });

    await this.prisma.outboxEvent.create({
      data: {
        tenantId: params.tenantId,
        topic: 'teacher_application.created',
        payload: {
          userId: params.userId,
          applicationId: application.id,
          technique: params.technique,
        },
      },
      select: { id: true },
    });

    return application;
  }

  async createUser(params: { tenantId: string; email: string; name?: string; phone?: string; passwordHash: string }) {
    return this.prisma.user.create({
      data: {
        tenantId: params.tenantId,
        email: params.email.toLowerCase(),
        name: params.name ?? null,
        phone: params.phone ?? null,
        credential: { create: { passwordHash: params.passwordHash } },
        onboarding: { create: { tenantId: params.tenantId } },
      },
      select: { id: true, tenantId: true, email: true, name: true },
    });
  }
}

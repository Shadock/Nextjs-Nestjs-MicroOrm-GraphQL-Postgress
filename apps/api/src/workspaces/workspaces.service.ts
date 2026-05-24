import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Workspace } from './entities/workspace.entity';
import { User } from '../users/entities/user.entity';
import { WorkspaceMember, WorkspaceRole } from './entities/workspace-member.entity';

@Injectable()
export class WorkspacesService {
  constructor(private readonly em: EntityManager) {}

  async create(name: string, userId: number) {
    const user = await this.em.findOne(User, { id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const workspace = this.em.create(Workspace, {
      name,
      owner: user,
    });

    await this.em.persistAndFlush(workspace);
    
    const member = this.em.create(WorkspaceMember, {
      user,
      workspace,
      role: WorkspaceRole.ADMIN,
    });

    await this.em.persistAndFlush(member);

    return workspace;
  }

  async findAllByUser(userId: number) {
    return this.em.find(Workspace, { owner: userId }, { populate: ['owner'] });
  }

  async addMember(workspaceId: number, userId: number) {
    const workspace = await this.em.findOne(Workspace, { id: workspaceId });
    if (!workspace) throw new Error('Workspace not found');

    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new Error('User not found');

    const existing = await this.em.findOne(WorkspaceMember, {
      workspace,
      user,
    });

    if (existing) throw new Error('User already member');

    const member = this.em.create(WorkspaceMember, {
      workspace,
      user,
      role: WorkspaceRole.MEMBER,
    });

    await this.em.persistAndFlush(member);
    return true;
}

  async getMembers(workspaceId: number) {
    return this.em.find(
      WorkspaceMember,
      { workspace: workspaceId },
      {
        populate: ['user'],
      },
    );
  }

  async makeAdmin(
    workspaceId: number,
    userId: number,
    currentUserId: number,
  ) {
    const requester = await this.em.findOne(WorkspaceMember, {
      workspace: workspaceId,
      user: currentUserId,
    });

    if (!requester) throw new Error('Not a member');

    if (requester.role !== WorkspaceRole.ADMIN) {
      throw new Error('Only admin can assign roles');
    }

    const member = await this.em.findOne(WorkspaceMember, {
      workspace: workspaceId,
      user: userId,
    });

    if (!member) {
      throw new Error('User is not a member');
    }

    member.role = WorkspaceRole.ADMIN;

    await this.em.flush();
    return true;
  }
}
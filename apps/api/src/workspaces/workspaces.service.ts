import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Workspace } from './entities/workspace.entity';
import { User, UserRole } from '../users/entities/user.entity';
import {
  WorkspaceMember,
  WorkspaceRole,
} from './entities/workspace-member.entity';

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

  /** Returns all workspaces where the user is a member (any role). */
  async findAllByUser(userId: number): Promise<Workspace[]> {
    const memberships = await this.em.find(
      WorkspaceMember,
      { user: userId },
      { populate: ['workspace', 'workspace.owner'] },
    );
    return memberships.map((m) => m.workspace);
  }

  /** Returns WorkspaceMember records for the current user, with workspace + role. */
  async findMembershipsByUser(userId: number): Promise<WorkspaceMember[]> {
    return this.em.find(
      WorkspaceMember,
      { user: userId },
      { populate: ['workspace', 'workspace.owner'] },
    );
  }

  async addMember(
    workspaceId: number,
    userId: number,
    requesterId: number,
    requesterRole: UserRole,
  ) {
    const workspace = await this.em.findOne(Workspace, { id: workspaceId });
    if (!workspace) throw new Error('Workspace not found');

    // Only workspace ADMIN or GLOBAL_ADMIN can invite
    if (requesterRole !== UserRole.GLOBAL_ADMIN) {
      const requesterMembership = await this.em.findOne(WorkspaceMember, {
        workspace: workspaceId,
        user: requesterId,
      });
      if (
        !requesterMembership ||
        requesterMembership.role !== WorkspaceRole.ADMIN
      ) {
        throw new Error('Only workspace admin can invite members');
      }
    }

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

  async addMemberByEmail(
    workspaceId: number,
    email: string,
    requesterId: number,
    requesterRole: UserRole,
  ) {
    const user = await this.em.findOne(User, { email });
    if (!user) throw new Error('User not found');
    return this.addMember(workspaceId, user.id, requesterId, requesterRole);
  }

  async getMembers(
    workspaceId: number,
    requesterId: number,
    requesterRole: UserRole,
  ) {
    if (requesterRole !== UserRole.GLOBAL_ADMIN) {
      const membership = await this.em.findOne(WorkspaceMember, {
        workspace: workspaceId,
        user: requesterId,
      });
      if (!membership) throw new Error('Access denied');
    }

    return this.em.find(
      WorkspaceMember,
      { workspace: workspaceId },
      { populate: ['user'] },
    );
  }

  async makeAdmin(
    workspaceId: number,
    userId: number,
    currentUserId: number,
    currentUserRole: UserRole,
  ) {
    if (currentUserRole !== UserRole.GLOBAL_ADMIN) {
      const requester = await this.em.findOne(WorkspaceMember, {
        workspace: workspaceId,
        user: currentUserId,
      });

      if (!requester) throw new Error('Not a member');
      if (requester.role !== WorkspaceRole.ADMIN) {
        throw new Error('Only admin can assign roles');
      }
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

  // ─── Global admin operations ─────────────────────────────────────────────

  async findAll(): Promise<Workspace[]> {
    return this.em.find(Workspace, {}, { populate: ['owner'] });
  }

  async findAllUsers(): Promise<User[]> {
    return this.em.find(User, {});
  }

  async assignWorkspaceToUser(workspaceId: number, userId: number) {
    const workspace = await this.em.findOne(Workspace, { id: workspaceId });
    if (!workspace) throw new Error('Workspace not found');

    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new Error('User not found');

    const existing = await this.em.findOne(WorkspaceMember, {
      workspace,
      user,
    });
    if (existing) return true; // already assigned

    const member = this.em.create(WorkspaceMember, {
      workspace,
      user,
      role: WorkspaceRole.MEMBER,
    });

    await this.em.persistAndFlush(member);
    return true;
  }

  async deleteWorkspace(workspaceId: number) {
    const workspace = await this.em.findOne(Workspace, { id: workspaceId });
    if (!workspace) throw new Error('Workspace not found');

    // Remove all members first
    const members = await this.em.find(WorkspaceMember, {
      workspace: workspaceId,
    });
    for (const m of members) {
      this.em.remove(m);
    }

    this.em.remove(workspace);
    await this.em.flush();
    return true;
  }
}

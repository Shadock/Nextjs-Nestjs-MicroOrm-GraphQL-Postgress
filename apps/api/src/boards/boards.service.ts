import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Board } from './entities/board.entity';
import { Workspace } from '../workspaces/entities/workspace.entity';
import {
  WorkspaceMember,
  WorkspaceRole,
} from '../workspaces/entities/workspace-member.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(private readonly em: EntityManager) {}

  async create(title: string, workspaceId: number, userId: number) {
    const membership = await this.em.findOne(WorkspaceMember, {
      workspace: workspaceId,
      user: userId,
    });

    if (!membership) {
      throw new Error('Not a member of workspace');
    }

    if (membership.role !== WorkspaceRole.ADMIN) {
      throw new Error('Only admin can create boards');
    }

    const workspace = await this.em.findOne(Workspace, { id: workspaceId });

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const board = this.em.create(Board, {
      title,
      workspace,
    });

    await this.em.persistAndFlush(board);
    return board;
  }

  async findByWorkspace(
    workspaceId: number,
    userId: number,
    userRole: UserRole,
  ) {
    if (userRole !== UserRole.GLOBAL_ADMIN) {
      const membership = await this.em.findOne(WorkspaceMember, {
        workspace: workspaceId,
        user: userId,
      });
      if (!membership) throw new Error('Access denied');
    }

    return this.em.find(
      Board,
      { workspace: workspaceId },
      { populate: ['workspace.owner'] },
    );
  }
}

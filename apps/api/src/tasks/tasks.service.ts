import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Task } from './entities/task.entity';
import { Board } from '../boards/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from './entities/task.entity';
import { WorkspaceMember } from '../workspaces/entities/workspace-member.entity';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly em: EntityManager) {}

  private async assertWorkspaceMember(
    boardId: number,
    userId: number,
    userRole: UserRole,
  ) {
    if (userRole === UserRole.GLOBAL_ADMIN) return;

    const board = await this.em.findOne(
      Board,
      { id: boardId },
      { populate: ['workspace'] },
    );
    if (!board) throw new Error('Board not found');

    const membership = await this.em.findOne(WorkspaceMember, {
      workspace: (board.workspace as any).id ?? board.workspace,
      user: userId,
    });
    if (!membership) throw new Error('Access denied');
  }

  private async assertWorkspaceMemberByTask(
    taskId: number,
    userId: number,
    userRole: UserRole,
  ) {
    if (userRole === UserRole.GLOBAL_ADMIN) return;

    const task = await this.em.findOne(
      Task,
      { id: taskId },
      { populate: ['board', 'board.workspace'] },
    );
    if (!task) throw new Error('Task not found');

    const workspaceId =
      (task.board as any).workspace?.id ?? (task.board as any).workspace;
    const membership = await this.em.findOne(WorkspaceMember, {
      workspace: workspaceId,
      user: userId,
    });
    if (!membership) throw new Error('Access denied');
  }

  async create(
    title: string,
    description: string,
    boardId: number,
    userId: number,
    userRole: UserRole,
  ) {
    await this.assertWorkspaceMember(boardId, userId, userRole);

    const board = await this.em.findOne(Board, { id: boardId });
    if (!board) throw new Error('Board not found');

    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new Error('User not found');

    const count = await this.em.count(Task, { board: boardId });

    const task = this.em.create(Task, {
      title,
      description,
      board,
      assignee: user,
      order: count,
      status: TaskStatus.TODO,
    });

    await this.em.persistAndFlush(task);
    return task;
  }

  async findByBoard(boardId: number, userId: number, userRole: UserRole) {
    await this.assertWorkspaceMember(boardId, userId, userRole);

    return this.em.find(
      Task,
      { board: boardId },
      {
        populate: ['board', 'assignee'],
        orderBy: { order: 'ASC' },
      },
    );
  }

  async updateStatus(
    taskId: number,
    status: TaskStatus,
    userId: number,
    userRole: UserRole,
  ) {
    await this.assertWorkspaceMemberByTask(taskId, userId, userRole);

    const task = await this.em.findOne(Task, { id: taskId });
    if (!task) throw new Error('Task not found');

    task.status = status;
    await this.em.flush();
    return task;
  }

  async reorder(
    taskId: number,
    newOrder: number,
    userId: number,
    userRole: UserRole,
  ) {
    await this.assertWorkspaceMemberByTask(taskId, userId, userRole);

    const task = await this.em.findOne(Task, { id: taskId });
    if (!task) throw new Error('Task not found');

    task.order = newOrder;
    await this.em.flush();
    return true;
  }

  async moveTask(
    taskId: number,
    status: TaskStatus,
    order: number,
    userId: number,
    userRole: UserRole,
  ) {
    await this.assertWorkspaceMemberByTask(taskId, userId, userRole);

    const task = await this.em.findOne(Task, { id: taskId });
    if (!task) throw new Error('Task not found');

    task.status = status;
    task.order = order;
    await this.em.flush();
    return task;
  }
}

import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Comment } from './entities/comment.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(private readonly em: EntityManager) {}

  async create(content: string, taskId: number, userId: number) {
    const task = await this.em.findOne(Task, { id: taskId });
    if (!task) throw new Error('Task not found');

    const user = await this.em.findOne(User, { id: userId });
    if (!user) throw new Error('User not found');

    const comment = this.em.create(Comment, {
      content,
      task: task!,
      author: user!,
    });

    await this.em.persistAndFlush(comment);
    return comment;
  }

  async findByTask(taskId: number) {
    return this.em.find(
      Comment,
      { task: taskId },
      {
        populate: ['author', 'task'],
        orderBy: { createdAt: 'ASC' },
      }
    );
  }
}

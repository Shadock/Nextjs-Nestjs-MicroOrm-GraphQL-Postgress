import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './entities/task.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Task)
  createTask(
    @Args('title') title: string,
    @Args('description') description: string,
    @Args('boardId') boardId: number,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(
      title,
      description,
      boardId,
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Task])
  tasks(@Args('boardId') boardId: number) {
    return this.tasksService.findByBoard(boardId);
  }

  
@UseGuards(JwtAuthGuard)
@Mutation(() => Task)
updateTaskStatus(
  @Args('taskId') taskId: number,
  @Args('status', { type: () => TaskStatus }) status: TaskStatus,
) {
  return this.tasksService.updateStatus(taskId, status);
}
@UseGuards(JwtAuthGuard)
@Mutation(() => Boolean)
reorderTasks(
  @Args('taskId') taskId: number,
  @Args('newOrder') newOrder: number,
) {
  return this.tasksService.reorder(taskId, newOrder);
}

@UseGuards(JwtAuthGuard)
@Mutation(() => Task)
moveTask(
  @Args('taskId') taskId: number,
  @Args('status', { type: () => TaskStatus }) status: TaskStatus,
  @Args('order') order: number,
) {
  return this.tasksService.moveTask(taskId, status, order);
}
}

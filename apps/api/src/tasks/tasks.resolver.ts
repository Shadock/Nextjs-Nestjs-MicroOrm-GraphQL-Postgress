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
    @Args('description', { nullable: true, defaultValue: '' })
    description: string,
    @Args('boardId') boardId: number,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.create(
      title,
      description,
      boardId,
      user.userId,
      user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Task])
  tasks(@Args('boardId') boardId: number, @CurrentUser() user: any) {
    return this.tasksService.findByBoard(boardId, user.userId, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Task)
  updateTaskStatus(
    @Args('taskId') taskId: number,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateStatus(
      taskId,
      status,
      user.userId,
      user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  reorderTasks(
    @Args('taskId') taskId: number,
    @Args('newOrder') newOrder: number,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.reorder(taskId, newOrder, user.userId, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Task)
  moveTask(
    @Args('taskId') taskId: number,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
    @Args('order') order: number,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.moveTask(
      taskId,
      status,
      order,
      user.userId,
      user.role,
    );
  }
}

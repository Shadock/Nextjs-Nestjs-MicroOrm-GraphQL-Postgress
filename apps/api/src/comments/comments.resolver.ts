import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  // ✅ CREATE COMMENT
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('content') content: string,
    @Args('taskId') taskId: number,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.create(content, taskId, user.userId);
  }

  // ✅ GET COMMENTS BY TASK
  @UseGuards(JwtAuthGuard)
  @Query(() => [Comment])
  comments(@Args('taskId') taskId: number) {
    return this.commentsService.findByTask(taskId);
  }
}

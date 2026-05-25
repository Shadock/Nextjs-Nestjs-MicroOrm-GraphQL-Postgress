import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { Board } from './entities/board.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Board)
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Board)
  createBoard(
    @Args('title') title: string,
    @Args('workspaceId') workspaceId: number,
    @CurrentUser() user: any,
  ) {
    return this.boardsService.create(title, workspaceId, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Board])
  boards(@Args('workspaceId') workspaceId: number, @CurrentUser() user: any) {
    return this.boardsService.findByWorkspace(
      workspaceId,
      user.userId,
      user.role,
    );
  }
}

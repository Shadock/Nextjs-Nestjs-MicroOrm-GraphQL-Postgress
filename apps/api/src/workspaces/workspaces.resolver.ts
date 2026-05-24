import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { WorkspaceMember } from './entities/workspace-member.entity';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Workspace)
  createWorkspace(
    @Args('name') name: string,
    @CurrentUser() user: any,
  ) {
    return this.workspacesService.create(name, user.userId);
  }
  

  @UseGuards(JwtAuthGuard)
  @Query(() => [Workspace])
  workspaces(@CurrentUser() user: any) {
    return this.workspacesService.findAllByUser(user.userId);
  }

  
@UseGuards(JwtAuthGuard)
@Mutation(() => Boolean)
inviteUserToWorkspace(
  @Args('workspaceId') workspaceId: number,
  @Args('userId') userId: number,
) {
  return this.workspacesService.addMember(workspaceId, userId);
}

@UseGuards(JwtAuthGuard)
@Query(() => [WorkspaceMember])
members(@Args('workspaceId') workspaceId: number) {
  return this.workspacesService.getMembers(workspaceId);
}

@UseGuards(JwtAuthGuard)
@Mutation(() => Boolean)
makeAdmin(
  @Args('workspaceId') workspaceId: number,
  @Args('userId') userId: number,
  @CurrentUser() currentUser: any,
) {
  return this.workspacesService.makeAdmin(
    workspaceId,
    userId,
    currentUser.userId,
  );
}
}

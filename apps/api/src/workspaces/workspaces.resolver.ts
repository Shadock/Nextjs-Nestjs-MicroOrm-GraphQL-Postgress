import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './entities/workspace.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GlobalAdminGuard } from '../auth/global-admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { WorkspaceMember } from './entities/workspace-member.entity';
import { User } from '../users/entities/user.entity';

@Resolver(() => Workspace)
export class WorkspacesResolver {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Workspace)
  createWorkspace(@Args('name') name: string, @CurrentUser() user: any) {
    return this.workspacesService.create(name, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Workspace])
  workspaces(@CurrentUser() user: any) {
    return this.workspacesService.findAllByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [WorkspaceMember])
  myWorkspaceMemberships(@CurrentUser() user: any) {
    return this.workspacesService.findMembershipsByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  inviteUserToWorkspace(
    @Args('workspaceId') workspaceId: number,
    @Args('userId') userId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.workspacesService.addMember(
      workspaceId,
      userId,
      currentUser.userId,
      currentUser.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  inviteToWorkspaceByEmail(
    @Args('workspaceId') workspaceId: number,
    @Args('email') email: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.workspacesService.addMemberByEmail(
      workspaceId,
      email,
      currentUser.userId,
      currentUser.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [WorkspaceMember])
  members(
    @Args('workspaceId') workspaceId: number,
    @CurrentUser() currentUser: any,
  ) {
    return this.workspacesService.getMembers(
      workspaceId,
      currentUser.userId,
      currentUser.role,
    );
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
      currentUser.role,
    );
  }

  // ─── Global admin endpoints ─────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, GlobalAdminGuard)
  @Query(() => [Workspace])
  allWorkspaces() {
    return this.workspacesService.findAll();
  }

  @UseGuards(JwtAuthGuard, GlobalAdminGuard)
  @Query(() => [User])
  allUsers() {
    return this.workspacesService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, GlobalAdminGuard)
  @Mutation(() => Boolean)
  assignWorkspaceToUser(
    @Args('workspaceId') workspaceId: number,
    @Args('userId') userId: number,
  ) {
    return this.workspacesService.assignWorkspaceToUser(workspaceId, userId);
  }

  @UseGuards(JwtAuthGuard, GlobalAdminGuard)
  @Mutation(() => Boolean)
  deleteWorkspace(@Args('workspaceId') workspaceId: number) {
    return this.workspacesService.deleteWorkspace(workspaceId);
  }
}

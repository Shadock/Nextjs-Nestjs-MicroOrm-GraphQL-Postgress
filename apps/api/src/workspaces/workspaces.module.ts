import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesResolver } from './workspaces.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Workspace, WorkspaceMember])],
  providers: [WorkspacesResolver, WorkspacesService],
})
export class WorkspacesModule {}

import { Entity, PrimaryKey, ManyToOne, Enum } from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Workspace } from './workspace.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum WorkspaceRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

registerEnumType(WorkspaceRole, {
  name: 'WorkspaceRole',
});

@ObjectType()
@Entity()
export class WorkspaceMember {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  workspace!: Workspace;

  @Field(() => WorkspaceRole)
  @Enum(() => WorkspaceRole)
  role: WorkspaceRole = WorkspaceRole.MEMBER;
}

import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@ObjectType()
@Entity()
export class Board {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

  @Field(() => Workspace)
  @ManyToOne(() => Workspace)
  workspace!: Workspace;
}

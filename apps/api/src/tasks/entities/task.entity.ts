import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
  WAITING = 'WAITING',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

@ObjectType()
@Entity()
export class Task {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  title!: string;

  @Field()
  @Property()
  description!: string;

  @Field(() => TaskStatus)
  @Enum(() => TaskStatus)
  status: TaskStatus = TaskStatus.TODO;

  @Field(() => Int)
  @Property({ default: 0 })
  order!: number;

  @Field(() => Board)
  @ManyToOne(() => Board)
  board!: Board;

  @Field(() => User)
  @ManyToOne(() => User)
  assignee!: User;
}

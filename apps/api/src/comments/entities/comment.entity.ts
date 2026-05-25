import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property()
  content!: string;

  @Field(() => Task)
  @ManyToOne(() => Task)
  task!: Task;

  @Field(() => User)
  @ManyToOne(() => User)
  author!: User;

  @Field(() => Date)
  @Property({
    onCreate: () => new Date(),
    nullable: true,
  })
  createdAt?: Date;
}

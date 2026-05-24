import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {

  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Field(() => Date)
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}
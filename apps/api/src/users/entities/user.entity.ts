import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'USER',
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ unique: true })
  email!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  username?: string;

  @Property()
  password!: string;

  @Field(() => UserRole)
  @Enum(() => UserRole)
  role: UserRole = UserRole.USER;

  @Field(() => Date)
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();
}

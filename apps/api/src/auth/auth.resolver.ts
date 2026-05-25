import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { EntityManager } from '@mikro-orm/core';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly entityManager: EntityManager,
  ) {}

  @Mutation(() => User)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('username', { nullable: true }) username?: string,
  ) {
    return this.authService.register(email, password, username);
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const result = await this.authService.login(email, password);
    return result.access_token;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async me(@CurrentUser() user: any) {
    return this.entityManager.findOne(User, { id: user.userId });
  }
}

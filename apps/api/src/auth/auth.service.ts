import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager, private readonly jwtService: JwtService) {}

  async register(email: string, password: string, username?: string): Promise<User> {
    const existingUser = await this.em.findOne(User, { email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // First registered user becomes GLOBAL_ADMIN
    const userCount = await this.em.count(User, {});
    const role = userCount === 0 ? UserRole.GLOBAL_ADMIN : UserRole.USER;

    const user = this.em.create(User, {
      email,
      password: hashedPassword,
      username: username ?? email.split('@')[0],
      role,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(user);

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.em.findOne(User, { email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
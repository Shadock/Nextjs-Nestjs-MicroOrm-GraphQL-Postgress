import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager, private readonly jwtService: JwtService) {}

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.em.findOne(User, { email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.em.create(User, {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(user);

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.em.findOne(User, { email });

    if (!user) {
      // REVIEW: message différent de "Invalid password" => user enumeration possible.
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error('Invalid password');
    }

    const payload = { userId: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
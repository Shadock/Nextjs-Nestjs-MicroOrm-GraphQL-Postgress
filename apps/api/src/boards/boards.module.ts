import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Board } from './entities/board.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Board])],
  providers: [BoardsResolver, BoardsService],
})
export class BoardsModule {}

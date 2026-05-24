import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Comment])],
  providers: [CommentsService, CommentsResolver],
})
export class CommentsModule {}

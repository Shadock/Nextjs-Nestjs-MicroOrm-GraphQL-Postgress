import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task } from './entities/task.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Task])],
  providers: [TasksResolver, TasksService],
})
export class TasksModule {}

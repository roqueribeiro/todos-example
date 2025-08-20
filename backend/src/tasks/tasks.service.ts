import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    const entity = this.repo.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });
    return this.repo.save(entity);
  }

  async findAll(query: QueryTasksDto) {
    const qb = this.repo.createQueryBuilder('t');

    if (query.status) qb.andWhere('t.status = :status', { status: query.status });
    if (query.priority) qb.andWhere('t.priority = :priority', { priority: query.priority });
    if (query.search) {
      qb.andWhere('(t.title ILIKE :q OR t.description ILIKE :q)', { q: `%${query.search}%` });
    }

    const page = parseInt(query.page || '1', 10);
    const limit = Math.min(parseInt(query.limit || '10', 10), 100);
    const offset = (page - 1) * limit;

    if (query.sort) {
      const [field, dir] = query.sort.split(':');
      const valid = ['dueDate', 'createdAt'];
      if (valid.includes(field)) {
        qb.orderBy(`t.${field}`, (dir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC');
      }
    } else {
      qb.orderBy('t.dueDate', 'ASC');
    }

    const [items, total] = await qb.skip(offset).take(limit).getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : task.dueDate });
    return this.repo.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.repo.remove(task);
    return { deleted: true };
  }
}

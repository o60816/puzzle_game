import { Inject, Injectable } from '@nestjs/common';
import { FindOptionsOrderValue, Repository } from 'typeorm';
import { UsersEntity } from '../../model/repositories/users/users.entity';
import { ProblemsEntity } from 'src/model/repositories/problems/problems.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<UsersEntity>,
    @Inject('PROBLEM_REPOSITORY')
    private problemsRepository: Repository<ProblemsEntity>,
  ) {}

  async findAll(order: {
    created_at?: FindOptionsOrderValue;
    updated_at?: FindOptionsOrderValue;
  }): Promise<UsersEntity[]> {
    return this.usersRepository.find({
      select: ['image', 'name', 'chapter', 'created_at', 'updated_at'],
      order,
    });
  }
}

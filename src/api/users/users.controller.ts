import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll({
      created_at: 'ASC',
    });
  }

  @Get('ranking')
  async getUserRanking() {
    return this.usersService.findAll({
      updated_at: 'ASC',
    });
  }
}

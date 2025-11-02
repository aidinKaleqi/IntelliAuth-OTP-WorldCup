import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './model/repository/user.repository';
import { UserEntity } from './model/entity/user.entity';
import { RoleEntity } from './model/entity/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findByPhone(phone: string): Promise<UserEntity> {
    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async createUser(phone: string, roles: RoleEntity[] = []): Promise<UserEntity> {
    return await this.userRepository.createUser(phone, roles);
  }

}
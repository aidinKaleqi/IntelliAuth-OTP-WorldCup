import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseRepository } from '../../../../app/model/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { RoleEntity } from '../entity/role.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  private getRepo(manager?: EntityManager): Repository<UserEntity> {
    return manager ? manager.getRepository(UserEntity) : this;
  }

  async findByPhone(phone: string, transactionalManager?: EntityManager): Promise<UserEntity | null> {
    const repo = this.getRepo(transactionalManager);
    return await repo.findOne({ where: { phone } });
  }

  async createUser(
    phone: string,
    roles: RoleEntity[] = [],
    transactionalManager?: EntityManager,
  ): Promise<UserEntity> {
    const repo = this.getRepo(transactionalManager);
    const user = repo.create({ phone, roles });
    return await repo.save(user);
  }
}
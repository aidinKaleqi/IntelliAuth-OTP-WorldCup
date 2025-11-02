import { BaseRepository } from '../../../../app/model/repository/base.repository';
import { SessionEntity } from '../entity/session.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class SessionRepository extends BaseRepository<SessionEntity> {
  constructor(dataSource: DataSource) {
    super(SessionEntity, dataSource.createEntityManager());
  }

  private getRepo(manager?: EntityManager): Repository<SessionEntity> {
    return manager ? manager.getRepository(SessionEntity) : this;
  }

  async findByUserId(userId: string, manager?:EntityManager): Promise<SessionEntity[]> {
    const repo = this.getRepo(manager);
    return await repo.find({ where: { user_id: userId } });
  }

  async findByTokenHash(tokenHash: string, manager?:EntityManager): Promise<SessionEntity | null> {
    const repo = this.getRepo(manager);
    return await repo.findOne({ where: { token_hash: tokenHash } });
  }
}
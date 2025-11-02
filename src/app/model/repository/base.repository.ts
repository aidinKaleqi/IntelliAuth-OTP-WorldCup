import { Injectable, Logger } from '@nestjs/common';
import { DeepPartial, EntityManager, ObjectLiteral, Repository } from 'typeorm';

@Injectable()
export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  private readonly logger = new Logger(BaseRepository.name);

  async updateEntityById(id: string, updatedData: DeepPartial<T>, entityManager?: EntityManager): Promise<T> {
    const entity = entityManager
      ? await entityManager.getRepository<T>(this.target).findOneBy({ id } as any)
      : await this.findOneBy({ id } as any);


    if (entity) {
      (Object.keys(updatedData as any) as (keyof T)[]).forEach((key) => {
        if ((updatedData as any)[key] !== undefined) {
          (entity as any)[key] = (updatedData as any)[key];
        }
      });
      return entityManager ? entityManager.save(entity) : this.save(entity);
    } else {
      throw new Error(`Entity with ID ${id} not found`);
    }
  }
}

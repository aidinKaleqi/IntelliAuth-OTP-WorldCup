import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';

@Entity({
  name: 'team',
  schema: 'prediction',
})
export class TeamEntity extends BaseEntity{
  @Column()
  fa_name: string;

  @Column()
  eng_name: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ nullable: true })
  group: string;

  @Column()
  flag: string;
}
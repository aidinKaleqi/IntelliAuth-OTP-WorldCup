import { Entity, Column, CreateDateColumn } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';

@Entity({
  name: 'session',
  schema: 'auth',
})
export class SessionEntity extends BaseEntity {
  @Column('uuid')
  user_id: string;

  @Column()
  token_hash: string; 

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expires_at: Date;
}
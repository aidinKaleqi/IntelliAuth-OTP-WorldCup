import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';
import { Role } from './role.entity';

@Entity({
  name: 'user',
  schema: 'user'
})
export class User extends BaseEntity {

  @Column({ unique: true })
  phone: string;

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
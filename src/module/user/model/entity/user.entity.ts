import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';
import { RoleEntity } from './role.entity';

@Entity({
  name: 'user',
  schema: 'user'
})
export class UserEntity extends BaseEntity {

  @Column({ unique: true })
  phone: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  roles: RoleEntity[];
}
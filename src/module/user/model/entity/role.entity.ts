import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'role',
  schema: 'user'
})
export class RoleEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: UserEntity[];
}
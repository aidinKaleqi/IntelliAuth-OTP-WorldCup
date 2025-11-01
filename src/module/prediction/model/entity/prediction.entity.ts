import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';


@Entity({
  name: 'prediction',
  schema: 'prediction',
})
@Index(['predict'], { fulltext: false }) 
export class Prediction extends BaseEntity{
  @Column('uuid')
  user_id: string;

  @Column('jsonb')
  @Index({ where: "predict -> 'groups' IS NOT NULL", type: 'gin' }) 
  predict: any; 
}
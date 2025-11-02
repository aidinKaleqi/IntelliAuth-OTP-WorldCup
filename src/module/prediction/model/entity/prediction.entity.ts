import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';

@Entity({
  name: 'prediction',
  schema: 'prediction',
})
@Index('prediction_predict_fulltext_idx', ['predict'], { fulltext: false })
@Index('prediction_predict_gin_idx', ['predict'], { where: "predict -> 'groups' IS NOT NULL", using: 'GIN' })
export class PredictionEntity extends BaseEntity{
  @Column('uuid')
  user_id: string;

  @Column('jsonb')
  predict: any;
}
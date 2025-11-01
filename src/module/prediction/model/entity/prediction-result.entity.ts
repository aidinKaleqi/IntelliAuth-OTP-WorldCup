import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../../../app/model/entity/base.entity';

@Entity({
  name: 'prediction_result',
  schema: 'prediction',
})
export class PredictionResult extends BaseEntity {
  @Column('uuid')
  prediction_id: string;

  @Column('uuid')
  user_id: string;

  @Column('int')
  total_score: number;

  @Column('jsonb')
  details: any;

  @Column({ type: 'timestamptz' })
  processed_at: Date;
}
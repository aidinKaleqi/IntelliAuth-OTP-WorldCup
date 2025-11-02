import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionEntity } from './model/entity/prediction.entity';
import { PredictionResult } from './model/entity/prediction-result.entity';
import { TeamEntity } from './model/entity/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PredictionEntity, PredictionResult, TeamEntity])],
  // controllers: [PredictionController],
  // providers: [PredictionService],
  exports: [TypeOrmModule],
})
export class PredictionModule {}

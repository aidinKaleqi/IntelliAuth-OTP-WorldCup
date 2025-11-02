
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './model/repository/user.repository';

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository])],
	providers: [UserService],
	exports: [UserService, TypeOrmModule],
})
export class UserModule {}

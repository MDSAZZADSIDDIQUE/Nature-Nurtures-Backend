import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';

@Module({
  imports: [MemberModule, TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nature_nurtures',
    autoLoadEntities: true,
    synchronize: true,
    } ),
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}

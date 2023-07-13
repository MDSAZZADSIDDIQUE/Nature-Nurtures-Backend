import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { SellerModule } from './Seller/seller.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberEntity } from './member/member.entity';

@Module({
  imports: [MemberModule, SellerModule, TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'nature_nurtures',
    autoLoadEntities: true,
    synchronize: true,
    } ), TypeOrmModule.forFeature([MemberEntity])
    ],
  controllers: [ AppController ],
  providers: [ AppService ],
})
export class AppModule {}

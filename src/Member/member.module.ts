import { Module } from "@nestjs/common";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { MemberEntity } from "./member.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { OrderEntity } from "./order.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity, ProductEntity, OrderEntity])],
    controllers: [MemberController],
    providers: [MemberService],
})

export class MemberModule {}
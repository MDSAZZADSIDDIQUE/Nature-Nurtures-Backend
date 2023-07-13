import { Module } from "@nestjs/common";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { MemberEntity } from "./member.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/Seller/product.entity";
import { SellerEntity } from "src/Seller/seller.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity, ProductEntity, OrderEntity, SellerEntity])],
    controllers: [MemberController],
    providers: [MemberService],
})

export class MemberModule {}
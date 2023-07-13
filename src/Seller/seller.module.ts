import { Module } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { SellerController } from "./seller.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity])],
    controllers: [SellerController],
    providers: [SellerService],
})

export class SellerModule {}
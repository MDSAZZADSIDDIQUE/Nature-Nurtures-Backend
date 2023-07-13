import { Injectable } from "@nestjs/common";
import { productDTO } from "./product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./product.entity";
import { Repository } from "typeorm";

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
    ) {}

    // Add Product
    async addProduct(product: productDTO): Promise<ProductEntity> {
        return this.productRepository.save(product);
    }
}
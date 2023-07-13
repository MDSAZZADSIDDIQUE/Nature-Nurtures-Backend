import { HttpStatus, Injectable, NotFoundException, Session, UnauthorizedException } from "@nestjs/common";
import { EditMemberDTO} from "./member.dto";
import { orderDTO } from "./order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "./member.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.entity";
import { confirmOrderDTO, paymentInformationDTO } from "./payment.dto";
import { ProductEntity } from "src/Seller/product.entity";
import { editProductDTO } from "src/Seller/product.dto";
import { SellerEntity } from "src/Seller/seller.entity";
import { SellerDTO } from "src/Seller/seller.dto";

@Injectable()
export class MemberService{
    constructor(
        @InjectRepository(MemberEntity)
        private memberRepository: Repository<MemberEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        @InjectRepository(SellerEntity)
        private sellerRepository: Repository<MemberEntity>
    ) {}

    // Show Profile Details
    async showProfileDetails(memberID) {
        console.log(memberID);
        return await this.memberRepository.findOneBy({ memberID : memberID });
    }

    // Edit Profile Details
    async editProfileDetails(memberID, query: EditMemberDTO)
    {
        const profileDetails = await this.memberRepository.findOneBy({ memberID : memberID });
        const editKey = query.editKey;
        const editValue = query.editValue;
        let validKey = false;
        for (let key in profileDetails) {
            if (key == editKey) {
                validKey = true;
            }
        }
        if (!validKey) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Property not found"
            })
        }
        profileDetails[editKey] = editValue;
        
        await this.memberRepository.save(profileDetails);
        return ("Update Successful");
    }

    // Shop
    async shop() {
        return await this.productRepository.find();
    }

    async addToCart(customerID, query: editProductDTO, order: orderDTO) {
        const editProduct = query.editProduct;
        const product = await this.productRepository.findOneBy({ productID: editProduct });
        const member = await this.memberRepository.findOneBy(customerID);
        order.customerID = customerID;
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        order.orderDate = `${date}/${month}/${year}`;
        order.orderStatus = "Pending";
        order.products = product.productName;
        order.totalAmount = product.price;
        order.shippingAddress = member.address;
        return this.orderRepository.save(order);
    }

    async cart(memberID) {
        const orders = await this.orderRepository.findBy( { customerID: memberID} );
        return orders;
    }

    async searchOrder(orderID) {
        const order = await this.orderRepository.findOneBy( { orderID: orderID } );
        if (order !== null) {
            return order;
        } else {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Order not found"
            })
        }
    }

    async cancelOrder(orderID) {
        const order = await this.orderRepository.findOneBy( { orderID: orderID } );
        if (order !== null) {
            await this.orderRepository.delete( { orderID: orderID } );
            return "Delete Successful";
        } else {
            throw new UnauthorizedException({
                status: HttpStatus.NOT_FOUND,
                message: "Order not found"
            })
        }
    }

    async confirmOrder(query: confirmOrderDTO, paymentInformation: paymentInformationDTO) {
        const orderID = query.orderID;
        const order = await this.orderRepository.findOneBy( { orderID: orderID } );
        order.orderStatus = "Shipped";
        await this.orderRepository.save(order);
        const now = new Date();
        const date = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        return (`
            Order ID: ${orderID}
            Amount: ${order.totalAmount}
            Currency: ${query.currency}
            Payment Method: ${query.paymentMethod}
            Payment Date: ${date}/${month}/${year}
        `)
    }

    searchPlantFertilizer(plantName: string, listOfPlantsAndTheirRequiredFertilizers: object) {
        for (const key in listOfPlantsAndTheirRequiredFertilizers) {
            if (key == plantName) {
                return (`
                --------------------------------------------------
                Plant Name: ${key}
                Plant Name: ${listOfPlantsAndTheirRequiredFertilizers[key]}
                --------------------------------------------------
                Here are some additional tips for fertilizing your plants:
                ⭐ Apply fertilizer when the soil is moist.
                ⭐ Do not over-fertilize, as this can damage the plants.
                ⭐ Water the plants thoroughly after fertilizing.
                ⭐ Fertilize regularly, according to the instructions on the fertilizer label.
                --------------------------------------------------
                `);
            }
        }
    }
    getNotificationForWater(): string {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        if (hour == 9) {
            return (`
            -------------------
            🌄 GOOD MORNING 🌄
            -------------------
            Time: ${hour}:${minute}:${second}
            -------------------
            🌱 It's time to 
            water your plants 🌱
            -------------------
            `)
        } else if (hour >= 12 && hour < 18) {
            return (`
            --------------------
            ☀️ GOOD AFTERNOON ☀️
            -------------------
            Time: ${hour}:${minute}:${second}
            --------------------
            😇 Don't forget to
            drink water 😇
            --------------------
            `)
        } else {
            return (`
            -----------------
            🌙 GOOD NIGHT 🌙
            -------------------
            Time: ${hour}:${minute}:${second}
            -----------------
            😇 Early to bed,
            Early to rise 😇
            -----------------
            `)
        }
    }

    // Become Seller
    async becomeSeller(memberID, seller: SellerDTO) {
        seller.memberID = memberID;
        return await this.sellerRepository.save(seller);
    }

    // Show Seller Details
    async showSellerDetails(memberID) {
        return await this.sellerRepository.findOneBy({ memberID: memberID });
    }

    // Edit Profile Details
    async editSellerDetails(memberID, query: EditMemberDTO)
    {
        const sellerDetails = await this.sellerRepository.findOneBy({ memberID : memberID });
        const editKey = query.editKey;
        const editValue = query.editValue;
        let validKey = false;
        for (let key in sellerDetails) {
            if (key == editKey) {
                validKey = true;
            }
        }
        if (!validKey) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Property not found"
            })
        }
        sellerDetails[editKey] = editValue;
        
        return await this.sellerRepository.save(sellerDetails);
    }


}
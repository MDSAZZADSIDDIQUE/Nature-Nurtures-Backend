import { HttpStatus, Injectable, NotFoundException, Session, UnauthorizedException } from "@nestjs/common";
import { EditMemberDTO, MemberDTO, userDTO } from "./member.dto";
import { orderDTO } from "./order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "./member.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { promises } from "dns";
import { editProductDTO, productDTO } from "./product.dto";
import { ProductEntity } from "./product.entity";
import { OrderEntity } from "./order.entity";
import { confirmOrderDTO, paymentInformationDTO } from "./payment.dto";

@Injectable()
export class MemberService{
    constructor(
        @InjectRepository(MemberEntity)
        private memberRepository: Repository<MemberEntity>,
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>
    ) {}

    // Registration
    async registerMember(member: MemberDTO): Promise<MemberEntity> {
        const salt = await bcrypt.genSalt();
        member.password = await bcrypt.hash(member.password, salt);
        return await this.memberRepository.save(member);
    }

    // Log in
    async login(query:userDTO)
    {
        const email = query.email;
        const password = query.password;
        const memberDetails = await this.memberRepository.findOneBy({ email : email });        
        if (memberDetails === null) {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Member not found"
            })
        } else {
            if (await bcrypt.compare(password, memberDetails.password)) {
                return memberDetails;
            } else {
                throw new UnauthorizedException({
                    status: HttpStatus.UNAUTHORIZED,
                    message: "Password does not match"
                })
            }
        }
    }

    // Show Profile Details
    async showProfileDetails(memberID) {
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

    // Add Product
    async addProduct(product: productDTO): Promise<ProductEntity> {
        return this.productRepository.save(product);
    }

    // Shop
    async shop() {
        const products = await this.productRepository.find();
        let shop = "";
        for (const key in products) {
            shop += (`
            --------------------------------------------------
            Product ID: ${products[key].productID}
            Name: ${products[key].productName}
            Price: ${products[key].price}
            Description: ${products[key].description}
            Category: ${products[key].category}
            Tags: ${products[key].tags}
            Availability: ${products[key].availabilty}
            Rating: ${products[key].rating}
            Reviews: ${products[key].reviews}
            Supplier: ${products[key].supplier}
            --------------------------------------------------
            `);
        }
        return shop;
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
        const orders = await this.orderRepository.find();
        let cart = "";
        for (const key in orders) {
            if (orders[key].customerID == memberID) {
                cart += (`
            --------------------------------------------------
            Order ID: ${orders[key].orderID}
            Customer ID: ${orders[key].customerID}
            Order Date: ${orders[key].orderDate}
            Order Status: ${orders[key].orderStatus}
            Products: ${orders[key].products}
            Total Amount: ${orders[key].totalAmount}
            Shipping Address: ${orders[key].shippingAddress}
            --------------------------------------------------
            `);
            }
        }
        return cart;
    }

    async searchOrder(orderID) {
        const orders = await this.orderRepository.findOneBy( { orderID: orderID } );
                    return (`
                    --------------------------------------------------
                    Order ID: ${orders.orderID}
                    Customer ID: ${orders.customerID}
                    Order Date: ${orders.orderDate}
                    Order Status: ${orders.orderStatus}
                    Products: ${orders.products}
                    Total Amount: ${orders.totalAmount}
                    Shipping Address: ${orders.shippingAddress}
                    --------------------------------------------------
                    `);

    }


    async cancelOrder(orderID) {
        return await this.orderRepository.delete( { orderID: orderID } );
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
}
import { IsNotEmpty, IsString } from "class-validator";

export class orderDTO {
    orderID: number;
    customerID: number;

    @IsNotEmpty({ message: "😓 Order date should not be empty 😓" })
    @IsString({ message: "😓 Order date name must be a string 😓" })
    orderDate: string;

    @IsNotEmpty({ message: "😓 Order status name should not be empty 😓" })
    @IsString({ message: "😓 Order status name must be a string 😓" })
    orderStatus: string;

    @IsNotEmpty({ message: "😓 Product name should not be empty 😓" })
    @IsString({ message: "😓 Product name must be a string 😓" })
    products: string;

    @IsNotEmpty({ message: "😓 Total amount should not be empty 😓" })
    @IsString({ message: "😓 Total amount must be a string 😓" })
    totalAmount: string;

    @IsNotEmpty({ message: "😓 Shipping address should not be empty 😓" })
    @IsString({ message: "😓 Shipping address must be a string 😓" })
    shippingAddress: string;
}
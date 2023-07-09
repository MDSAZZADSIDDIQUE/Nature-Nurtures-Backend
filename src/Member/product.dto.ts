import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class productDTO {
    productID: number;

    @IsNotEmpty({ message: "😓 Product name should not be empty 😓" })
    @IsString({ message: "😓 Product name must be a string 😓" })
    productName: string;

    @IsNotEmpty({ message: "😓 Price should not be empty 😓" })
    @IsString({ message: "😓 Price must be a string 😓" })
    price: string;

    @IsNotEmpty({ message: "😓 Product name should not be empty 😓" })
    @IsString({ message: "😓 Product name must be a string 😓" })
    description: string;

    @IsNotEmpty({ message: "😓 Product name should not be empty 😓" })
    @IsString({ message: "😓 Product name must be a string 😓" })
    category: string;

    @IsNotEmpty({ message: "😓 Product name should not be empty 😓" })
    @IsString({ message: "😓 Product name must be a string 😓" })
    tags: string;

    @IsNotEmpty({ message: "😓 Product name should not be empty 😓" })
    @IsString({ message: "😓 Product name must be a string 😓" })
    availabilty: string;

    @IsNotEmpty({ message: "😓 Rating should not be empty 😓" })
    @IsString({ message: "😓 Rating must be a string 😓" })
    rating: string;

    @IsNotEmpty({ message: "😓 Reviews should not be empty 😓" })
    @IsString({ message: "😓 Reviews must be a string 😓" })
    reviews: string;

    @IsNotEmpty({ message: "😓 Supplier should not be empty 😓" })
    @IsString({ message: "😓 Supplier must be a string 😓" })
    supplier: string;

    picture: string;
}

export class editProductDTO {
    editProduct: number;
}
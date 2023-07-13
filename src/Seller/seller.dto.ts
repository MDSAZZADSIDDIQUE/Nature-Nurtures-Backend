import { IsNotEmpty, IsString } from "class-validator";

export class SellerDTO {
    sellerId: number;
    memberID: number;

    @IsNotEmpty({ message: "Shop name should not be empty." })
    @IsString({ message: "Shop name must be a string." })
    shopName: string;

    @IsNotEmpty({ message: "Shop location should not be empty." })
    @IsString({ message: "Shop location must be a string." })
    shopLocation: string;
    
    shopPicture: string;
}
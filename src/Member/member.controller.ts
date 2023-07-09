import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UsePipes, UseInterceptors, ValidationPipe, Res, Delete, Session, NotFoundException, HttpStatus, ForbiddenException } from "@nestjs/common";
import { MemberService } from "./member.service";
import { EditMemberDTO, MemberDTO } from "./member.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { orderDTO } from "./order.dto";
import { editProductDTO, productDTO } from "./product.dto";
import { confirmOrderDTO, paymentInformationDTO } from "./payment.dto";

@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    // Registration
    @Post('/registration')
    @UsePipes(new ValidationPipe)
    @UseInterceptors(FileInterceptor('profilePicture',
    { fileFilter(req, file, callback) {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
            callback(null, true);
        } else {
            callback(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false)
        }
    },
    limits: { fileSize: 1000000 },
    storage:diskStorage({
        destination: './profile_pictures',
        filename(req, file, callback) {
            callback(null, Date.now() + file.originalname)
        },
    })
    }))
    async registerMember(@Session() session, @Body() member:MemberDTO, @UploadedFile() profilePicture: Express.Multer.File) {
        member.profilePicture = profilePicture.filename;
        if (member.password !== member.confirmPassword) {
            throw new ForbiddenException({
                status: HttpStatus.FORBIDDEN,
                message: "Password and confirm password does not match."
            });
        }
        const memberDetails = await this.memberService.registerMember(member);
        session.memberID = memberDetails.memberID;
        session.profilePicture = memberDetails.profilePicture;
        return "Registration successful";
    }

    //Show Profile Details
    @Get('/showprofiledetails')
    showProfileDetails(@Session() session) {
        return this.memberService.showProfileDetails(session.memberID);
    }

    //Show Profile Picture
    @Get('/showprofilepicture')
    showProfilePicture(@Session() session, @Res() response) {
        const profilePicture = session.profilePicture;
        response.sendFile(profilePicture, { root: './profile_pictures' });
    }

    //Edit Profile Details
    @Put('/editprofiledetails')
    editProfileDetails(@Session() session, @Query() query:EditMemberDTO) {
        return this.memberService.editProfileDetails(session.memberID, query);
    }

    //Add Product
    @Post('/addproduct')
    @UsePipes(new ValidationPipe)
    @UseInterceptors(FileInterceptor('picture',
    { fileFilter(req, file, callback) {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
            callback(null, true);
        } else {
            callback(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false)
        }
    },
    limits: { fileSize: 1000000 },
    storage:diskStorage({
        destination: './picture',
        filename(req, file, callback) {
            callback(null, Date.now() + file.originalname)
        },
    })
    }))
    async addProduct(@Body() product: productDTO, @UploadedFile() picture: Express.Multer.File) {
        product.picture = picture.filename;
        await this.memberService.addProduct(product);
        return "Product Added";
    }

    // Shop
    @Get('/shop')
    async shop() {
        return await this.memberService.shop();
    }

    // Add to Cart
    @Get('/addtocart')
    async addToCart(@Session() session, @Query() query:editProductDTO,@Body() order: orderDTO) {
        return await this.memberService.addToCart(session.memberID, query, order);
    }

    // Cart
    @Get('/cart')
    async cart(@Session() session) {
        return await this.memberService.cart(session.memberID);
    }

    // Search Order
    @Get('/searchorder/:orderID')
    async searchOrder(@Param('orderID') orderID:string) {
        return await this.memberService.searchOrder(orderID);
    }

    // Delete Order
    @Delete('/cancelorder/:orderID')
    cancelOrder(@Param('orderID') orderID:string) {
        this.memberService.cancelOrder(orderID);
        return "Delete Successful";
    }

    // Confirm Order
    @Post('/confirmorder')
    async confirmOrder(@Query() query: confirmOrderDTO, @Body() paymentInformation: paymentInformationDTO) {
        return await this.memberService.confirmOrder(query, paymentInformation);
    }

    // Log Out
    @Get('/logout')
    async(@Session() session) {
        session.destroy();
    }


    @Get('/searchplantfertilizer/:plantName')
    searchPlantFertilizer(@Param('plantName') plantName:string, @Body() listOfPlantsAndTheirRequiredFertilizers:object): string {
        return this.memberService.searchPlantFertilizer(plantName, listOfPlantsAndTheirRequiredFertilizers);
    }
    @Get('/notificationforwater')
    getNotificationForWater(): string {
        return this.memberService.getNotificationForWater();
    }
    
}
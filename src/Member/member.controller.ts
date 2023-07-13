import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UsePipes, UseInterceptors, ValidationPipe, Res, Delete, Session, NotFoundException, HttpStatus, ForbiddenException, UseGuards } from "@nestjs/common";
import { MemberService } from "./member.service";
import { EditMemberDTO} from "./member.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { orderDTO } from "./order.dto";
import { confirmOrderDTO, paymentInformationDTO } from "./payment.dto";
import { SessionGuard } from "./session.gaurd";
import { editProductDTO} from "src/Seller/product.dto";
import { SellerDTO } from "src/Seller/seller.dto";

@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    //Show Profile Details
    @Get('/showprofiledetails')
    @UseGuards(SessionGuard)
    showProfileDetails(@Session() session) {
        return this.memberService.showProfileDetails(session.memberID);
    }

    //Show Profile Picture
    @Get('/showprofilepicture')
    @UseGuards(SessionGuard)
    showProfilePicture(@Session() session, @Res() response) {
        const profilePicture = session.profilePicture;
        response.sendFile(profilePicture, { root: './pictures/profile_pictures' });
    }

    //Edit Profile Details
    @Put('/editprofiledetails')
    editProfileDetails(@Session() session, @Query() query:EditMemberDTO) {
        return this.memberService.editProfileDetails(session.memberID, query);
    }

    // Shop
    @Get('/shop')
    @UseGuards(SessionGuard)
    async shop() {
        return await this.memberService.shop();
    }

    // Add to Cart
    @Get('/addtocart')
    @UseGuards(SessionGuard)
    async addToCart(@Session() session, @Query() query:editProductDTO, @Body() order: orderDTO) {
        await this.memberService.addToCart(session.memberID, query, order);
        return "Product added to cart";
    }

    // Cart
    @Get('/cart')
    @UseGuards(SessionGuard)
    async cart(@Session() session) {
        return await this.memberService.cart(session.memberID);
    }

    // Search Order
    @Get('/searchorder/:orderID')
    @UseGuards(SessionGuard)
    async searchOrder(@Param('orderID') orderID:string) {
        return await this.memberService.searchOrder(orderID);
    }

    // Delete Order
    @Delete('/cancelorder/:orderID')
    @UseGuards(SessionGuard)
    async cancelOrder(@Param('orderID') orderID:string) {
        return await this.memberService.cancelOrder(orderID);
    }

    // Confirm Order
    @Post('/confirmorder')
    @UseGuards(SessionGuard)
    async confirmOrder(@Query() query: confirmOrderDTO, @Body() paymentInformation: paymentInformationDTO) {
        return await this.memberService.confirmOrder(query, paymentInformation);
    }

    // Log Out
    @Get('/logout')
    @UseGuards(SessionGuard)
    async(@Session() session) {
        session.destroy();
    }

    @Get('/searchplantfertilizer/:plantName')
    @UseGuards(SessionGuard)
    searchPlantFertilizer(@Param('plantName') plantName:string, @Body() listOfPlantsAndTheirRequiredFertilizers:object): string {
        return this.memberService.searchPlantFertilizer(plantName, listOfPlantsAndTheirRequiredFertilizers);
    }
    
    @Get('/notificationforwater')
    @UseGuards(SessionGuard)
    getNotificationForWater(): string {
        return this.memberService.getNotificationForWater();
    }

    // Become Seller
    @Post('/becomeseller')
    @UseGuards(SessionGuard)
    @UsePipes(new ValidationPipe)
    @UseInterceptors(FileInterceptor('shopPicture',
    { fileFilter(req, file, callback) {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
            callback(null, true);
        } else {
            callback(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false)
        }
    },
    limits: { fileSize: 1000000 },
    storage:diskStorage({
        destination: './pictures/shop_pictures',
        filename(req, file, callback) {
            callback(null, Date.now() + file.originalname)
        },
    })
    }))
    async addProduct(@Session() session, @Body() seller: SellerDTO, @UploadedFile() shopPicture: Express.Multer.File) {
        seller.shopPicture = shopPicture.filename;
        console.log(seller.shopPicture);
        await this.memberService.becomeSeller(session.memberID, seller);
        return seller;
    }
    
    // Show Seller Details
    @Get('/showsellerdetails')
    @UseGuards(SessionGuard)
    async showSellerDetails(@Session() session) {
        const memberID = session.memberID;
        return await this.memberService.showSellerDetails(memberID);
    }

    //Edit Seller Details
    @Put('/editsellerdetails')
    async editSellerDetails(@Session() session, @Query() query:EditMemberDTO) {
        return await this.memberService.editSellerDetails(session.memberID, query);
    }
}
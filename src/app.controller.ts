import { Body, Controller, ForbiddenException, HttpStatus, Post, Query, Session, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AppService } from './app.service';
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { MemberDTO, userDTO } from "./member/member.dto";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

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
            destination: './pictures/profile_pictures',
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
            const memberDetails = await this.appService.registerMember(member);
            session.memberID = memberDetails.memberID;
            session.email = memberDetails.email;
            session.profilePicture = memberDetails.profilePicture;
            return "Registration successful";
        }

            // Log in
    @Post('/login')
    async login(@Query() query:userDTO, @Session() session) {
       const memberDetails = await this.appService.login(query);
       session.memberID = memberDetails.memberID;
       session.email = memberDetails.email;
       session.profilePicture = memberDetails.profilePicture;
       console.log(session.memberID);
       return "Login successfull";
    }
}
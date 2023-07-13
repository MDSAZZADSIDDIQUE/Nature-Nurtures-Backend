import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from './member/member.entity';
import { Repository } from 'typeorm';
import { MemberDTO, userDTO } from './member/member.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>
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
}

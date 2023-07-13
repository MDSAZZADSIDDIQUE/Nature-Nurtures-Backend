import { MemberEntity } from "src/member/member.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('seller')
export class SellerEntity {
    @PrimaryGeneratedColumn( { name: 'seller_id' } )
    sellerID: number;

    @Column( { name: 'member_id' } )
    memberID: number;

    @Column( { name: 'shop_name', type: 'varchar', length: 255 } )
    shopName: string;

    @Column( { name: 'shop_location', type: 'varchar', length: 255 } )
    shopLocation: string;

    @Column( { name: 'shop_picture', type: 'varchar', length: 255 } )
    shopPicture: string;

    @OneToOne(() => MemberEntity, member => member.seller)
    @JoinColumn()
    member: MemberEntity;
}
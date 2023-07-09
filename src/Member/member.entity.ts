import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity('member')
export class MemberEntity {
    @PrimaryGeneratedColumn( { name: 'member_id' } )
    memberID: number;

    @Column( { name: 'first_name', type: 'varchar', length: 255 } )
    firstName: string;

    @Column( { name: 'last_name', type: 'varchar', length: 255 } )
    lastName: string;

    @Column( { name: 'username', type: 'varchar', length: 255 } )
    username: string;

    @Column( { name: 'date_of_birth', type: 'date'} )
    dateOfBirth: Date;

    @Column( { name: 'address', type: 'varchar', length: 255 } )
    address: string;

    @Column( { name: 'telephone_number', type: 'varchar', length: 255 } )
    telephoneNumber: string;

    @Column( { name: 'email', type: 'varchar', length: 255 } )
    email: string;

    @Column( { name: 'password', type: 'varchar', length: 255 } )
    password: string;

    @Column( { name: 'profile_picture', type: 'varchar', length: 255 } )
    profilePicture: string;

    @OneToMany(() => OrderEntity, order => order.member)
    orders: OrderEntity[];
}
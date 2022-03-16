import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity()
export class Cart {

    @PrimaryColumn()
    _id: string;

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;

    // @ManyToOne(type => Payment, payment => payment.carts, { nullable: true })
    // payment: Payment;

    @ManyToOne(type => User, user => user.cart)
    user: User;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    total: number;

}

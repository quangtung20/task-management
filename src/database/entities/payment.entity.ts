import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { User } from "./user.entity";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    paymentId: string;

    @Column()
    address: string;

    @Column()
    status: boolean;

    @ManyToOne(() => User, user => user.payments)
    user: User;

    // @OneToMany(() => Cart, cart => cart.payment)
    // carts: Cart[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}
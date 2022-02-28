import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Image } from "./image.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true, nullable: false })
    product_id: string;

    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @OneToOne(() => Image)
    @JoinColumn()
    image: Image;

    @ManyToOne(type => Category, category => category.products)
    category: Category;

    @Column()
    content: string;

    @Column({ default: false })
    checked: boolean;

    @Column({ default: 0 })
    sold: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;


}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ unique: true })
    title: string;

    @Column()
    description: string;

    @ManyToOne(type => Category, category => category.products)
    category: Category;

}
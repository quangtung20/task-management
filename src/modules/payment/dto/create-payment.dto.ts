import { Cart } from "src/database/entities/cart.entity";

export class CreatePaymentDto {
    cart: Cart[]

    paymentID: string;

    address: string;
}

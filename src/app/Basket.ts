import { BasketItems } from "./BasketItems";

export interface Basket{

    id: string;
    Items: BasketItems[];
    clientSecret: string;
    paymentIntentId:string
}
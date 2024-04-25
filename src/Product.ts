import { ProductJSON } from "./ProductJSON";

export class Product {
    public name: string;
    public code: string;
    public description: string;
    public price: string;
    public image: string = "";

    constructor(name: string, code: string, description: string, price: string)
    {
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
    }

    public toJSON()
    {
        const json: ProductJSON = {
            name: this.name,
            code: this.code,
            description: this.description,
            price: this.price,
            image: this.image,
            index: 0
        }

        return json;
    }
}
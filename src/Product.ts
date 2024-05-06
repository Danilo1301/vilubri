import { Chamada } from "./Chamada";
import { ProductJSON } from "./ProductJSON";

export class Product {
    public name: string;
    public code: string;
    public description: string;
    public price: string;
    public ipi: string;

    public chamada?: Chamada;

    constructor(name: string, code: string, description: string, price: string, ipi: string)
    {
        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.ipi = ipi;
    }

    public toJSON()
    {
        const json: ProductJSON = {
            name: this.name,
            code: this.code,
            description: this.description,
            price: this.price,
            ipi: this.ipi,
            index: this.chamada?.products.indexOf(this) || 0
        }

        return json;
    }
}
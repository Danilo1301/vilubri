import { Product } from "./Product";
import { ChamadaJSON } from './ChamadaJSON';
import { ProductJSON } from "./ProductJSON";

export class Chamada {
    public id: string;
    public products: Product[] = [];
    public date: Date;
    public isCompleted: boolean = false;

    constructor(id: string)
    {
        this.id = id;
        this.date = new Date();
    }

    public toJSON()
    {
        const json: ChamadaJSON = {
            id: this.id,
            products: [],
            date: this.date.getTime(),
            completed: this.isCompleted
        }

        for(const product of this.products)
        {
            json.products.push(product.toJSON());
        }

        return json;
    }

    public addProduct(product: Product)
    {
        product.chamada = this;

        this.products.push(product);
    }

    public hasProductCode(code: string)
    {
        for(const product of this.products)
        {
            if(product.code == code) return true;
        }
        return false;
    }
}
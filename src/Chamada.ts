import { Product } from "./Product";
import { ChamadaJSON } from './ChamadaJSON';
import { ProductJSON } from "./ProductJSON";

export class Chamada {
    public id: string;
    public products: Product[] = [];
    public date: Date;

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
            date: this.date.getTime()
        }

        for(const product of this.products)
        {
            const productJson = product.toJSON();
            productJson.index = this.products.indexOf(product);
            
            json.products.push(productJson);
        }

        return json;
    }
}
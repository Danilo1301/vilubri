import { Product } from "./Product";
import { ChamadaJSON } from './ChamadaJSON';
import { ProductJSON } from "./ProductJSON";

export class Chamada {
    public id: string;
    public products: Product[] = [];
    public date: Date;
    public createdDate: Date;
    public isCompleted: boolean = false;

    constructor(id: string)
    {
        this.id = id;
        this.date = new Date();
        this.createdDate = new Date();
    }

    public toJSON()
    {
        const json: ChamadaJSON = {
            id: this.id,
            products: [],
            date: this.date.getTime(),
            createdDate: this.createdDate.getTime(),
            completed: this.isCompleted
        }

        for(const product of this.products)
        {
            json.products.push(product.toJSON());
        }

        return json;
    }

    public loadFromJSON(data: ChamadaJSON)
    {
        this.date = new Date(data.date);
        this.createdDate = new Date(data.createdDate);
        this.isCompleted = data.completed;
    
        for(const productJson of data.products)
        {
          const product = new Product(productJson.name, productJson.code, productJson.description, productJson.price, productJson.ipi);
          this.addProduct(product);
        }

        if(data.createdDate == 0) this.createdDate = new Date();
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
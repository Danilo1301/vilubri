import { ProductJSON } from "./ProductJSON";

export interface ProductJSON_Prices {
    product: ProductJSON;
    newPrice: number;
    newProduct: boolean;
    changedPrice: boolean;
}

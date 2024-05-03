import { ProductJSON } from "./ProductJSON";

export interface ChamadaJSON {
    id: string;
    products: ProductJSON[];
    date: number;
    completed: boolean;
}
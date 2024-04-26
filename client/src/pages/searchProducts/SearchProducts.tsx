import React, { useEffect, useState } from 'react';
import { requestAuthKey } from '../home/Home';
import { ProductJSON_Search } from '../../../../src/ProductJSON_Search'

function ProductItem({data}: { data: ProductJSON_Search })
{
    const options: Intl.DateTimeFormatOptions = {dateStyle: 'full'}
    const date = new Date(data.date);
    const dateStr = date.toLocaleDateString("pt-BR");
    const timeStr = date.toLocaleTimeString();

    return (
        <div>
            {dateStr} {timeStr} | {data.product.code} - {data.product.name} ({data.product.price})
        </div>
    );
}

function ProductsList({products}: { products: ProductJSON_Search[] | undefined }) {

    if(!products)
    {
        return (
            <div>
                No products to show
            </div>
        );
    }

    return (
        <div>
            {products.sort((a, b) => {
                const codeA = parseInt(a.product.code);
                const codeB = parseInt(b.product.code);

                return codeA - codeB;
            }).map((product, index) => <ProductItem key={index} data={product}></ProductItem>)}
        </div>
    );
}

function SearchProducts() {
    const [products, setProducts] = React.useState<ProductJSON_Search[]>();

    const onSubmit = (event: any) => {
        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        
        fetch(url, fetchOptions)
        .then(response => {
            response.json().then((data) => {
                if(response.ok)
                {
                    console.log(data);

                    setProducts(data);
    
                    //window.location.href = `/chamadas/${id}`;
                    return;
                }
                alert(data.error)
            })
        });

        event.preventDefault();
    }

    const [time, setTime] = React.useState("1");

    return (
        <div className='container'>
            <a href="/">Voltar</a>
            <h1>Procurar produtos que fazem tempo que não são feitos</h1>

            <form action={'/api/searchProducts'} onSubmit={onSubmit} method="post" encType="multipart/form-data">
                <div className=''>
                    <span>Tempo:</span>
                    <input type="number" name="time" className="form-control" placeholder="" onChange={e => setTime(e.target.value)} value={time}></input>
                </div>

                <div className=''>
                    <span>Medida:</span>
                    <select name="measure" className="form-control">
                        <option>dias</option>
                        <option>meses</option>
                    </select>
                </div>

                <input type="submit" value="Procurar" />
            </form>

            <ProductsList products={products}></ProductsList>
        </div>
    );
}

export default SearchProducts;
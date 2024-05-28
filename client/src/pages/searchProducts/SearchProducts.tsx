import React, { useEffect, useState } from 'react';
import { requestAuthKey } from '../home/Home';
import { ProductJSON_Search } from '../../../../src/ProductJSON_Search'
import { ChamadaJSON } from '../../../../src/ChamadaJSON';

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

function SearchProductsSection1() {
    const [products, setProducts] = React.useState<ProductJSON_Search[]>();

    const [time, setTime] = React.useState("1");

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

    return (
        <div className=''>
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

function ChamadaItem({data}: { data: ChamadaJSON })
{
    const url = `/chamadas/${data.id}`;

    return (
        <div>
            <a href={url}>Chamada {data.id}</a>
        </div>
    );
}

function ChamadasList({chamadas}: { chamadas: ChamadaJSON[] | undefined }) {

    if(!chamadas)
    {
        return (
            <div>
                No chamadas to show
            </div>
        );
    }

    return (
        <div>
            {chamadas.sort((a, b) => b.createdDate - a.createdDate).map((product, index) => <ChamadaItem key={index} data={product}></ChamadaItem>)}
        </div>
    );
}

function SearchProductsSection2() {
    const [chamadas, setChamadas] = React.useState<ChamadaJSON[]>();

    const [name, setName] = React.useState("");

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

                    setChamadas(data);
    
                    //window.location.href = `/chamadas/${id}`;
                    return;
                }
                alert(data.error)
            })
        });

        event.preventDefault();
    };

    return (
        <div className='mt-4'>
            <h1>Procurar produtos por nome / código</h1>

            <form action={'/api/searchProductsByCode'} onSubmit={onSubmit} method="post" encType="multipart/form-data">
                <div className=''>
                    <span>Nome / Código:</span>
                    <input type="text" name="name" className="form-control" placeholder="" onChange={e => setName(e.target.value)} value={name}></input>
                </div>

                <input type="submit" value="Procurar" />
            </form>

            <ChamadasList chamadas={chamadas}></ChamadasList>
        </div>
    );
}

function SearchProducts() {
   
    return (
        <div className='container'>
            <a href="/">Voltar</a>
            
            <SearchProductsSection1></SearchProductsSection1>
            <SearchProductsSection2></SearchProductsSection2>
        </div>
    );
}

export default SearchProducts;
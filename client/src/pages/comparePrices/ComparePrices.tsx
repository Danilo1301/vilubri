import React, { useEffect, useState } from 'react';
import { requestAuthKey } from '../home/Home';
import { ProductJSON_Prices } from '../../../../src/ProductJSON_Prices'
import { ChamadaJSON } from '../../../../src/ChamadaJSON';

function ProductItem({data}: { data: ProductJSON_Prices }) {
    let titleStr = "Mesmo preço";
    let color = "#bebebe";
    if(data.newProduct)
    {
        titleStr = `Novo produto`;
        color = "#df8817";
    }

    if(data.changedPrice)
    {
        titleStr = `Preço alterou`;
        color = "#000000";
    }

    let diferenceStr = "";  
    if(data.newProduct || !data.changedPrice)
    {
        diferenceStr = data.product.price;
    } else {
        let ipi = data.product.price.includes("IPI") ? " + IPI" : "";
        diferenceStr = `${data.product.priceNumber}${ipi} → ${data.newPrice}${ipi}`;
    }

    return <>
        <div>
            <div><b style={{color: color}}>{titleStr}</b></div>
            <div>{data.product.code} - {data.product.name}</div>
            <div>{diferenceStr}</div>
            <br></br>
        </div>
    </>
}

function ProductsList({products}: { products: ProductJSON_Prices[] | undefined }) {

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
            {products.map((data, index) => <ProductItem key={index} data={data}></ProductItem>)}
        </div>
    );
}

function ComparePrices() {
    const [products, setProducts] = React.useState<ProductJSON_Prices[]>();

    const [descriptionId, setDescriptionId] = React.useState("A");
    const [codeId, setCodeId] = React.useState("B");
    const [priceId, setPriceId] = React.useState("F");

    const handleSubmit = (event: any) => {
        const button = document.getElementById("submit-table-button") as HTMLButtonElement;
        //button.disabled = true;

        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        formData.append("key", requestAuthKey());

        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        
        fetch(url, fetchOptions)
        .then(response => {
            response.json().then(data => {
                if(response.ok)
                {
                    const json: ProductJSON_Prices[] = data;

                    console.log("json:", json);
                    
                    setProducts(data);

                    alert("Uploaded!");
                    
                    button.disabled = false;

                    //window.location.href = `/chamadas/${id}`;
                    return;
                }
                alert(data.error);

                button.disabled = false;
            })
        });

        event.preventDefault();
    }

    return (
        <div className='container'>
            <a href="/">Voltar</a>

            <form action="/api/processPricesTable" method="post" onSubmit={handleSubmit} className='mb-3'>
                <span>Selecione a tabela de preços (.xlsx):</span>
                <br></br>
                <input type="file" name="file" />
                <br></br>
                <div>
                    <span>Descrição:</span>
                    <input type="text" name="description-id" value={descriptionId} onChange={(event) => { setDescriptionId(event.target.value); }}></input>
                </div>
                <div>
                    <span>Código:</span>
                    <input type="text" name="code-id" value={codeId} onChange={(event) => { setCodeId(event.target.value); }}></input>
                </div>
                <div>
                    <span>Preço:</span>
                    <input type="text" name="price-id" value={priceId} onChange={(event) => { setPriceId(event.target.value); }}></input>
                </div>
                <br></br>
                <button id="submit-table-button" type="submit">Enviar</button>
            </form>

            <ProductsList products={products}></ProductsList>
        </div>
    );
}

export default ComparePrices;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChamadaJSON } from '../../../../src/ChamadaJSON'
import { dateToISOString } from '../newChamada/NewChamada';
import { ProductJSON } from '../../../../src/ProductJSON';
import { requestAuthKey } from '../home/Home';
import { IProductRemovePost } from '../../../../src/IProductRemovePost'

const getChamada = async (id: string) => {
    return new Promise<ChamadaJSON>((resolve, reject) =>
    {
        fetch("/api/chamadas/" + id, {method: 'GET'})
        .then(response => response.json())
        .then((chamada: ChamadaJSON) => {
            resolve(chamada)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

function ProductItem({product}: { product: ProductJSON })
{
    const handleRemoveProduct = () => {
        const key = requestAuthKey();

        const body: IProductRemovePost = {
            key: key
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };
    
        console.log('/create', requestOptions)

        fetch('/api/chamadas/' + globalChamadaId + '/products/' + product.index + '/remove', requestOptions)
        .then(response => {
            response.json().then(data => {
                if(response.ok)
                {
                    console.log(data);
    
                    window.location.reload();
                    return;
                }
                alert(data.error)
            })
        });
    }

    let lines: string[] = product.description.split("\n");

    lines = lines.map(line => {
        line = line.trim();
        if(line.length == 0) return "⠀";
        return line;
    })

    const productImage = `/products/${product.code}.png`;

    return (
        <div className="row p-3" style={{width: "450px"}}>  
            <div className="col">
                <div className="col">
                    <div className="item-bg p-3">
                        <div className="item-title">{product.code} - {product.name}</div>
                        <div className="row">
                            <div className="col-auto">
                                <img className="item-image border" src={productImage} alt={product.name}/>
                                <div className="item-price">{product.price}</div>
                            </div>
                            <div className="item-description col p-0">
                                {lines.map((line, i) => <div key={i}>{line}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button className='mt-4' onClick={handleRemoveProduct}>Remover produto</button>
        </div>
        
    );
}

let globalChamadaId: string = "";

function ChamadaPage() {
    const params = useParams();
    const id = params.id!;
    
    globalChamadaId = id;
    
    const [chamada, setChamada] = React.useState<ChamadaJSON>();

    React.useEffect(() => {
        getChamada(id).then(data => {
            console.log(data);

            setChamada(data);
        })
    }, [])

    if(!chamada) return <>No data</>

    const newProductUrl = `/chamadas/${id}/product/new`;

    return (
        <div className='container'>
            <a href="/chamadas">Voltar</a>

            <div>Chamada {id}</div>

            <div>
                ID: {chamada.id}
            </div>
            <div>
                Data: {dateToISOString(new Date(chamada.date))}
            </div>

            <div>
                {chamada.products.length} products
            </div>

            <a className='btn btn-primary mt-4 mb-4' href={newProductUrl}>Adicionar produto</a>

            <div className="container">
                {chamada.products.map((product, i) => <ProductItem key={i} product={product}></ProductItem>)}
            </div>
        </div>
    );
}

export default ChamadaPage;
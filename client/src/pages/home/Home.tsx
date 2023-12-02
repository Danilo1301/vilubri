import React, { useEffect, useState } from 'react';
import { IProduct } from '../../../../src/IProduct'
import { IPageData } from '../../../../src/IPageData'

//flex-grow-1
//https://stackoverflow.com/questions/50262517/bootstrap-4-row-fill-remaining-height

function Product({product}: {product: IProduct}) {
    const lines = product.description.split("\n");

    return (
        <>
            <div className="col p-4">
                <div className="item-title">{product.title}</div>
                <div className="row">
                    <div className="col-auto">
                        <img className="item-image border" src={product.imageUrl} alt={product.title}/>
                        <div className="item-price">{product.price}</div>
                    </div>
                    <div className="item-description col p-0">
                        {lines.map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

function Home() {

    const [product, setProduct] = useState<IProduct>();
   
    useEffect(() => {
        fetch("/api/product")
        .then((response) => response.json())
        .then((product: IProduct) => {
            setProduct(product)
        })
    }, [])

    const [pageData, setPageData] = useState<IPageData>();
   
    useEffect(() => {
        fetch("/api/pageData")
        .then((response) => response.json())
        .then((pageData: IPageData) => {
            setPageData(pageData)
        })
    }, [])

    if(!product || !pageData) return <>No data</>

    /*
    let numOfProducts = 1;
    if(window.screen.width > 500) numOfProducts = 3;

    const products: JSX.Element[] = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(<Product key={i} product={product}/>);
    }
    
    console.log(`showing ${numOfProducts} products`)
    */

    return (
        <div className='container-fluid main-container d-flex flex-column'>
           <div className="nav row">
                <div className='col'>
                    <img className="nav-image p-2" src="logo-vilubri.png" alt="Vilubri"></img>
                </div>
                <div className='col align-self-center'>
                    <div className='nav-alert p-2 text-center'>
                        {pageData.alert}
                    </div>
                </div>
                <div className='col-auto align-self-center'>
                    <div className='nav-date p-2 text-center'>
                        <i className="fa-regular fa-calendar" style={{marginRight: "10px"}}></i>
                        <span>{pageData.date}</span>
                    </div>
                </div>
            </div>
           <div className='row flex-grow-1' style={{overflow: "auto"}}>
            <div className='row row-cols-1 row-cols-sm-2'>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
            </div>
           </div>
           <div className="footer row p-2 justify-content-end">
                <div className='col-auto'>
                    <div className='footer-number p-2 text-center'>
                        <i className="fa-regular fa-file" style={{marginRight: "10px"}}></i>
                        <span>{pageData.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
import React, { useState, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ChamadaJSON } from '../../../../src/ChamadaJSON'
import { ProductJSON } from '../../../../src/ProductJSON';
import { requestAuthKey } from '../home/Home';
import { ColorSettingsContext } from '../../ColorSettings';

const CheckboxContext = createContext(false);

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
    const colorSettingsContext = useContext(ColorSettingsContext);
    const { colorSettings, setColorSettings } = colorSettingsContext;

    const [newIndex, setNewIndex] = React.useState("0");

    const handleRemoveProduct = () => {
        const key = requestAuthKey();

        const body: any = {
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

    const handleChangeIndex = () => {
        const key = requestAuthKey();

        const body: any = {
            key: key,
            newIndex: parseInt(newIndex)
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };
    
        console.log('requestOptions:', requestOptions)

        fetch('/api/chamadas/' + globalChamadaId + '/products/' + product.index + '/changeIndex', requestOptions)
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

    //lines description
    let lines: string[] = product.description.split("\n");
    lines = lines.map(line => {
        line = line.trim();
        if(line.length === 0) return "⠀";
        return line;
    })

    //image
    const productImage = `/${product.code}.png`;

    //style
    const useSmallProduct = useContext(CheckboxContext);

    const style: React.CSSProperties = {};
    if(useSmallProduct) style.maxWidth = "450px";

    //edit url
    const editUrl = `/chamadas/${globalChamadaId}/product/${product.index}/edit`;

    return (
        <div className="row pt-3 pb-3" style={style}>  
            <div className="col">
                <div className="col">
                    <div className="item-bg p-3" style={{backgroundColor: colorSettings.itemColor}}>
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
            <button className='mt-4' onClick={handleRemoveProduct}>[{product.index}] Remover produto</button>
            <div className='row'>
                <div className="col-auto">
                    <input type="number" name="index" className="form-control" placeholder="Novo index" onChange={e => setNewIndex(e.target.value)} value={newIndex}></input>
                </div>
                <div className="col-auto">
                    <button className='' onClick={handleChangeIndex}>Mudar index</button>
                </div>
                <div className="col-auto">
                    <a href={editUrl}>Editar</a>
                </div>
            </div>
        </div>
        
    );
}

let globalChamadaId: string = "";

function ChamadaPage() {
    const params = useParams();
    const id = params.id!;
    
    globalChamadaId = id;

    const colorSettingsContext = useContext(ColorSettingsContext);
    const { colorSettings, setColorSettings } = colorSettingsContext;
    
    const [chamada, setChamada] = React.useState<ChamadaJSON>();

    const [isSmallProductChecked, setIsSmallProductChecked] = useState(false);

    const deleteChamada = () => {
        const key = requestAuthKey();

        const body: any = {
            key: key
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };
    
        console.log('/delete', requestOptions)

        fetch('/api/chamadas/' + globalChamadaId + "/delete", requestOptions)
        .then(response => {
            response.json().then(data => {
                if(response.ok)
                {
                    console.log(data);
    
                    window.location.href = "/chamadas"
                    return;
                }
                alert(data.error)
            })
        })
    }

    const toggleCompleteStatus = () => {
        const key = requestAuthKey();

        const body: any = {
            key: key
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        };
    
        console.log('requestOptions:', requestOptions)

        fetch('/api/chamadas/' + globalChamadaId + '/toggleCompleteStatus', requestOptions)
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

    React.useEffect(() => {
        getChamada(id).then(data => {
            console.log(data);

            setChamada(data);
        })
    }, [id])

    if(!chamada) return <>No data</>

    const newProductUrl = `/chamadas/${id}/product/new`;

    const date = new Date(chamada.date);
    const dateStr = date.toLocaleDateString("pt-BR");
    const timeStr = date.toLocaleTimeString();

    const createdDatte = new Date(chamada.createdDate);
    const createdDateStr = createdDatte.toLocaleDateString("pt-BR");
    const createdTimeStr = createdDatte.toLocaleTimeString();

    const dateTopOptions: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'numeric', day: 'numeric' };
    const dateTopStr = date.toLocaleDateString("pt-BR", dateTopOptions);

    return (
        <div className='container-fluid' style={{backgroundColor: colorSettings.backgroundColor}}>
            <div className="nav row" style={{backgroundColor: colorSettings.navColor}}>
                <div className='col'>
                    <img className="nav-image p-2" src="/logo-vilubri.png" alt="Vilubri"></img>
                </div>
                <div className='col align-self-center'>
                    <div className='nav-alert p-2 text-center'>
                        {'Alert message'}
                    </div>
                </div>
                <div className='col-auto align-self-center'>
                    <div className='nav-date p-2 text-center' style={{backgroundColor: colorSettings.dateColor}}>
                        <i className="fa-regular fa-calendar" style={{marginRight: "10px"}}></i>
                        <span>{dateTopStr}</span>
                    </div>
                </div>
            </div>

            <a href="/chamadas">Voltar</a>
            
            <div>Chamada {id}</div>

            <div>
                Data: {dateStr} | {timeStr}
            </div>

            <div>
                Data de criação: {createdDateStr} | {createdTimeStr}
            </div>

            <div className="row align-items-center">
                <div className="col-auto">
                    {chamada.completed ?
                    <>
                        <span className="badge text-bg-success">Completo</span>
                    </> : <>
                        <span className="badge text-bg-warning">Incompleto</span>
                    </>}
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-primary pl-2" onClick={toggleCompleteStatus}>Mudar status para {chamada.completed ? "Incompleto" : "Completo"}</button>
                </div>
            </div>
                    
            <a className='btn btn-primary mt-4 mb-4' href={newProductUrl}>Adicionar produto</a>

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" checked={isSmallProductChecked} onChange={e => setIsSmallProductChecked(!isSmallProductChecked)}></input>
                <label className="form-check-label">
                    Mostrar em tamanho pequeno
                </label>
            </div>

            <div>
                {chamada.products.length} products
            </div>

            <CheckboxContext.Provider value={isSmallProductChecked}>
                <div className="">
                    {chamada.products.map((product, i) => <ProductItem key={i} product={product}></ProductItem>)}
                </div>
            </CheckboxContext.Provider>

            <button type="button" className="btn btn-danger mt-4" onClick={deleteChamada}>Deletar chamada</button>

            <div className="footer row p-2 justify-content-end" style={{backgroundColor: colorSettings.navColor}}>
                <div className='col-auto'>
                    <div className='footer-number p-2 text-center' style={{backgroundColor: colorSettings.dateColor}}>
                        <i className="fa-regular fa-file" style={{marginRight: "10px"}}></i>
                        <span>{id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChamadaPage;
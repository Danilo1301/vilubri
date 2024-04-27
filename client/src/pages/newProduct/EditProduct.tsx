import React from 'react';
import { useParams } from 'react-router-dom';
import { requestAuthKey } from '../home/Home';
import { ProductJSON } from '../../../../src/ProductJSON';

function NewProduct() {
    const params = useParams();
    const id = params.id!;
    const productIndex = params.productIndex!;

    const backUrl = `/chamadas/${id}`;

    const [code, setCode] = React.useState("");
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("R$ 0,00");

    React.useEffect(() => {
        fetch(`/api/chamadas/${id}/products/${productIndex}`)
        .then(response => response.json())
        .then((data: ProductJSON) => {
            console.log(data)

            setCode(data.code);
            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
        })
    }, [])

    const postUrl = `/api/chamadas/${id}/products/edit`;

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        formData.append("key", requestAuthKey());
        formData.append("index", productIndex);

        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        
        console.log('fetchOptions:', fetchOptions);

        fetch(url, fetchOptions)
        .then(response => {
            response.json().then(data => {
                if(response.ok)
                {
                    console.log(data);
    
                    window.location.href = `/chamadas/${id}`;
                    return;
                }
                alert(data.error)
            })
        });

        event.preventDefault();
    }

    return (
        <div className='container'>
            <a href={backUrl}>Voltar</a>

            <form action={postUrl} onSubmit={handleSubmit} method="post" encType="multipart/form-data">

                <div className=''>
                    <span>Código:</span>
                    <input type="number" disabled={true} name="code" className="form-control" placeholder="" onChange={e => setCode(e.target.value)} value={code}></input>
                </div>

                <div className=''>
                    <span>Nome:</span>
                    <input type="text" name="product_name" className="form-control" placeholder="" onChange={e => setName(e.target.value)} value={name}></input>
                </div>

                <div className=''>
                    <span>Descrição:</span>
                    <textarea name="description" className="form-control" cols={40} rows={10} onChange={e => setDescription(e.target.value)} value={description}></textarea>
                </div>

                <div className=''>
                    <span>Preço:</span>
                    <input type="text" name="price" className="form-control" placeholder="Preço" onChange={e => setPrice(e.target.value)} value={price}></input>
                </div>

                <input type="submit" value="Editar" />
            </form>
        </div>
        
    );
}

export default NewProduct;
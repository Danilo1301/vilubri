import React, { useEffect, useState } from 'react';
import { requestAuthKey } from '../home/Home';

function ImagesForm() {
    const handleSubmit = (event: any) => {

        const button = document.getElementById("submit-images-button") as HTMLButtonElement;
        button.disabled = true;

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
                    console.log(data);
    
                    alert("Images uploaded!");
                    
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
        <div>
            <h3>Upload images (.rar file only)</h3>
            <form action="/api/database/uploadImages" method="post" onSubmit={handleSubmit} className='mb-3'>
                <input type="file" name="file" />
                <br></br>
                <button id="submit-images-button" type="submit">Upload images</button>
            </form>
            <form action="/api/database/downloadImages" method="get">
                <button type="submit">Download images</button>
            </form>
        </div>
    );
}

function ChamadasForm() {
    const handleSubmit = (event: any) => {
        const button = document.getElementById("submit-chamadas-button") as HTMLButtonElement;
        button.disabled = true;

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
                    console.log(data);
    
                    alert("Chamadas uploaded!");
                    
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
        <div className='mt-4'>
            <h3>Upload chamadas (.json file only)</h3>
            <form action="/api/database/uploadChamadas" method="post" onSubmit={handleSubmit} className='mb-3'>
                <input type="file" name="file"/>
                <br></br>
                <button id="submit-chamadas-button" type="submit">Upload chamadas</button>
            </form>
            <form action="/api/database/downloadChamadas" method="get">
                <button type="submit">Download chamadas.json</button>
            </form>
        </div>
    );
}

function Database() {
    return (
        <div className='container'>
            <a href="/">Voltar</a>
            <h1>Database</h1>
            <ImagesForm></ImagesForm>
            <ChamadasForm></ChamadasForm>
        </div>
    );
}

export default Database;
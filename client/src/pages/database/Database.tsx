import React, { useEffect, useState } from 'react';

function ImagesForm() {
    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        const url = new URL(form.action);
        const formData = new FormData(form);

        //formData.append("key", requestAuthKey());
        formData.append("key", '123');

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

                    //window.location.href = `/chamadas/${id}`;
                    return;
                }
                alert(data.error);
            })
        });

        event.preventDefault();
    }

    const handleFileChange = () => {

    }

    return (
        <div>
            <h3>Upload images (.zip file only)</h3>
            <form action="/api/database/uploadImages" method="post" onSubmit={handleSubmit} className='mb-3'>
                <input type="file" name="file" onChange={handleFileChange} />
                <br></br>
                <button type="submit">Upload images</button>
            </form>
            <form action="/api/database/downloadImages" method="get">
                <button type="submit">Download images</button>
            </form>
        </div>
    );
}

function Database() {

    
    return (
        <div className='container'>
            <h1>Database</h1>
            <ImagesForm></ImagesForm>
        </div>
    );
}

export default Database;
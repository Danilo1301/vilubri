import React, { useEffect, useState } from 'react';

function ProductPage() {
    return (
        <div className='container'>
            <div className='mb-3'>
                <a href="/chamadas">Chamadas</a>
            </div>
            <div className='mb-3'>
                <a href="/productPage">Product Page</a>
            </div>
            <div className='mb-3'>
                <a href="/database">Database</a>
            </div>
            <div className='mb-3'>
                <a href="/searchProducts">Procurar produtos</a>
            </div>
            <div>
                <a href="/comparePrices">Comparar preços</a>
            </div>
        </div>
    );
}

export function requestAuthKey()
{
    //const keyCookie = getCookie("vilubri-key")

    //console.log(keyCookie);

    let key = prompt("Digite a KEY de autenticação:");
    
    if(key == null) key = "";

    return key;
}

export function setCookie(name: any, value: any, days: any) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name: any) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export default ProductPage;
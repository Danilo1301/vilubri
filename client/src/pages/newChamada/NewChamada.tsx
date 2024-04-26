import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IChamadaCreatePost } from '../../../../src/IChamadaCreatePost'
import { requestAuthKey } from '../home/Home';

function NewChamada() {
    const [id, setID] = React.useState("");
    const [date, setDate] = React.useState(dateToISOString(new Date()));
    const [time, setTime] = React.useState("12:00");

    const handleCreate = () => {
        console.log("create")
    
        const key = requestAuthKey();

        const timeString = `${date} ${time}:00`;
        const dateTime = new Date(timeString).getTime();

        console.log(timeString, dateTime);

        const chamada: IChamadaCreatePost = {
            id: id,
            date: dateTime,
            key: key
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chamada)
        };
    
        console.log('/create', requestOptions)

        fetch('/api/chamadas/new', requestOptions)
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

    return (
        <div className='container'>
            <a href="/chamadas">Voltar</a>

            <div className=''>
                <span>ID:</span>
                <input type="text" className="form-control" placeholder="ID da chamada" onChange={e => setID(e.target.value)} value={id}></input>
            </div>

            <div className=''>
                <span>Data:</span>
                <input type="date" className="form-control" placeholder="Data" onChange={e => {
                    const str = e.target.value;
                    const date = new Date(str);

                    console.log(str, date.getTime());

                    setDate(str);
                }} value={date}> 
                </input>
            </div>

            <div className="">
                <input type="time" className="form-control" value={time} onChange={e => {
                    const str = e.target.value;
                    
                    console.log(str)

                    setTime(str);
                }}/>
            </div>

            <a className='btn btn-primary mt-4 mb-4' onClick={handleCreate}>Criar</a>
        </div>
        
    );
}

export function dateToISOString(date: Date)
{
    return date.toISOString().substr(0, 10)
}

export default NewChamada;
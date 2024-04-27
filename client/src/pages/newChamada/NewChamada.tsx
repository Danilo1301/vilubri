import React from 'react';
import { requestAuthKey } from '../home/Home';

function NewChamada() {
    const [id, setID] = React.useState("");
    const [date, setDate] = React.useState(dateToISOString(new Date()));
    const [time, setTime] = React.useState("12:00");
    const [copyFromAnotherChamada, setCopyFromAnotherChamada] = React.useState(false);
    const [otherChamadaID, setOtherChamadaID] = React.useState("");

    const handleCreate = () => {
        console.log("create")
    
        const key = requestAuthKey();

        const timeString = `${date} ${time}:00`;
        const dateTime = new Date(timeString).getTime();

        console.log(timeString, dateTime);

        const body: any = {
            id: id,
            date: dateTime,
            key: key,
            otherChamadaId: otherChamadaID
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
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

            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" checked={copyFromAnotherChamada} onChange={e => setCopyFromAnotherChamada(!copyFromAnotherChamada)}></input>
                <label className="form-check-label">
                    Copiar produtos de outra chamada
                </label>
            </div>

            

            {copyFromAnotherChamada ?
            <>
                <div className=''>
                    <input type="text" className="form-control" placeholder="ID da chamada" onChange={e => setOtherChamadaID(e.target.value)} value={otherChamadaID}></input>
                </div>
            </> : <></>}

            <a className='btn btn-primary mt-4 mb-4' onClick={handleCreate}>Criar</a>
        </div>
        
    );
}

export function dateToISOString(date: Date)
{
    return date.toISOString().substr(0, 10)
}

export default NewChamada;
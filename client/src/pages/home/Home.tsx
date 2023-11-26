import React from 'react';
import logo from '../../../public/logo-vilubri.png';

interface IItem {
    title: string
    description: string
    price: string
}

function Item({item}: {item: IItem}) {
    const lines = item.description.split("\n");

    return (
        <>
            <div className="col p-4">
                <div className="item-title">{item.title}</div>
                <div className="row">
                    <div className="col-auto">
                        <img className="item-image rounded border" src="/image.png" alt="..."/>
                        <div className="item-price">{item.price}</div>
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

    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");

    const item = {
        title: title,
        description: description,
        price: price
    }

    React.useEffect(() => {
        fetch("/title.txt")
        .then(response => response.text())
        .then(data => {
            setTitle(data);
        })
    }, [])

    React.useEffect(() => {
        fetch("/description.txt")
        .then(response => response.text())
        .then(data => {
            setDescription(data);
        })
    }, [])

    React.useEffect(() => {
        fetch("/price.txt")
        .then(response => response.text())
        .then(data => {
            setPrice(data);
        })
    }, [])

    //

    const [date, setDate] = React.useState("");

    React.useEffect(() => {
        fetch("/date.txt")
        .then(response => response.text())
        .then(data => {
            setDate(data);
        })
    }, [])
       
    return (
        <div className='container-fluid'>
            <div className="nav row">
                <div className='col'>
                    <img className="nav-image p-2" src="logo-vilubri.png"></img>
                </div>
                <div className='col align-self-center'>
                    <div className='nav-alert p-2 shadow-lg text-center'>
                        Aviso
                    </div>
                </div>
                <div className='col-auto align-self-center'>
                    <div className='nav-date p-2 shadow-lg text-center'>
                        <i className="fa-regular fa-calendar" style={{marginRight: "10px"}}></i>
                        <span>{date}</span>
                        
                    </div>
                </div>
            </div>
            <div className='row row-cols-1 row-cols-sm-2'>
                <Item item={item}/>
                <Item item={item}/>
                <Item item={item}/>
                <Item item={item}/>
                <Item item={item}/>
            </div>
        </div>
    );
}

export default Home;
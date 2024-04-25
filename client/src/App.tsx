import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/home/Home';
import ProductPage from './pages/productPage/ProductPage';
import Chamadas from './pages/chamadas/Chamadas';
import ChamadaPage from './pages/chamada/ChamadaPage';
import NewChamada from './pages/newChamada/NewChamada';
import NewProduct from './pages/newProduct/NewProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/productPage" element={<ProductPage/>} />
        <Route path="/chamadas" element={<Chamadas/>} />
        <Route path="/chamadas/new" element={<NewChamada/>} />
        <Route path="/chamadas/:id" element={<ChamadaPage/>} />
        <Route path="/chamadas/:id/product/new" element={<NewProduct/>} />
    
        {/*<Route path="*" element={<NoPage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

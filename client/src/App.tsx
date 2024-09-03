import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/home/Home';
import ProductPage from './pages/productPage/ProductPage';
import Chamadas from './pages/chamadas/Chamadas';
import ChamadaPage from './pages/chamada/ChamadaPage';
import NewChamada from './pages/newChamada/NewChamada';
import NewProduct from './pages/newProduct/NewProduct';
import Database from './pages/database/Database';
import SearchProducts from './pages/searchProducts/SearchProducts';
import EditProduct from './pages/newProduct/EditProduct';
import ComparePrices from './pages/comparePrices/ComparePrices';
import { ColorSettings, ColorSettingsContext, defaultColorSettings } from './ColorSettings';

function App() {
  const [colorSettings, setColorSettings] = useState<ColorSettings>(defaultColorSettings);

  const updateColorSettings = (newColorSettings: Partial<ColorSettings>) => {
    setColorSettings((prevColorSettings) => {
          return { ...prevColorSettings, ...newColorSettings };
      });
  };

  useEffect(() => {
    console.log("get colors");


      fetch(`/api/colors`)
      .then(response => response.json())
      .then((data: any) => {
          console.log(data)

          updateColorSettings(
            {
              navColor: data.navColor,
              dateColor: data.dateColor,
              backgroundColor: data.backgroundColor,
              itemColor: data.itemColor
            }
          )
      });

  }, []);

  return (
    <ColorSettingsContext.Provider value={{ colorSettings, setColorSettings(newColorSettings) {
      console.log("setting color settings")
      updateColorSettings(newColorSettings);
    }}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/productPage" element={<ProductPage/>} />
          <Route path="/chamadas" element={<Chamadas/>} />
          <Route path="/chamadas/new" element={<NewChamada/>} />
          <Route path="/chamadas/:id" element={<ChamadaPage/>} />
          <Route path="/chamadas/:id/product/new" element={<NewProduct/>} />
          <Route path="/chamadas/:id/product/:productIndex/edit" element={<EditProduct/>} />
          <Route path="/database" element={<Database/>} />
          <Route path="/searchProducts" element={<SearchProducts/>} />
          <Route path="/comparePrices" element={<ComparePrices/>} />

          
      
          {/*<Route path="*" element={<NoPage />} />*/}
        </Routes>
      </BrowserRouter>
    </ColorSettingsContext.Provider>
  );
}

export default App;

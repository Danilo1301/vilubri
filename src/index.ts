import express from 'express';
import path from 'path';
import fs from 'fs';
import { IProduct } from './IProduct';
import { IPageData } from './IPageData';

require("./env")("./.data/env.json");

const port = 3000;
const app = express();

const PATH_PRODUCT = ".data/product/";
const PATH_PAGEDATA = ".data/pageData/";

const PATH_TITLE = PATH_PRODUCT + "/title.txt";
const PATH_DESCRIPTION = PATH_PRODUCT + "/description.txt";
const PATH_PRICE = PATH_PRODUCT + "/price.txt";
const PATH_IMAGE = PATH_PRODUCT + "/image.png";

const PATH_DATE = PATH_PAGEDATA + "/date.txt";
const PATH_ALERT = PATH_PAGEDATA + "/alert.txt";
const PATH_ID = PATH_PAGEDATA + "/id.txt";

function main()
{
  setupDataFiles();
  setupExpress();
}

function readFile(path: string)
{
  return fs.readFileSync(path, "utf-8");
}

function setupDataFiles()
{
  if(!fs.existsSync(PATH_PRODUCT)) fs.mkdirSync(PATH_PRODUCT);
  if(!fs.existsSync(PATH_PAGEDATA)) fs.mkdirSync(PATH_PAGEDATA);

  if(!fs.existsSync(PATH_TITLE)) fs.writeFileSync(PATH_TITLE, 'Bico de Abastecimento Auto Ponteira Curta 3/4"NPT c/Medidor Digital');
  if(!fs.existsSync(PATH_DESCRIPTION)) fs.writeFileSync(PATH_DESCRIPTION, "Product description");
  if(!fs.existsSync(PATH_PRICE)) fs.writeFileSync(PATH_PRICE, "R$ 400,00");

  if(!fs.existsSync(PATH_ALERT)) fs.writeFileSync(PATH_ALERT, "Aviso");
  if(!fs.existsSync(PATH_DATE)) fs.writeFileSync(PATH_DATE, "00/00/00");
  if(!fs.existsSync(PATH_ID)) fs.writeFileSync(PATH_ID, "100");
}

function setupExpress()
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setupAPI();

  app.use(express.static(path.join(__dirname, '..', '/public')));

  app.use(express.static(path.join(__dirname, '..', '/public', '/client')));

  app.use(express.static(path.join(__dirname, '..', '/.data', '/product')));
  
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, '..', '/public', '/client', "index.html")));
  
  app.listen(port, () => {
    console.log('[app] Running on port :' + port);
  })
}

function setupAPI()
{
  app.get('/api/test', (req, res) => {
    res.json({test: "ok"});
  })

  app.get('/api/product', (req, res) => {
    const imageUrl = fs.existsSync(PATH_IMAGE) ? "/image.png" : "default-image.png";

    const product: IProduct = {
      title: readFile(PATH_TITLE),
      description: readFile(PATH_DESCRIPTION),
      price: readFile(PATH_PRICE),
      imageUrl: imageUrl
    }

    res.json(product);
  })

  app.get('/api/pageData', (req, res) => {
    const pageData: IPageData = {
      alert: readFile(PATH_ALERT),
      date: readFile(PATH_DATE),
      id: readFile(PATH_ID)
    }

    res.json(pageData);
  });
}

main();
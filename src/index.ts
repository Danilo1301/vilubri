import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import { IProduct } from './IProduct';
import { IPageData } from './IPageData';
import { Chamada } from './Chamada';
import { Product } from './Product';
import { ChamadaJSON_HomeList } from './ChamadaJSON_HomeList';
import { IChamadaCreatePost } from './IChamadaCreatePost';
import { IProductRemovePost } from './IProductRemovePost';
import { ChamadaJSON } from './ChamadaJSON';

require("./env")("./.data/env.json");

const port = 3000;
const app = express();
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');

const PATH_PRODUCT = ".data/product/";
const PATH_PAGEDATA = ".data/pageData/";

const PATH_TITLE = PATH_PRODUCT + "/title.txt";
const PATH_DESCRIPTION = PATH_PRODUCT + "/description.txt";
const PATH_PRICE = PATH_PRODUCT + "/price.txt";
const PATH_IMAGE = PATH_PRODUCT + "/image.png";

const PATH_DATE = PATH_PAGEDATA + "/date.txt";
const PATH_ALERT = PATH_PAGEDATA + "/alert.txt";
const PATH_ID = PATH_PAGEDATA + "/id.txt";

const chamadas: Map<string, Chamada> = new Map<string, Chamada>();

function createChamada(id: string)
{
  const chamada = new Chamada(id);
  chamadas.set(id, chamada);
  return chamada;
}

function getChamadaHomeList()
{
  const items: ChamadaJSON_HomeList[] = [];

  chamadas.forEach(chamada => {
    const item: ChamadaJSON_HomeList = {
      id: chamada.id,
      numProducts: chamada.products.length,
      date: chamada.date.getTime()
    };
    
    items.push(item);
  });

  return items;
}

function main()
{
  setupDataFiles();
  setupExpress();

  const chamada153 = createChamada("153 (2)");
  chamada153.products.push(new Product("Produto 1", "0001-test", "Descrição 1", "R$ 5,00"));
  chamada153.products.push(new Product("Produto 2", "0002-test", "Descrição 2", "R$ 3,59"));

  console.log(getChamadaHomeList());
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
  //app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({
    extended: true
  }));

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

  app.get('/api/chamadaHomeList', (req, res) => {
    res.json(getChamadaHomeList());
  })

  app.post('/api/chamadas/new', (req, res) => {
    const body: IChamadaCreatePost = req.body;
    
    if(!authorizeKey(body.key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    if(chamadas.has(body.id))
    {
      res.status(500).send({ error: "ID already exists" });
      return;
    }

    const chamada = createChamada(body.id);
    chamada.date = new Date(body.date);

    console.log(body);

    res.json({});
  });

  app.get('/api/chamadas/:id', (req, res) => {
    const id = req.params.id;
    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada ID " + id });
      return;
    }

    res.json(chamada.toJSON());
  })

  app.post('/api/chamadas/:id/products/:productIndex/remove', (req, res) => {
    const body: IProductRemovePost = req.body;
    const id = req.params.id;
    const productIndex: number = parseInt(req.params.productIndex);

    console.log(id, productIndex)

    if(!authorizeKey(body.key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada " + id });
      return;
    }

    if(productIndex >= chamada.products.length)
    {
      res.status(500).send({ error: "Could not find product " + productIndex });
      return;
    }

    chamada.products.splice(productIndex, 1);

    res.json({});
  });

  // Configuramos o upload como um middleware que
  // espera um arquivo cujo a chave é "foto"
  app.post('/api/chamadas/:id/products/new', upload.single('file'), (req, res) => {
    const id = req.params.id;

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada " + id });
      return;
    }

    const key: string = req.body.key;

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    const code: string = req.body.code;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const price: string = req.body.price;

    const product = new Product(name, code, description, price);

    chamada.products.push(product);

    console.log(req.body)
    console.log('file:', req.file)
    
    if(req.file)
    {
      const imageName = `${code}.png`;
      const newImagePath = `./public/products/${imageName}`;
      const oldFilePath = `./uploads/${req.file.filename}`

      if(fs.existsSync(newImagePath))
      {
        console.log(`Image ${imageName} already exists! Deleting old image...`)
        fs.unlinkSync(newImagePath);
      }
      
      console.log(`'${oldFilePath}' renaming to '${newImagePath}'`)

      fs.renameSync(oldFilePath, newImagePath);
    }

    console.log(code);

    res.json({ code });
  });
}

function authorizeKey(key: string)
{
  return key === process.env.AUTH_KEY;
}

main();
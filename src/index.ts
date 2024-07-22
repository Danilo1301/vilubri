import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

import xlsx from 'node-xlsx';

import { IProduct } from './IProduct';
import { IPageData } from './IPageData';
import { Chamada } from './Chamada';
import { Product } from './Product';
import { ChamadaJSON_HomeList } from './ChamadaJSON_HomeList';
import { ChamadaJSON } from './ChamadaJSON';

import { createExtractorFromFile } from 'node-unrar-js'
import { ProductJSON_Search } from './ProductJSON_Search';
import { ProductJSON_Prices } from './ProductJSON_Prices';

require("./env")("./.data/env.json");

const port = 3000;
const app = express();
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const archiver = require('archiver');

const PATH_PRODUCT = ".data/product/";
const PATH_PAGEDATA = ".data/pageData/";
const PATH_PRODUCTIMAGES = ".data/productImages/";
const PATH_CHAMADAS_FILE = ".data/chamadas.json";

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
      date: chamada.date.getTime(),
      completed: chamada.isCompleted
    };
    
    items.push(item);
  });

  return items;
}

function saveData()
{
  console.log("Saving data");

  const data: {[key: string]: ChamadaJSON} = {};

  for(const chamada of chamadas.values())
  {
    const chamadaJson = chamada.toJSON();
    data[chamada.id] = chamadaJson;
  } 

  fs.writeFileSync(PATH_CHAMADAS_FILE, JSON.stringify(data));
}

function loadData()
{
  console.log("Loading data");

  if(!fs.existsSync(PATH_CHAMADAS_FILE)) return;

  const data: {[key: string]: ChamadaJSON} = JSON.parse(fs.readFileSync(PATH_CHAMADAS_FILE, "utf-8"));

  for(const id in data)
  {
    const chamada = createChamada(id);

    chamada.loadFromJSON(data[id]);
  }
}

function main()
{
  setupDataFiles();
  setupExpress();

  loadData();

  /*
  const chamada153 = createChamada("5 (2)");
  chamada153.products.push(new Product("Produto 1", "0001-test", "Descrição 1", "R$ 5,00"));
  chamada153.products.push(new Product("Produto 2", "0002-test", "Descrição 2", "R$ 3,59")); 
  */

  saveData();

  //console.log(getChamadaHomeList());

  //test();
}

interface ProcessPricesIds {
  description: string,
  code: string,
  price: string
}

function processPricesTable(filePath: string, options: ProcessPricesIds)
{
  const workSheetsFromFile = xlsx.parse(filePath);

  const tableIds: {[key: string]: number} = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4,
    'F': 5
  }

  const nameTableId = tableIds[options.description];
  const codeTableId = tableIds[options.code];
  const priceTableId = tableIds[options.price];

  const data = workSheetsFromFile[0].data;

  const changedProducts: ProductJSON_Prices[] = [];

  for(const a of data)
  {
    const name = a[nameTableId];
    const code = a[codeTableId];
    const price = parseFloat(parseFloat(a[priceTableId]).toFixed(2));

    if(a[0].includes("Descrição")) continue;

    //const newProduct = new Product(name, code, "", price, "");

    const product = findLatestProduct(code)

    if(product)
    {
      const oldPrice = product.getPriceInNumber();
      
      console.log(`Product: ${code}`);
      console.log(`Old price:`, oldPrice);
      console.log(`New price:`, price);

      if(oldPrice != price)
      {
        console.log(`Price changed!`);

        const json: ProductJSON_Prices = {
          product: product.toJSON(),
          newPrice: price,
          newProduct: false
        }
        changedProducts.push(json);
      }
    } else {
      console.log(`Could not find product ${code}`);
      
      const newProduct = new Product(name, code, "", `R$ ${price}`, "");

      const json: ProductJSON_Prices = {
        product: newProduct.toJSON(),
        newPrice: price,
        newProduct: true
      }
      changedProducts.push(json);
    }

    //console.log(newProduct);
  }

  return changedProducts;
}

function findLatestProduct(code: string)
{
  let allChamadas = Array.from(chamadas.values());

  allChamadas = allChamadas.sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  });

  //console.log("--")

  let latestProduct: Product | undefined = undefined;

  for(const chamada of allChamadas)
  {
    for(const product of chamada.products)
    {
      if(product.code != code) continue;

      latestProduct = product;
    }
  }

  //console.log(latestProduct);

  return latestProduct;
}

function readFile(path: string)
{
  return fs.readFileSync(path, "utf-8");
}

function setupDataFiles()
{
  if(!fs.existsSync(PATH_PRODUCT)) fs.mkdirSync(PATH_PRODUCT);
  if(!fs.existsSync(PATH_PAGEDATA)) fs.mkdirSync(PATH_PAGEDATA);
  if(!fs.existsSync(PATH_PRODUCTIMAGES)) fs.mkdirSync(PATH_PRODUCTIMAGES);

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

  app.use(express.static(path.join(__dirname, '..', '/.data', '/productImages')));
  
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, '..', '/public', '/client', "index.html")));
  
  app.listen(port, () => {
    console.log('[app] Running on port :' + port);
  })
}

function setupAPI()
{
  app.get('/api/test', (req, res) => {
    console.log(`/api/test`);
    console.log("body:", req.body);

    res.json(req.body);
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
    const id: string = req.body.id;
    const key: string = req.body.key;
    const date: number = req.body.date;
    const otherChamadaId: string = req.body.otherChamadaId;

    console.log(req.url)
    console.log("body:", req.body);

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    if(chamadas.has(id))
    {
      res.status(500).send({ error: "ID already exists" });
      return;
    }

    if(otherChamadaId.length > 0)
    {
      if(!chamadas.has(otherChamadaId))
      {
        res.status(500).send({ error: "Chamada ID " + otherChamadaId + " not found. Can not copy products" });
        return;
      }
    }

    const chamada = createChamada(id);
    if(date != -1) chamada.date = new Date(date);

    if(otherChamadaId.length > 0)
    {
      const otherChamada = chamadas.get(otherChamadaId)!;

      for(const product of otherChamada.products)
      {
        const newProduct = new Product(product.name, product.code, product.description, product.price, product.ipi);
        chamada.addProduct(newProduct);
      }
    }

    saveData();

    console.log(chamada.toJSON());

    res.json(chamada.toJSON());
  });

  app.post('/api/chamadas/:id/toggleCompleteStatus', (req, res) => {
    const id = req.params.id;
    const key: string = req.body.key;

    console.log(req.url)
    console.log("body:", req.body);

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada ID " + id });
      return;
    }

    chamada.isCompleted = !chamada.isCompleted;

    saveData();

    console.log(chamada.toJSON());

    res.json(chamada.toJSON());
  });

  app.post('/api/chamadas/:id/delete', (req, res) => {
    const id = req.params.id;
    const key: string = req.body.key;
    
    console.log(req.url)
    console.log("body:", req.body);

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada ID " + id });
      return;
    }

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    chamadas.delete(id);

    saveData();

    res.json({});
  });

  app.get('/api/chamadas/:id', (req, res) => {
    const id = req.params.id;

    console.log(req.url)
    console.log("body:", req.body);

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada ID " + id });
      return;
    }

    res.json(chamada.toJSON());
  })

  app.post('/api/chamadas/:id/products/:productIndex/remove', (req, res) => {
    const id = req.params.id;
    const productIndex: number = parseInt(req.params.productIndex);
    const key: string = req.body.key;

    console.log(req.url)
    console.log("body:", req.body);

    if(!authorizeKey(key))
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

    saveData();

    res.json({});
  });

  app.post('/api/chamadas/:id/products/new', upload.single('file'), (req, res) => {
    const id = req.params.id;
    const key: string = req.body.key;

    console.log(req.url)
    console.log("body:", req.body);

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada " + id });
      return;
    }

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    const code: string = req.body.code;
    const name: string = req.body.product_name;
    const description: string = req.body.description;
    const price: string = req.body.price;
    const ipi: string = req.body.ipi;

    if(chamada.hasProductCode(code))
    {
      res.status(500).send({ error: "This code was already added" });
      return;
    }

    const product = new Product(name, code, description, price, ipi);

    chamada.addProduct(product);

    saveData();

    console.log(req.body)
    console.log('file:', req.file)
    
    if(req.file)
    {
      const imageName = `${code}.png`;
      const newImagePath = `${PATH_PRODUCTIMAGES}/${imageName}`;
      const oldFilePath = `./uploads/${req.file.filename}`

      if(fs.existsSync(newImagePath))
      {
        console.log(`Image ${imageName} already exists! Deleting old image...`)
        fs.unlinkSync(newImagePath);
      }
      
      console.log(`'${oldFilePath}' renaming to '${newImagePath}'`)

      fs.renameSync(oldFilePath, newImagePath);
    }

    res.json(product.toJSON());
  });

  /*
  TODO: remove this upload.single part
  */
  app.post('/api/chamadas/:id/products/edit', upload.single('file'), (req, res) => {
    const id = req.params.id;

    console.log(req.url)
    console.log("body:", req.body);

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada " + id });
      return;
    }

    const productIndex = req.body.index;

    if(productIndex < 0 || productIndex >= chamada.products.length)
    {
      res.status(500).send({ error: "Could not find product " + productIndex });
      return;
    }
    
    const key: string = req.body.key;
    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }
    
    const product = chamada.products[productIndex];

    //const code: string = req.body.code;
    const name: string = req.body.product_name;
    const description: string = req.body.description;
    const price: string = req.body.price;
    const ipi: string = req.body.ipi;

    //product.code = code;
    product.name = name;
    product.description = description;
    product.price = price;
    product.ipi = ipi;

    saveData();

    res.json(req.body);
  });

  app.get('/api/chamadas/:id/products/:productIndex', (req, res) => {
    const id = req.params.id;
    const productIndex: number = parseInt(req.params.productIndex);

    console.log(req.url)
    console.log("body:", req.body);

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

    const product = chamada.products[productIndex];

    res.json(product.toJSON());
  });

  app.post('/api/chamadas/:id/products/:productIndex/changeIndex', (req, res) => {
    const id = req.params.id;
    const productIndex = parseInt(req.params.productIndex);
    const key: string = req.body.key;
    const newIndex: number = parseInt(req.body.newIndex);

    console.log(req.url)
    console.log("body:", req.body);

    const chamada = chamadas.get(id);

    if(!chamada)
    {
      res.status(500).send({ error: "Could not find chamada " + id });
      return;
    }

    if(productIndex < 0 || productIndex >= chamada.products.length)
    {
      res.status(500).send({ error: "Could not find product " + productIndex });
      return;
    }
    
    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    const product = chamada.products[productIndex];

    chamada.products.splice(productIndex, 1);
    chamada.products.splice(newIndex, 0, product);

    res.json(req.body);
  });

  app.post('/api/database/uploadImages', upload.single('file'), async (req, res) => {
    const key: string = req.body.key;

    console.log(req.url)
    console.log("body:", req.body);

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    console.log(req.file)

    if(req.file)
    {
      const oldFilePath = `./uploads/${req.file.filename}`
      const newRarPath = `./uploads/${req.file.filename}.rar`;

      console.log(`'${oldFilePath}' renaming to '${newRarPath}'`)

      fs.renameSync(oldFilePath, newRarPath);

      const extractDestination = `./extractedFiles/`;

      //fs.mkdirSync(extractDestination);

      console.log(`Extracting files...`);

      await extractRarArchive(newRarPath, extractDestination)

      console.log(`Deleting old images...`);
    
      let files = fs.readdirSync(PATH_PRODUCTIMAGES);
      console.log(files)
      for(const file of files)
      {
        fs.unlinkSync(PATH_PRODUCTIMAGES + "/" + file);
      }

      console.log(`Moving new images...`);

      files = fs.readdirSync(extractDestination);
      console.log(files)
      for(const file of files)
      {
        fs.renameSync(extractDestination + "/" + file, PATH_PRODUCTIMAGES + "/" + file);
      }

      console.log(`Removing unused files...`);

      console.log(`Deleting '${newRarPath}'`);
      fs.unlinkSync(newRarPath);
    }

    res.json({});
  });

  app.get('/api/database/downloadImages', async (req, res) => {
    const zipPath = "./uploads/images.zip";
    
    console.log(req.url)
    console.log("body:", req.body);

    await zipDirectory(PATH_PRODUCTIMAGES, zipPath);

    console.log(`Zipping images...`);

    res.download(zipPath, (err) => {
      //console.log("error?", err)

      fs.unlinkSync(zipPath);
    });
  });

  app.post('/api/database/uploadChamadas', upload.single('file'), async (req, res) => {
    const key: string = req.body.key;

    console.log(req.url)
    console.log("body:", req.body);

    if(!authorizeKey(key))
    {
      res.status(500).send({ error: "Wrong authentication key" });
      return;
    }

    console.log(req.file)

    if(req.file)
    {
      console.log(req.file.filename)

      if(fs.existsSync(PATH_CHAMADAS_FILE)) fs.unlinkSync(PATH_CHAMADAS_FILE);

      const uploadedChamadaFile = `./uploads/${req.file.filename}`;

      fs.renameSync(uploadedChamadaFile, PATH_CHAMADAS_FILE);

      chamadas.clear();

      loadData();
    }

    res.json({});
  });

  app.get('/api/database/downloadChamadas', async (req, res) => {
    res.download(PATH_CHAMADAS_FILE);
  });

  app.post('/api/searchProducts', upload.single('file'), (req, res) => {
    const time: number = parseInt(req.body.time);
    const measure: string = req.body.measure;
    
    console.log(req.url)
    console.log("body:", req.body);

    let timeSpan = time;
    switch(measure)
    {
      case 'dias':
        timeSpan *= 1000 * 60 * 60 * 24;
        break;
      case 'meses':
        timeSpan *= 1000 * 60 * 60 * 24 * 30;
        break;
    }

    const now = new Date();
    const minTime = new Date(now.getTime() - timeSpan);

    //const products: Product[] = [];
    const json: ProductJSON_Search[] = [];

    for(const chamada of chamadas.values())
    {
      if(chamada.date.getTime() < minTime.getTime())
      {
        for(const product of chamada.products)
        {
          const productJson: ProductJSON_Search = {
            product: product.toJSON(),
            date: chamada.date.getTime()
          }

          console.log(`Found ${product.code} ${chamada.date.toISOString()}`)
          
          const REPLACE_OLD_CODES = true;
          let replaceIndex = -1;

          for(const findProductJson of json)
          {
            if(findProductJson.product.code == product.code) 
            {
              console.log("Found duplicate")

              if(chamada.date.getTime() > findProductJson.date)
              {
                replaceIndex = json.indexOf(findProductJson);
              }
            }
          }

          if(REPLACE_OLD_CODES && replaceIndex != -1)
          {
            console.log(`Replacing ${replaceIndex}`)

            json.splice(replaceIndex, 1);
          }

          json.push(productJson);
        }
      }
    }

    //console.log(req.body);
    //console.log(time, measure, timeSpan);
    //console.log(json);

    res.json(json);
  });

  app.post('/api/searchProductsByCode', upload.single('file'), (req, res) => {
    const name: string = req.body.name;

    console.log(req.url)
    console.log("body:", req.body);

    const json: ChamadaJSON[] = [];

    for(const chamada of chamadas.values())
    {
      console.log(`Loopíng products for chamada ${chamada.id}...`);
      for(const product of chamada.products)
      {
        if(product.name.toLowerCase().includes(name.toLowerCase()) || product.code.includes(name))
        {
          console.log(`Found product ${product.name}`)
          json.push(chamada.toJSON());
          break;
        }
      }
    }

    res.json(json);
  });

  app.post('/api/processPricesTable', upload.single('file'), (req, res) => {
    const id = req.params.id;

    console.log(req.file)

    console.log(req.body)

    let changedProducts: ProductJSON_Prices[] = [];
    const options: ProcessPricesIds = {
      description: req.body["description-id"],
      code: req.body["code-id"],
      price: req.body["price-id"]
    }

    if(req.file)
    {
      console.log(req.file.filename)

      const path = req.file.path;
      const newPath = `uploads/table.xlsx`;

      fs.renameSync(path, newPath);

      changedProducts = processPricesTable(newPath, options);

      console.log(`Removing table...`);

      fs.rmSync(newPath);
    }

    res.json(changedProducts);
  });
}

async function extractRarArchive(file: any, destination: string) {
  try {
    // Create the extractor with the file information (returns a promise)
    const extractor = await createExtractorFromFile({
      filepath: file,
      targetPath: destination
    });

    // Extract the files
    [...extractor.extract().files];
  } catch (err) {
    // May throw UnrarError, see docs
    console.error(err);
  }
}

function zipDirectory(sourceDir: string, outPath: string) {
  if(fs.existsSync(outPath))
  {
    console.log(`File already exists! Deleting .zip '${outPath}'`);
    fs.unlinkSync(outPath);
  }

  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise<void>((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', (err: any) => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

function authorizeKey(key: string)
{
  return key === process.env.AUTH_KEY;
}

main();
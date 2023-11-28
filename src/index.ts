import express from 'express';
import path from 'path';
import fs from 'fs';

require("./env")("./.data/env.json");

const port = 3000;
const app = express();

function main()
{
  //setupDataFiles();
  setupExpress();
}

/*
function setupDataFiles()
{
  const PATH_PRODUCT = ".data/product/";
  if(!fs.existsSync(PATH_PRODUCT)) fs.mkdirSync(PATH_PRODUCT);

  const PATH_DATE = PATH_PRODUCT + "/date.txt";
  if(!fs.existsSync(PATH_DATE)) fs.writeFileSync(PATH_DATE, "00/00/00");

  const PATH_TITLE = PATH_PRODUCT + "/title.txt";
  if(!fs.existsSync(PATH_TITLE)) fs.writeFileSync(PATH_TITLE, "Product name");

  const PATH_DESCRIPTION = PATH_PRODUCT + "/description.txt";
  if(!fs.existsSync(PATH_DESCRIPTION)) fs.writeFileSync(PATH_DESCRIPTION, "Description");

  const PATH_PRICE = PATH_PRODUCT + "/price.txt";
  if(!fs.existsSync(PATH_PRICE)) fs.writeFileSync(PATH_PRICE, "R$ 0,00");

  const PATH_NUMBER = PATH_PRODUCT + "/number.txt";
  if(!fs.existsSync(PATH_NUMBER)) fs.writeFileSync(PATH_NUMBER, "000");
}
*/

function setupExpress()
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setupAPI();

  app.use(express.static(path.join(__dirname, '..', '/public')));

  app.use(express.static(path.join(__dirname, '..', '/public', '/client')));

  app.use(express.static(path.join(__dirname, '..', '/public', '/product')));
  
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
}

main();
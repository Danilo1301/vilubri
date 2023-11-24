import express from 'express';
import path from 'path';
import fs from 'fs';

require("./env")("./.data/env.json");

const port = 3000;
const app = express();

function main()
{
  setupExpress();
}

function setupExpress()
{
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  setupAPI();

  app.use(express.static(path.join(__dirname, '..', '/public')));

  app.use(express.static(path.join(__dirname, '..', '/public', '/client')));
  
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
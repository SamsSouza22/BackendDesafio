import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { PORT } from './secrets.mjs';

const server = express();
const acessLogStream = fs.createWriteStream(path.join(process.cwd(),'logs', 'access.log'), { flags: 'a' });

server.use(morgan('combined', { stream: acessLogStream }));
server.use(morgan('dev'));
server.use(express.json());

server.use('*', (req, res) => { 
    res.status(404).send({message: 'Not found'});
  });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


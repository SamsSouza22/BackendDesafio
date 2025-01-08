import express from 'express';
import { PORT } from './secrets';

const server = express();

server.use(express.json());

server.use('*', (req, res) => { 
    res.status(404).send({message: 'Not found'});
  });
  
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


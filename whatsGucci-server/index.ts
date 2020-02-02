import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import schema from './whatsGucci-server/schema';

const app = express();
app.use(cors());
app.use(express.json());

//ping pong champ is from C32
app.get('/_ping', (req, res) => { 
  res.send('pong');
});

const server = new ApolloServer({ schema });
server.applyMiddleware({
  app, 
  path: '/graphql',
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});




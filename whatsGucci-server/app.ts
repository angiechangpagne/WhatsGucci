import cors from 'cors';
import cookieParse from 'cookie-parser';
import express from 'express';
import { origin } from './env';

export const app = express();

app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());

app.get('/ping', (req, res) => {
  res.send('pong');
});
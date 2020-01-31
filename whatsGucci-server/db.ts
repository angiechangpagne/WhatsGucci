import { Pool } from 'pg';
import sql from 'sql-template-strings';
import faker from 'faker';
import addMinutes from 'date-fns/addMinutes';
import { resetDB as envResetDb, fakedDb } from './env';

export type User = {
  id: string, 
  name: string, 
  username: string, 
  password: string, 
  picture: string,
};

export type Message = {
  id: string;
  content: string;
  created_at: Date;
  chat_id: string;
  sender_user_id: string, 
};

export type Chat = {
  id: string;
};

export const dbConfig = {
  host: 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432, 
  user: 'user',
  password: 'password',
  database: 'whatsgucci',
};

export let pool: Pool = new Pool(dbConfig);

export async function initDb(): Promise<void> {
  await pool.query(sql`DROP TABLE IF EXISTS messages;`);
  await pool.query(sql`DROP TBALE IF EXISTS chat_users;`);
  await pool.query(sql`DROP TABLE IF EXISTS users;`);
  await pool.query(sql`DROP TABLE IF EXISTS chats;`);


  
}

const sampleMessages = [
  {
    id: '1',
    content: 'You Gucci Bro?',
    createdAt: new Date(
      new Date('1-1-2020').getTime()-60*1000*1000
    ),
  },
  {
    id: '2',
    content: 'Nah we Fendi. We got beef',
    createdAt: new Date(
      new Date('1-1-2020').getTime()-2*60*1000*1000
    ),
  },
  {
    id: '3',
    content: 'Like its poetry in motion',
    createdAt: new Date(
      new Date('1-1-2020').getTime()-24*60*1000*1000
    ),
  },
  {
    id: '4',
    content: 'This party is wack bruh',
    createdAt: new Date(
      new Date('1-1-2020').getTime()-14*24*60*1000*1000
    ),
  },
]

export const chats = [
  {
    id: '1',
    name: 'Logan Paul',
    picture: '',
    lastMessage: '1'
  },
  {
    id: '2',
    name: 'Jake Paul',
    picture: '',
    lastMessage: '2'
  },
  {
    id: '3',
    name: 'Lil Uzi Vert',
    picture: '',
    lastMessage: '3'
  },
  {
    id: '4',
    name: 'Karl Lagerfeld',
    picture: '',
    lastMessage: '4'
  },
];


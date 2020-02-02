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

  await pool.query(sql`CREATE TABLE chats(
    id SERIAL PRIMARY KEY
  );`);

  await pool.query(sql`CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
    name VARCHAR (50) NOT NULL,
    password VARCHAR (255) NOT NULL,
    picture VARCHAR (255) NOT NULL
  );`);

  await pool.query(sql`CREATE TABLE chat_users(
    chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );`);

  await pool.query(sql`CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    content VARCHAR (355) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );`);


  //Privilege
  await pool.query(
    sql`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO user;`
  );

}

export const resetDb = async () => {
  await initDb();

  const sampleUsers= [
    {
      id:'1',
      name: 'Karl Legerfeld',
      username: 'chanelbot',
      password: '',
      picture: '',
    },
    {
      id:'2',
      name: 'Jeremy Scott',
      username: 'moschino',
      password: '',
      picture: '',
    }, {
      id:'3',
      name: 'Yve Saint Laurent',
      username: 'saintlaurent',
      password: '',
      picture: '',
    }, {
      id:'4',
      name: 'Elon Musk',
      username: 'elonmusk',
      password: '',
      picture: '',
    }, {
      id:'5',
      name: 'Dior',
      username: 'dior',
      password: '',
      picture: '',
    },
  ];

  for (const sampleUser of sampleUsers){
    await pool.query(sql`
    INSERT INTO users(id, name, username, password, picture)
    VALUES(${sampleUser.id}, ${sampleUser.name}, ${sampleUser.username},
      ${sampleUser.password
      }, ${sampleUser.picture})
    `);
  }

  await pool.query(
    sql`SELECT setval('users_id_seq', (SELECT max(id) FROM users ))`
  );

  await pool.query(sql`DELETE FROM chats`);


  const sampleChats = [
    {
      id: '1',
    },
    {
      id: '2',
    },
    {
      id: '3',
    },
    {
      id: '4',
    },
  ];

  for(const sampleChat of sampleChats){
    await pool.query(sql`
      INSERT INTO chats(id)
      values(${sampleChat.id})
      `);
  }

  await pool.query(
    sql`SELECT setval('chats_id_seq', (SELECT max(id) FROM chats))`
  );

  await pool.query(sql`DELETE FROM chats_users`);

  const sampleChatsUsers=[
    {
      chat_id: '1',
      user_id: '1',
    },
    {
      chat_id: '2',
      user_id: '2',
    },
    {
      chat_id: '3',
      user_id: '3',
    },
    {
      chat_id: '4',
      user_id: '4',
    },
    {
      chat_id: '5',
      user_id: '5',
    },
  ];

  for (const sampleChatUser of sampleChatsUsers){
    await pool.query(sql`
      INSERT INTO chats_users(chat_id, user_id)
      VALUES(${sampleChatUser.chat_id}, ${sampleChatUser.user_id})
      `);
  }

  await pool.query(sql`DELETE FROM messages`);

  const baseTime = new Date('1 Jan 2020 GMT').getTime();

  const sampleMessage = [
    {
      id: '1',
      content: 'You on your way?',
      created_at: new Date(baseTime - 60 * 1000 * 1000),
      chat_id: '1',
      sender_user_id: '1',
    },
    {
      id: '2',
      content: 'Hey change of location...meet us in Paris',
      created_at: new Date(baseTime - 2 * 60 * 1000 * 1000),
      chat_id: '2',
      sender_user_id: '1',
    },
    {
      id: '3',
      content: 'Keep the vials reverse sided',
      created_at: new Date(baseTime - 24 * 60 * 1000 * 1000),
      chat_id: '3',
      sender_user_id: '1',
    },
    {
      id: '4',
      content: 'You on your way?',
      created_at: new Date(baseTime - 14 * 24 * 60 * 1000 * 1000),
      chat_id: '4',
      sender_user_id: '1',
    },
  ];

  if (fakedDb) {
    addFakedMessages(sampleMessages, fakedDb);
  }

  for(const sampleMessage of sampleMessages) {
    await pool.query(sql`
    INSERT INTO messages(id, content, created_at, chat_id, sender_user_id)
    VALUES(${sampleMessage.id}, ${sampleMessage.content}, ${
      sampleMessage.created_at
    }, ${sampleMessage.chat_id}, ${sampleMessage.sender_user_id})
    `);
  }

  await pool.query(
    sql`SELECT setval('messages_id_seq', (SELECT max(id) FROM messages))`
  );
};

function addFakedMessages(messages: Message[], count: number ){
  const message = messages[0];
  const date = message.created_at;
  const id = messages.length + 1;

  new Array(count).fill(0).forEach((_,i) => {
    messages.push({
        ...message,
        id: `${id +i}`,
        content: faker.lorem.sentence(4),
        created_at: addMinutes(date, i + 1),
      });
    });
  }
 
  if(envResetDb){
    resetDb();
  }






// const sampleMessages = [
//   {
//     id: '1',
//     content: 'You Gucci Bro?',
//     createdAt: new Date(
//       new Date('1-1-2020').getTime()-60*1000*1000
//     ),
//   },
//   {
//     id: '2',
//     content: 'Nah we Fendi. We got beef',
//     createdAt: new Date(
//       new Date('1-1-2020').getTime()-2*60*1000*1000
//     ),
//   },
//   {
//     id: '3',
//     content: 'Like its poetry in motion',
//     createdAt: new Date(
//       new Date('1-1-2020').getTime()-24*60*1000*1000
//     ),
//   },
//   {
//     id: '4',
//     content: 'This party is wack bruh',
//     createdAt: new Date(
//       new Date('1-1-2020').getTime()-14*24*60*1000*1000
//     ),
//   },
// ]

// export const chats = [
//   {
//     id: '1',
//     name: 'Logan Paul',
//     picture: '',
//     lastMessage: '1'
//   },
//   {
//     id: '2',
//     name: 'Jake Paul',
//     picture: '',
//     lastMessage: '2'
//   },
//   {
//     id: '3',
//     name: 'Lil Uzi Vert',
//     picture: '',
//     lastMessage: '3'
//   },
//   {
//     id: '4',
//     name: 'Karl Lagerfeld',
//     picture: '',
//     lastMessage: '4'
//   },
// ];


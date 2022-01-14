import {Client} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASS,
  port: Number(process.env.PGPORT),
});

client.connect();

export {client};

import { QueryInput } from '@/types/types';
import sql from 'mssql';

// connection configs
var config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER, 
  database: process.env.DB_NAME,
  options: {
      "encrypt": false
  }
};

export async function query(queryString: string, inputs?: QueryInput[]) {
  let pool = await sql.connect(config);
  let request = pool.request();

  if (inputs) {
    for (let i = 0; i < inputs.length; i++) {
      let {name, type, value} = inputs[i];
      request.input(name, type, value);
    }   
  }
  return await request.query(queryString);
}

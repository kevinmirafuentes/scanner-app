import sql from 'mssql';

// connection configs
var config = {
  user: 'sa',
  password: '9522468',
  server: 'vm.host', 
  database: 'IMASTERPROFILES',
  options: {
      "encrypt": false
  }
};

export async function query(queryString: string) {
  let pool = await sql.connect(config);
  return await pool.request().query(queryString);
}
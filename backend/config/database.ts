import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

//CAU HINH KET NOI SQL SERVERconst dbConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'WebBanSach',
  //Windows Authentication (Trusted Connection)  //Neu muon dung SQL Auth, them lai user/password va bo dong authentication  ...(process.env.DB_USER
    ? { user: process.env.DB_USER, password: process.env.DB_PASSWORD }
    : {}),
  options: {
    encrypt: false,                //true neu dung Azure SQL    trustServerCertificate: true,  //bo qua SSL cert (dev mode)    enableArithAbort: true,
    trustedConnection: !process.env.DB_USER,  //Windows Auth khi khong co DB USER  },
  pool: {
    max: 10,                       //toi a 10 ket noi ong thoi    min: 0,
    idleTimeoutMillis: 30000,      //ong ket noi roi sau 30s  },
};

//SINGLETON CONNECTION POOL//Chi tao 1 pool duy nhat cho toan bo app, tai su dunglet pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('✅ Kết nối SQL Server thành công!');
  }
  return pool;
}

//GOI STORED PROCEDURE//Ham helper goi SP an toan, chong SQL injection nho parameterized queryexport async function executeProcedure(
  procName: string,
  params: Array<{
    name: string;
    type: any;  //sql type: sql.Int, sql.VarChar(255), sql.NVarChar(100), etc.    value: unknown;
  }>
): Promise<sql.IResult<any>> {
  const db = await getPool();
  const request = db.request();

  //Gan tung parameter vao request (tu ong escape, khong bi SQL injection)  for (const param of params) {
    request.input(param.name, param.type, param.value);
  }

  return request.execute(procName);
}

//CHAY RAW QUERY//Dung khi can query on gian (vi du: lay danh sach the loai)export async function executeQuery(
  query: string,
  params?: Array<{
    name: string;
    type: any;  //sql type: sql.Int, sql.VarChar(255), sql.NVarChar(100), etc.    value: unknown;
  }>
): Promise<sql.IResult<any>> {
  const db = await getPool();
  const request = db.request();

  if (params) {
    for (const param of params) {
      request.input(param.name, param.type, param.value);
    }
  }

  return request.query(query);
}
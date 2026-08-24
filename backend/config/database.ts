import * as sql from 'mssql';

import dotenv from 'dotenv';
dotenv.config();

// Cau hinh ket noi sql server
const dbconfig: sql.config={
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    user:process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'WebBanSach',
    options:{
        encrypt:false,
        trustServerCertificate: true
    },

    pool:{
        max:10,
        min:0,
        idleTimeoutMillis:30000,
    },
};

// Dung sigleton ket noi
let pool: sql.ConnectionPool| null=null;
export async function getPool(): Promise<sql.ConnectionPool>{
    if(!pool){
        pool=await new sql.ConnectionPool(dbconfig).connect();
        console.log('✅ SQL Server Connected');
    }
    return pool;   
}

// Goi stored procedure
export async function executeProcedure(
    procName:string,
    params:Array<{
        name:string;
        value:unknown;
        type: sql.ISqlTypeFactoryWithNoParams | sql.ISqlTypeFactoryWithLength
      | sql.ISqlTypeFactoryWithScale | sql.ISqlTypeFactoryWithPrecisionScale;
    } >
): Promise<sql.IResult<any> {
    const db= await getPool();
    const request=db.request();
    
    // gan tung parameter vao request (tu dong escape, khong bi sql injection)
    for(const param of params){
        request.input(param.name,param.type,param.value);
    }
    return request.execute(procName);
}

// chay raw query
export async function executeQuery(
  query: string,
  params?: Array<{
    name: string;
    type: sql.ISqlTypeFactoryWithNoParams | sql.ISqlTypeFactoryWithLength
      | sql.ISqlTypeFactoryWithScale | sql.ISqlTypeFactoryWithPrecisionScale;
    value: unknown;
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



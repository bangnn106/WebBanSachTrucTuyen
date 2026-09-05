import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// ========== CẤU HÌNH KẾT NỐI SQL SERVER ==========
const dbConfig: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME || 'WebBanSach',
  // Windows Authentication (Trusted Connection)
  // Nếu muốn dùng SQL Auth, thêm lại user/password và bỏ dòng authentication
  ...(process.env.DB_USER
    ? { user: process.env.DB_USER, password: process.env.DB_PASSWORD }
    : {}),
  options: {
    encrypt: false,                // true nếu dùng Azure SQL
    trustServerCertificate: true,  // bỏ qua SSL cert (dev mode)
    enableArithAbort: true,
    trustedConnection: !process.env.DB_USER,  // Windows Auth khi không có DB_USER
  },
  pool: {
    max: 10,                       // tối đa 10 kết nối đồng thời
    min: 0,
    idleTimeoutMillis: 30000,      // đóng kết nối rỗi sau 30s
  },
};

// ========== SINGLETON CONNECTION POOL ==========
// Chỉ tạo 1 pool duy nhất cho toàn bộ app, tái sử dụng
let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();
    console.log('✅ Kết nối SQL Server thành công!');
  }
  return pool;
}

// ========== GỌI STORED PROCEDURE ==========
// Hàm helper gọi SP an toàn, chống SQL injection nhờ parameterized query
export async function executeProcedure(
  procName: string,
  params: Array<{
    name: string;
    type: any;  // sql type: sql.Int, sql.VarChar(255), sql.NVarChar(100), etc.
    value: unknown;
  }>
): Promise<sql.IResult<any>> {
  const db = await getPool();
  const request = db.request();

  // Gắn từng parameter vào request (tự động escape, không bị SQL injection)
  for (const param of params) {
    request.input(param.name, param.type, param.value);
  }

  return request.execute(procName);
}

// ========== CHẠY RAW QUERY ==========
// Dùng khi cần query đơn giản (ví dụ: lấy danh sách thể loại)
export async function executeQuery(
  query: string,
  params?: Array<{
    name: string;
    type: any;  // sql type: sql.Int, sql.VarChar(255), sql.NVarChar(100), etc.
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
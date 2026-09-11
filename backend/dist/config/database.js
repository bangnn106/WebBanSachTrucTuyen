"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
exports.executeProcedure = executeProcedure;
exports.executeQuery = executeQuery;
const mssql_1 = __importDefault(require("mssql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// CAU HINH KET NOI SQL SERVER
const dbConfig = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_NAME || 'WebBanSach',
    // Windows Authentication (Trusted Connection)
    // Neu muon dung SQL Auth, them lai user/password va bo dong authentication
    ...(process.env.DB_USER
        ? { user: process.env.DB_USER, password: process.env.DB_PASSWORD }
        : {}),
    options: {
        encrypt: false, // true neu dung Azure SQL
        trustServerCertificate: true, // bo qua SSL cert (dev mode)
        enableArithAbort: true,
        trustedConnection: !process.env.DB_USER, // Windows Auth khi khong co DB_USER
    },
    pool: {
        max: 10, // toi da 10 ket noi dong thoi
        min: 0,
        idleTimeoutMillis: 30000, // dong ket noi roi sau 30s
    },
};
// SINGLETON CONNECTION POOL
// Chi tao 1 pool duy nhat cho toan bo app, tai su dung
let pool = null;
async function getPool() {
    if (!pool) {
        pool = await new mssql_1.default.ConnectionPool(dbConfig).connect();
        console.log('✅ Kết nối SQL Server thành công!');
    }
    return pool;
}
// GOI STORED PROCEDURE
// Ham helper goi SP an toan, chong SQL injection nho parameterized query
async function executeProcedure(procName, params) {
    const db = await getPool();
    const request = db.request();
    // Gan tung parameter vao request (tu dong escape, khong bi SQL injection)
    for (const param of params) {
        request.input(param.name, param.type, param.value);
    }
    return request.execute(procName);
}
// CHAY RAW QUERY
// Dung khi can query don gian (vi du: lay danh sach the loai)
async function executeQuery(query, params) {
    const db = await getPool();
    const request = db.request();
    if (params) {
        for (const param of params) {
            request.input(param.name, param.type, param.value);
        }
    }
    return request.query(query);
}
//# sourceMappingURL=database.js.map
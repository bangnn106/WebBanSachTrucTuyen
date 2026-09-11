import sql from 'mssql';
export declare function getPool(): Promise<sql.ConnectionPool>;
export declare function executeProcedure(procName: string, params: Array<{
    name: string;
    type: any;
    value: unknown;
}>): Promise<sql.IResult<any>>;
export declare function executeQuery(query: string, params?: Array<{
    name: string;
    type: any;
    value: unknown;
}>): Promise<sql.IResult<any>>;

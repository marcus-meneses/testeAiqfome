type databaseConfig = {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

interface databaseInterface {
    runQuery(query: string, params?: any[]): Promise<any>;
}

export {
    databaseConfig,
    databaseInterface
}
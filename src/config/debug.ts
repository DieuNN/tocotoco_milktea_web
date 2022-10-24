import dotenv from "dotenv";
import {PoolConfig} from 'pg';
import fs from 'fs';

dotenv.config({
    path: "process.env"
})


export const PostgreSQLConfig: PoolConfig = {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    ssl: {
        rejectUnauthorized: false,
        cert: fs.readFileSync('./cert/crt.crt').toString(),
        key: fs.readFileSync('./cert/key.key').toString(),
        ca: fs.readFileSync('./cert/crt.crt').toString()
    },
    query_timeout: 10000,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000
}

import dotenv from "dotenv";
import {PoolConfig, ClientConfig} from 'pg';
import fs from 'fs';

dotenv.config({
    path: "process.env"
})

const isProduction = process.env.PRODUCTION!.toString() === 'true'
console.log(process.env.PRODUCTION)
const productionConf: ClientConfig = {
    connectionString: "postgres://dieu:6j52V96LmusXlpiXZTzVKQtR1QoXDb2M@dpg-cdbb2nqrrk09hiqcif50-a/tocotea"
}
const nonProductionConf: ClientConfig = {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    // ssl : true
    ssl: {
        rejectUnauthorized: false,
        cert: fs.readFileSync('./cert.pem').toString(),
        key: fs.readFileSync('./key.pem').toString(),
    },
    query_timeout: 0,
    connectionTimeoutMillis: 0,
}
export const PostgreSQLConfig
    :
    ClientConfig = isProduction ? productionConf : nonProductionConf

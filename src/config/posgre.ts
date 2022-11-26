import dotenv from "dotenv";
import {PoolConfig, ClientConfig} from 'pg';
import fs from 'fs';

dotenv.config({
    path: "process.env"
})

const dbUrl = process.env.PRODUCTION ? "postgres://dieu:6j52V96LmusXlpiXZTzVKQtR1QoXDb2M@dpg-cdbb2nqrrk09hiqcif50-a.singapore-postgres.render.com/tocotea?ssl=true"
    : "postgres://dieu:6j52V96LmusXlpiXZTzVKQtR1QoXDb2M@dpg-cdbb2nqrrk09hiqcif50-a/tocotea"


export const PostgreSQLConfig: ClientConfig = {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    ssl: {
        rejectUnauthorized: false,
        cert: fs.readFileSync('./cert.pem').toString(),
        key: fs.readFileSync('./key.pem').toString()
    },
    query_timeout: 60000,
    connectionTimeoutMillis: 60000,
    connectionString: dbUrl,
}

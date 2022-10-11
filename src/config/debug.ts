import {ConnectionOptions} from "mysql2";
import dotenv from "dotenv";
dotenv.config({
    path : "process.env"
})

export const mySQLConfig: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectTimeout: 20000
}

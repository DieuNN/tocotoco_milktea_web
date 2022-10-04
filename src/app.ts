import express, {Application, Request, Response} from "express";
import path from "path";
import http from "http";
import expressLayouts from 'express-ejs-layouts';
import dotenv from 'dotenv'
import mysql from 'mysql2'
import {mySQLConfig} from "./config/debug";

const app: Application = express();
const server: http.Server = http.createServer(app);
dotenv.config({
    path: "process.env"
})

const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));

// Setting the port
const port = process.env.HTTP_PORT;

// EJS setup
app.use(expressLayouts);

// Setting the root path for views directory
app.set('views', path.join(__dirname, 'views'));

// Setting the view engine
app.set('view engine', 'ejs');

/* Home route */
app.get("/", (req: Request, res: Response) => {
    res.render("index")
});

const connection = mysql.createConnection(mySQLConfig)

connection.connect((error) => {
    if (error)
        throw error
})


server.listen(port, () => {

});

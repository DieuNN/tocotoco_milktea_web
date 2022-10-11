import express, {Application, Request, Response} from "express";
import path from "path";
import http from "http";
import expressLayouts from 'express-ejs-layouts';
import cookie_parser from 'cookie-parser'
import sessions from 'express-session'
import dotenv from 'dotenv'
import mysql from 'mysql2'
import {mySQLConfig} from "./config/debug";
import bodyParser from 'body-parser'


export const app: Application = express();
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

// Set static folder
app.use(express.static(__dirname + '/public'));

/*Create application sessions */
app.use(sessions({
    // @ts-ignore
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    resave: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookie_parser())

/* Sample admin login */
const adminUsername = "admin"
const adminPassword = "admin"

var session;

/*Login route*/
app.get("/login", (req: Request, res: Response) => {
    res.render("login", {isError : false})
});

/* Home route */
app.get("/", (req: Request, res: Response) => {
    res.render("index")
});

/*Login  POST route */
app.post("/login", (req: Request, res: Response) => {
    const {username, password} = req.body
    if (username == adminUsername && password == adminPassword) {
        session = req.session
        //@ts-ignore
        session.userid = username
        res.redirect("/")
    } else {
        res.render("login", {isError : true})
    }
})


// const connection = mysql.createConnection(mySQLConfig)
//
// connection.connect((error) => {
//     if (error)
//         throw error
// })


server.listen(port, () => {

});



import express, {Application} from "express";
import path from "path";
import http from "http";
import expressLayouts from 'express-ejs-layouts';
import cookie_parser from 'cookie-parser'
import sessions from 'express-session'
import dotenv from 'dotenv'
import {PostgreSQLConfig} from "./config/debug";
import bodyParser from 'body-parser'
import {adminLoginLogRoute, API, homeRoute, loginPostRoute, loginRoute, logoutRoute, productCategoryRoute} from "./routes";
import requestIp from 'request-ip'
import {Client} from 'pg';
import {isAdminLogin, updateUser} from "./mysql";


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
    resave: true,
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookie_parser())
app.use(requestIp.mw())

var session: any;

/*Login route*/
loginRoute(app)

/* Home route */
homeRoute(app)

/*Login  POST route */
loginPostRoute(app, session)

/* Logout route */
logoutRoute(app)

/* Login logs route */
adminLoginLogRoute(app)

/* Product categories route */
productCategoryRoute(app)

/* API Route */
API(app)
/* 404 page */
app.use((req, res) => {
    res.status(404).render('404')
})

let client;

function handleDisconnect() {
    client = new Client(PostgreSQLConfig)
    client.connect((error) => {
        if (error)
            console.log(error)
        else
            console.log("Connected")
    })
    client.end()

    client.on('error', (error: any) => {
        console.log("Database error : ", error);
        if (error) {
            handleDisconnect()
        } else {
            throw error
        }
    })
}

handleDisconnect()

server.listen(port, () => {

});



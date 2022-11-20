import express, {Application, Request, Response} from "express";
import path from "path";
import http from "http";
import expressLayouts from 'express-ejs-layouts';
import cookie_parser from 'cookie-parser'
import sessions from 'express-session'
import dotenv from 'dotenv'
import {PostgreSQLConfig} from "./config/posgre";
import cors from "cors"
import {
    adminLoginLogRoute,
    API,
    homeRoute,
    loginPostRoute,
    loginRoute,
    logoutRoute,
    productCategoryRoute
} from "./routes";
import requestIp from 'request-ip'
import {Client} from 'pg';
import * as fs from "fs";
import {firebaseAdminApp, firebaseApp, firebaseConfig} from "./config/firebase_conf";
import multer from "multer";
import {productRoute} from "./routes/ProductRoute";
import {discountRoute} from "./routes/DiscountRoute";
import {getAllStatistical, getMonthlyChart, getMonthlyIncome, getYearlyChart} from "./postgre/Statistical";



export const app: Application = express();
const credentials = {
    key: fs.readFileSync('./cert/server.key', 'utf-8'),
    cert: fs.readFileSync('./cert/server.cer', 'utf-8')
}

const server: http.Server = http.createServer(app);
// @ts-ignore
const httpsServer = http.createServer(credentials, app);
dotenv.config({
    path: "process.env"
})

// muter upload
const upload = multer({
    storage: multer.memoryStorage()
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

app.use(cors())


app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
productCategoryRoute(app, upload)

/* Product route */
productRoute(app, upload)

/* Discount route */
discountRoute(app, upload)

/* API Route */
API(app)

app.post("/private", (req: Request, res: Response) => {
    console.log("Start private")
    console.log("That's POST")
    console.log(req.body)
    console.log("End private")
    res.end("End private")
})
/* 404 page */
app.use((req, res) => {
    res.status(404).render('404')
})


let client, _firebaseApp = firebaseApp, _firebaseAdminApp = firebaseAdminApp;

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

getYearlyChart().then(r=> {
    console.log(r)
})

server.listen(port, () => {

});
httpsServer.listen(3443, () => {

})



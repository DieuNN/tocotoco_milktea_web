import {app} from "../app";
import {Request, Response, Application} from 'express'
import request from 'request'
import fs from "fs";
import admin from 'firebase-admin'

const FCM = require("fcm-node")
import dotenv from 'dotenv'
import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import multer from "multer";

dotenv.config({
    path: "process.env"
})

export function notificationRoute(app : Application, upload : multer.Multer) {
    app.get("/notification", (req : Request, res : Response)=> {
        res.render("notification")
    })
}


export async function sendNotification(title: string, message: string, token_device: string) {
    let fcm = new FCM(process.env.FCM_SERVER_KEY)
    let sendBody = {
        notification: {
            title: title,
            body: message
        },
        to: token_device
    }
    fcm.send(sendBody, (error: any, response: any) => {
        if (error)
            console.log(error)
        console.log(response)
    })
}

export async function sendNotificationForAllUser(title: string, message: string) {
    const connection = await new Pool(PostgreSQLConfig)
    let queryResult = await connection.query(`select tokendevice
                                              from "User"
                                              where tokendevice is not null`)
    for (let item of queryResult.rows) {
        await sendNotification(title, message, item.tokendevice)
    }
}

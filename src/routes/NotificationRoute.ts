import {app} from "../app";
import {Request, Response, Application} from 'express'
import request from 'request'
import fs from "fs";
import admin from 'firebase-admin'
const FCM = require("fcm-node")


export async function sendNotification(title: string, message: string, token_device: string) {
    let fcm = new FCM("AAAALJ_ccVA:APA91bHSKeSsUrXamYbZoKeTlQL8DlgG6Dza3qefspOaHXKkGEPXYMkf0_US1vaad46b9nhGrEbzWRFclwnYeHWvkRGGrfWZhKIerD4IP_fvYAaPS6HWQkVOgMacGHb6cuM30OLiRMNJ")
    let sendBody = {
        data: {
            title: title,
            message: message
        },
        to: token_device
    }
    fcm.send(sendBody, (error : any, response : any)=> {
        if (error)
            console.log(error)
        console.log(response)
    })
}

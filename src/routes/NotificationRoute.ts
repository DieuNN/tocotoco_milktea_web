import {app} from "../app";
import {Request, Response, Application} from 'express'
import request from 'request'
import fs from "fs";


export async function sendNotification(title: string, message: string, token_device: string) {
    // app.post("https://fcm.gooogleapis.com/fcm/send", (req: Request, res: Response) => {
    //     console.log("???")
    //     req.header("Authorization : key=AAAALJ_ccVA:APA91bHSKeSsUrXamYbZoKeTlQL8DlgG6Dza3qefspOaHXKkGEPXYMkf0_US1vaad46b9nhGrEbzWRFclwnYeHWvkRGGrfWZhKIerD4IP_fvYAaPS6HWQkVOgMacGHb6cuM30OLiRMNJ")
    //     req.header("Content-Type: application/json")
    //
    //     req.body = {
    //         data: {
    //             title: title,
    //             message: message
    //         },
    //         to: token_device
    //     }
    //     console.log(req)
    //     console.log("Sending notification")
    //     res.send(req.body)
    //     console.log("Notification sent")
    //     console.log(res.json)
    // })
    let body = {
        data: {
            title: title,
            message: message
        },
        to: token_device
    }
    request({
        url: "https://fcm.gooogleapis.com/fcm/send",
        method: "post",
        headers: {
            "Authorization": "key=AAAALJ_ccVA:APA91bHSKeSsUrXamYbZoKeTlQL8DlgG6Dza3qefspOaHXKkGEPXYMkf0_US1vaad46b9nhGrEbzWRFclwnYeHWvkRGGrfWZhKIerD4IP_fvYAaPS6HWQkVOgMacGHb6cuM30OLiRMNJ",
            "Content-Type": "application/json",
            "User-Agent" : "Tocotea Server",
            "Host" : "https://fcm.googleapis.com",
            "Content-Length" : "291"
        },
        // strictSSL : false,
        // cert : fs.readFileSync("./cert.pem"),
        // key : fs.readFileSync("./key.pem"),
        // passphrase : "dieu",
        body: JSON.stringify(body)
    }, (error: any, response: any, body: any) => {
        if (error)
            console.error("That's error: " + error)
        console.log(body)
    })
}

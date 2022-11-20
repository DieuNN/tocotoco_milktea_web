import {Application, Request, Response} from "express";
import {getAllStatistical} from "../postgre";

export function homeRoute(app: Application) {

    app.get("/", (req: Request, res: Response) => {
        // /* Uncomment this and comment render line below*/
        // if (req.session.userid !== 'admin') {
        //     res.redirect("/login")
        // } else{
        //     res.render('index')
        // }
        getAllStatistical().then(r=> {
            res.render('index', {data : r.result})
        }).catch(e=> {
            res.end("Error in get statistical")
        })

    });
}

import {Application, Request, Response} from "express";
import {getAllStatistical} from "../postgre";
import {getOrders} from "../postgre/OrderDetails";

export function homeRoute(app: Application) {

    app.get("/", (req: Request, res: Response) => {
        /* Uncomment this and comment render line below*/
        // if (req.session.userid !== 'admin') {
        //     res.redirect("/login")
        // } else {

        getAllStatistical().then(r => {
            getOrders(null).then(r1=> {
                res.render('index', {data: r.result, orders : r1.result})
            })
        }).catch(e => {
            res.end("Error in get statistical")
        })
        // }
    });
}

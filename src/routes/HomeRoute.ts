import {Application, Request, Response} from "express";

export function homeRoute(app: Application) {

    app.get("/", (req: Request, res: Response) => {
        /* Uncomment this*/
        if (req.session.userid !== 'admin') {
            res.redirect("/login")
        } else{
            res.render('index')
        }
        res.render("index")
    });
}

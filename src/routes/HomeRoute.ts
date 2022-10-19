import {Application, Request, Response} from "express";

export function homeRoute(app: Application) {

    app.get("/", (req: Request, res: Response) => {
        /* Uncomment this and comment render line below*/
        if (req.session.userid !== 'admin') {
            res.redirect("/login")
        } else{
            res.render('index')
        }
        // res.render('product_category')
    });
}

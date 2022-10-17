import {Application, Request, Response} from "express";

export function logoutRoute(app: Application) {
    app.get("/logout", (req: Request, res: Response) => {
        req.session.destroy((err)=> {
            if (err)
                throw err
            else
                res.redirect("/")
        })
    })
}

import {Application, Request, Response} from "express";
import dotenv from "dotenv";
import {isAdminLogin} from "../mysql";
import {updateAdminLastLogin} from "../mysql/Admin";

dotenv.config({
    path: "process.env"
})

export function loginRoute(app: Application) {
    app.get("/login", (req: Request, res: Response) => {
        if (req.session.userid !== 'admin') {
            res.render("login", {isError: false})
        } else {
            res.redirect("/")
        }
    });
}


export function loginPostRoute(app: Application, session: any) {
    app.post("/login", async (req: Request, res: Response) => {
            const {username, password} = req.body
            const isLoginValid = await isAdminLogin(username, password, req.clientIp)
            await updateAdminLastLogin()
            if (isLoginValid) {
                session = req.session
                session.userid = username
                req.session.save()
                res.redirect("/")
            } else {
                res.render("login", {isError: true})
            }
        }
    )
}

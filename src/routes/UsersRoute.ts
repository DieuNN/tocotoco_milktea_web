import {Application, Request, Response} from "express";
import {getUsers} from "../postgre";
import {updateUserActiveStatus} from "../postgre/User";


export function usersRoute(app: Application) {

    app.get("/users", (req: Request, res: Response) => {
        getUsers().then(r => {
            res.render("users", {users: r.result})
        })
    });
    app.post("/users/active", (req: Request, res: Response) => {
        updateUserActiveStatus(req.body.id).then(r=> {
            res.redirect("/users")
        })
    })

}

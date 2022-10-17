import {Application} from 'express'
import {getLog} from "../mysql/Admin";

export function adminLoginLogRoute(app: Application) {
    app.get('/log', async (req, res) => {
        if (req.session.userid === 'admin') {
            let data = await getLog()
            // @ts-ignore
            console.log(data)
            res.render('login_log', {data : data})
        } else {
            res.redirect('/login')
        }
    })
}

import {Application, Response, Request} from 'express';
import multer from "multer";

export function productCategoryRoute(app: Application) {
    // const upload = multer({
    //     storage : multer.memoryStorage()
    // })
    app.get('/category', (req: Request, res: Response) => {
        // if (req.session.userid === 'admin') {
        //     res.render('product_category')
        // } else {
        //     res.redirect('/login')
        // }
        res.render('product_category')
    })

    app.post("/add_category", (req: Request, res: Response) => {
        console.log(req.body)
        res.end("HI")
    })
}

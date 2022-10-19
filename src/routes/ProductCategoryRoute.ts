import {Application, Response, Request} from 'express';
export function productCategoryRoute(app : Application) {
    app.get('/category', (req : Request, res : Response)=> {
        if (req.session.userid === 'admin') {
            res.render('product_category')
        } else {
            res.redirect('/login')
        }
    })
}

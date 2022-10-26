import {Application, Request, Response} from "express";
import {
    createUser,
    getDiscounts,
    getProductCategories,
    getProductCategory,
    getUsers,
    getUserLoginInfo,
    getUser, getProducts, getProduct
} from "../postgre";
import {getUserId} from "../postgre/User";

export function API(app: Application) {
    app.get("/api/product_categories", async (req: Request, res: Response) => {
        getProductCategories().then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/users", (req: Request, res: Response) => {
        const result = getUsers()
        result.then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/user_info", async (req: Request, res: Response) => {
        const {id} = req.body
        getUser(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/user_id", async (req: Request, res: Response) => {
        const {username} = req.body
        getUserId(username).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/product_category", async (req: Request, res: Response) => {
        getProductCategory(req.body.id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/discounts", async (req: Request, res: Response) => {
        getDiscounts().then(r => {
            res.end(r)
        }).catch(e => {
            res.end(e)
        })
    })
    app.get('/api/login', async (req: Request, res: Response) => {
        const {username, password, type} = req.body
        getUserLoginInfo(username, password, type).then(r => {
            res.json(r)

        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post('/api/signup', async (req: Request, res: Response) => {
        const {username, password, email, phoneNumber, name} = req.body
        createUser({
            username: username,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
            name: name,
            id: null,
            createAt: null,
            modifiedAt: null
        }).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/products", (req: Request, res: Response) => {
        getProducts().then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/product", (req, res: Response) => {
        const {id} = req.body
        getProduct(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })


}

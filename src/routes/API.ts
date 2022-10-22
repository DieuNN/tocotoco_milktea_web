import {Application, Request, Response} from "express";
import {
    createUser,
    getDiscounts,
    getProductCategories,
    getProductCategory,
    getUsers,
    getUserLoginInfo,
    getUser
} from "../mysql";
import {getUserId} from "../mysql/User";

export function API(app: Application) {
    app.get("/api/product_categories", async (req: Request, res: Response) => {
        const result = await getProductCategories()
        res.json(result)
    })
    app.get("/api/users", async (req: Request, res: Response) => {
        const result = await getUsers()
        res.json(result)
    })
    app.get("/api/user_info", async (req: Request, res: Response) => {
        const {id} = req.body
        let result = await getUser(id)
        res.json(result)
    })
    app.get("/api/user_id", async (req: Request, res: Response) => {
        const {username} = req.body
        let result = await getUserId(username)
        res.json(result)
    })
    app.get("/api/product_category", async (req: Request, res: Response) => {
        const result = await getProductCategory(req.body.id)
        res.json(result)
    })
    app.get("/api/discounts", async (req: Request, res: Response) => {
        const result = await getDiscounts()
        res.json(result)
    })
    app.get('/api/login', async (req: Request, res: Response) => {
        const {username, password, type} = req.body
        const result = await getUserLoginInfo(username, password, type)
        res.json(result)
    })
    app.post('/api/signup', async (req: Request, res: Response) => {
        const {username, password, email, phoneNumber, name} = req.body
        const result = await createUser({
            username: username,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
            name: name,
            id: null,
            createAt: null,
            modifiedAt: null
        })
        res.json(result)
    })

}

import {Application, Request, Response} from "express";
import {
    createUser,
    getDiscounts,
    getProductCategories,
    getProductCategory,
    getUsers,
    getUserLoginInfo,
    getUser,
    getProducts,
    getProduct,
    getDiscount,
    updateUserInfo,
    updateUserPassword,
    updateUserAddress,
    createShoppingSession, addItemToCart, deleteShoppingSession
} from "../postgre";
import {getUserAddress, getUserId} from "../postgre/User";
import {getProductsByCategoryId} from "../postgre/Product";

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
    app.post("/api/update_user_info", (req: Request, res: Response) => {
        const {id, name, username, email, phoneNumber} = req.body
        updateUserInfo(id, {
            id: null,
            username: username,
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: null,
            modifiedAt: null,
            createAt: null
        }).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })

    app.post("/api/update_user_password", (req: Request, res: Response) => {
        const {id, oldPassword, newPassword} = req.body
        updateUserPassword(id, oldPassword, newPassword).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e)
        })
    })
    app.post("/api/update_user_address", (req: Request, res: Response) => {
        const {id, address, phoneNumber} = req.body
        updateUserAddress(id, {
            id: null,
            address: address,
            phoneNumber: phoneNumber,
            userId: null
        }).then(r => {
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
    app.get("/api/user_address", (req: Request, res: Response) => {
        const {id} = req.body
        getUserAddress(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.get("/api/product_category", (req: Request, res: Response) => {
        const {id} = req.body
        console.log("This is test " + 101)
        // @ts-ignore
        console.log(req)
        // console.log(id)
        // res.end("???")
        getProductCategory(Number(id)).then(r => {
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
    app.get("/api/discount", (req: Request, res: Response) => {
        const {id} = req.body
        getDiscount(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
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
    app.get("/api/get_products_by_category", (req: Request, res: Response) => {
        const {categoryId} = req.body
        getProductsByCategoryId(categoryId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/create_session", (req: Request, res: Response) => {
        const {userId} = req.body
        createShoppingSession(userId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/delete_session", (req: Request, res: Response) => {
        const {userId, sessionId} = req.body
        deleteShoppingSession(userId, sessionId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/add_item", (req: Request, res: Response) => {
        const {sessionId, productId, quantity} = req.body
        addItemToCart(sessionId, productId, quantity).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/remove_item", (req: Request, res: Response) => {
        // const
    })


}

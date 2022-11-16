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
    createShoppingSession,
    addItemToCart,
    deleteShoppingSession,
    getCartItems,
    removeItemFromCart,
    getLovedItems,
    createException
} from "../postgre";
import {getUserAddress, getUserId} from "../postgre/User";
import {getProductsByCategoryId} from "../postgre/Product";
import {updateCartItem} from "../postgre/CartItem";
import {getCartInfo, getUserSessionId} from "../postgre/ShoppingSession";
import {confirmOrder, getItemsInOrder, getOrderDetail, getUserOrders} from "../postgre/OrderDetails";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {addLovedItem, deleteLovedItem} from "../postgre/LovedProducts";

dotenv.config({
    path: "process.env"
})

export function API(app: Application) {
    app.post("/api/product_categories", async (req: Request, res: Response) => {
        getProductCategories().then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    // TODO: Should we need this?
    app.post("/api/users", (req: Request, res: Response) => {
        const result = getUsers()
        result.then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/user_info", async (req: Request, res: Response) => {
        const {token} = req.body
        getUser(token).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/update_user_info", (req: Request, res: Response) => {
        const {token, name, username, email, phoneNumber} = req.body
        for (let item of [token, name, username, email, phoneNumber]) {
            if (item == undefined) {
                res.json(createException("Du lieu nhap vao khong dung"))
                return
            }
        }
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
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
        const {token, oldPassword, newPassword} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
        updateUserPassword(id, oldPassword, newPassword).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/update_user_address", (req: Request, res: Response) => {
        const {token, address, phoneNumber} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
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
    // TODO: Should we need this?
    app.post("/api/user_id", async (req: Request, res: Response) => {
        const {username, token} = req.body
        getUserId(username, token).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })

    app.post("/api/user_address", (req: Request, res: Response) => {
        const {token} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
        getUserAddress(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/product_category", (req: Request, res: Response) => {
        const {id} = req.body
        console.log("This is test " + 101)
        console.log(req.body)
        getProductCategory(Number(id)).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/discounts", async (req: Request, res: Response) => {
        getDiscounts().then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
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
    app.post('/api/login', async (req: Request, res: Response) => {
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
    app.post("/api/products", (req: Request, res: Response) => {
        getProducts().then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/product", (req, res: Response) => {
        const {id} = req.body
        getProduct(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/get_products_by_category", (req: Request, res: Response) => {
        const {categoryId} = req.body
        getProductsByCategoryId(categoryId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/get_session_id", (req: Request, res: Response) => {
        const {token} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
        getUserSessionId(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/create_session", (req: Request, res: Response) => {
        const {token} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
        createShoppingSession(id).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/delete_session", (req: Request, res: Response) => {
        const {token, sessionId} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        deleteShoppingSession(userId, sessionId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/get_cart_info", (req: Request, res: Response) => {
        const {token, sessionId} = req.body
        const {id} = jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload
        getCartInfo(id, sessionId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/add_item", (req: Request, res: Response) => {
        const {token, sessionId, productId, quantity, size} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        addItemToCart(userId, sessionId, productId, quantity, size).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/delete_item", (req: Request, res: Response) => {
        const {token, itemId, sessionId} = req.body
        if (token == undefined) {
            res.end("Provide token!")
            return
        }
        removeItemFromCart(itemId, sessionId).then(r => {
            res.json(r);
        }).catch(e => {
            res.end(e.toString())
        })
    });

    app.post("/api/shopping_session/items", (req: Request, res: Response) => {
        const {token, sessionId} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        getCartItems(userId, sessionId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    // I don't even know what did I write XD
    app.post("/api/shopping_session/update_item", (req: Request, res: Response) => {
        const {token, sessionId, productId, quantity, size} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        updateCartItem(userId, sessionId, productId, quantity, size).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })

    app.post("/api/order/confirm_order", (req: Request, res: Response) => {
        const {token, sessionId, provider, phoneNumber, address} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        confirmOrder(userId, sessionId, provider, phoneNumber, address).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/order/get_user_orders", (req: Request, res: Response) => {
        const {token} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        getUserOrders(userId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/order/get_order_detail", (req: Request, res: Response) => {
        const {token, orderId} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        getOrderDetail(userId, orderId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/order/get_items", (req: Request, res: Response) => {
        const {token, orderId} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        getItemsInOrder(orderId, userId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    // FAV Items
    app.post("/api/fav/items", (req: Request, res: Response) => {
        const {token} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        console.log(userId)
        getLovedItems(userId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/fav/add", (req: Request, res: Response) => {
        const {token, productId} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        addLovedItem(userId, productId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/fav/delete", (req: Request, res: Response) => {
        const {token, productId} = req.body
        const userId = (jwt.verify(token, process.env.JWT_SCRET!) as JWTPayload).id
        deleteLovedItem(userId, productId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
}

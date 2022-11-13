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
    createShoppingSession, addItemToCart, deleteShoppingSession, getCartItems, removeItemFromCart
} from "../postgre";
import {getUserAddress, getUserId} from "../postgre/User";
import {getProductsByCategoryId} from "../postgre/Product";
import {updateCartItemQuantity} from "../postgre/CartItem";
import {getCartInfo, getUserSessionId} from "../postgre/ShoppingSession";
import {confirmOrder, getItemsInOrder, getOrderDetail, getUserOrders} from "../postgre/OrderDetails";

export function API(app: Application) {
    app.post("/api/product_categories", async (req: Request, res: Response) => {
        getProductCategories().then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/users", (req: Request, res: Response) => {
        const result = getUsers()
        result.then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/user_info", async (req: Request, res: Response) => {
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
            res.end(e.toString())
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
    app.post("/api/user_id", async (req: Request, res: Response) => {
        const {username} = req.body
        getUserId(username).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/user_address", (req: Request, res: Response) => {
        const {id} = req.body
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
        const {userId} = req.body
        getUserSessionId(userId).then(r => {
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
    app.post("/api/shopping_session/get_cart_info", (req: Request, res: Response) => {
        const {sessionId} = req.body
        getCartInfo(sessionId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/add_item", (req: Request, res: Response) => {
        const {userId, sessionId, productId, quantity, size} = req.body
        addItemToCart(userId, sessionId, productId, quantity, size).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/remove_item", (req: Request, res: Response) => {
        const {itemId, sessionId} = req.body
        removeItemFromCart(itemId, sessionId).then(r => {
            res.json(r);
            ``
        }).catch(e => {
            res.end(e.toString())
        })
    });

    app.post("/api/shopping_session/items", (req: Request, res: Response) => {
        const {sessionId} = req.body
        getCartItems(sessionId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/shopping_session/update_item", (req: Request, res: Response) => {
        const {sessionId, productId, quantity} = req.body
        updateCartItemQuantity(sessionId, productId, quantity).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })

    app.post("/api/order/confirm_order", (req: Request, res: Response) => {
        const {userId, sessionId, provider, phoneNumber, address} = req.body
        confirmOrder(userId, sessionId, provider, phoneNumber, address).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/order/get_user_orders", (req: Request, res: Response) => {
        getUserOrders(req.body.userId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/order/get_order_detail", (req: Request, res: Response) => {
        const {orderId, userId} = req.body
        getOrderDetail(userId, orderId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })
    app.post("/api/order/get_items", (req: Request, res: Response) => {
        getItemsInOrder(req.body.orderId, req.body.userId).then(r => {
            res.json(r)
        }).catch(e => {
            res.end(e.toString())
        })
    })

}

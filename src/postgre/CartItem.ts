import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/debug";
import {createException, createResult} from "./index";
import {updateProductQuantity} from "./Product";

export async function addItemToCart(sessionId: number, productId: number, quantity: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const productQuantity = await connection.query(`select quantity
                                                        from "Product"
                                                        where id = ${productId}`)
        if (productQuantity.rows.length === 0) {
            return createException("Khong thay san pham voi ID la " + productId);
        } else {
            if (productQuantity.rows[0] < quantity) {
                return createException("Het hang")
            } else {
                await connection.query(`insert into "CartItem"
                                        values (default,
                                                ${sessionId},
                                                ${productId},
                                                ${quantity})`)
                await updateProductQuantity(productId, productQuantity.rows[0].quantity - quantity)
                return createResult(true)
            }
        }
    } catch (e) {
        return createException(e)
    }
}

export async function removeItemFromCart(itemId: number, sessionId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`delete
                                               from "CartItem"
                                               where id = ${itemId}
                                                 and sessionid = ${sessionId}`)
        if (result.rowCount === 1) {
            return createResult(true)
        } else {
            return createException("Khong tim thay ID")
        }
    } catch (e) {
        return createException(e)
    }
}

export async function updateCartItemQuantity(itemId: number, amount: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const productQuantity = await connection.query(`select quantity
                                                        from "Product"`)
        if (productQuantity.rows[0].quantity + amount < 0) {
            return createException("So luong cap nhat khong hop le!")
        } else {
            await connection.query(`update "CartItem"
                                    set quantity = ${amount}
                                    where id = ${itemId}`)
            return createResult(true)
        }
    } catch (e) {
        return createException(e)
    }
}

export async function getCartItems(sessionId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "CartItem"
                                               where sessionid = ${sessionId}`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}



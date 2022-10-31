import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/debug";
import {createException, createResult} from "./index";

export async function addItemToCart(sessionId: number, productId: number, quantity: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const productQuantity = await connection.query(`select quantity
                                                        from "Product"
                                                        where id = ${productId}`)
        // console.log(productQuantity)
        if (productQuantity.rows.length === 0) {
            return createException("Khong thay san pham voi ID la " + productId);
        } else {
            if (quantity > productQuantity.rows[0].quantity) {
                return createException("So luong khong hop le! Kho con " + productQuantity.rows[0].quantity + ", so luong nhap: " + quantity)
            }
            // if item in cart, update quantity
            let _isItemInTempCart = await isItemInTempCart(productId, sessionId)
            if (_isItemInTempCart.isSuccess) {
                // await updateCartItemQuantity()
            }

            let insertResult = await connection.query(`insert into "CartItem"
                                                       values (default,
                                                               ${sessionId},
                                                               ${productId},
                                                               ${quantity})`)
            if (insertResult.rowCount === 1) {
                return createResult(true)
            } else {
                return createException("Them san pham bi loi")
            }
        }
    } catch (e) {
        return createException(e)
    }
}

export async function isItemInTempCart(productId: number, sessionId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select count(*)
                                             from "CartItem"
                                             where productid = ${productId}
                                               and sessionid = ${sessionId}`)
        if (result.rows[0].count === 0) {
            return createResult(false)
        } else {
            return createException(true)
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

// export async function updateCartItemQuantity(sessionId: number, productId: number, quantity: number): Promise<APIResponse> {
//     try {
//         const connection = await new Pool(PostgreSQLConfig)
//         const productQuantity = await connection.query(`select quantity
//                                                         from "Product"
//                                                         where id = ${productId}`)
//         if (productQuantity.rows.length === 0) {
//             return createException("Khong tim thay san pham co ID la " + productId)
//         } else {
//             if (quantity > productQuantity.rows[0].quantity) {
//                 return createException("So luong khong hop le! Kho con " + productQuantity.rows[0].quantity + ", so luong nhap: " + quantity)
//             }
//             let result = await connection.query(`update "CartItem"
//                                                  set quantity = ${quantity}
//                                                  where sessionid = ${sessionId}
//                                                    and productid = ${productId}`)
//             /*TODO*/
//             if (result.)
//         }
//
//         // const result = await connection.query(`update "CartItem"
//         //                                        set quantity =  ${quantity}`)
//     } catch (e) {
//         return createException(e)
//     }
// }

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





import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult, deleteShoppingSession} from "./index";
import {createPaymentDetail} from "./PaymentDetails";
import {addCartItemsToOrder} from "./OrderItem";
import {getUserSessionId} from "./ShoppingSession";

/* Move temporary cart to order details, cuz ppl confirmed buying */

export async function confirmOrder(userId: number, sessionId: number, provider: string): Promise<APIResponse> {
    try {
        /*Check if session exist?*/
        let _isSessionExist = await getUserSessionId(userId)
        if (!_isSessionExist.isSuccess) {
            return createException("Gio hang khong ton tai!")
        }
        await createOrder(userId, sessionId, provider);
        await deleteShoppingSession(userId, sessionId)

        return createResult(true)
    } catch (e) {
        return createException(e)
    }
}



export async function createOrder(userId: number, sessionId: number, provider: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let orderId = await createEmptyOrder(userId)
        let paymentId = await createPaymentDetail(orderId, provider, "Pending")
        await updatePaymentId(orderId, paymentId)
        await addCartItemsToOrder(orderId, sessionId)
        connection.end()
        return createResult(true)
    } catch (e) {
        return createException(e)
    }
}

async function updatePaymentId(orderId: number, paymentId: number) {
    const connection = await new Pool(PostgreSQLConfig)
    await connection.query(`update "OrderDetail"
                            set paymentid = ${paymentId}
                            where id = ${orderId}`)

}

export async function getUserOrders(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select *
                                             from "OrderDetail"
                                             where userid = ${userId}`)

        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function getOrderDetail(orderId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "OrderDetail"
                                               where id = ${orderId}`)
        if (result.rowCount != 1) {
            return createException("Khong tim thay order " + orderId)
        } else {
            return createResult(result.rows[0])
        }
    } catch (e) {
        return createException(e)
    }
}

export async function createEmptyOrder(userId: number): Promise<number> {
    const connection = await new Pool(PostgreSQLConfig)
    let result = await connection.query(`insert into "OrderDetail" (id, userid, total, paymentid, createat, modifiedat)
                                         values (default, ${userId}, 0, null, now(), now())
                                         returning id`)
    return result.rows[0].id
}

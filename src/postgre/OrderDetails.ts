import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult, deleteShoppingSession} from "./index";
import {createPaymentDetail} from "./PaymentDetails";
import {addCartItemsToOrder} from "./OrderItem";
import {getUserSessionId} from "./ShoppingSession";

/* Move temporary cart to order details, cuz ppl confirmed buying */

export async function confirmOrder(userId: number, sessionId: number, provider: string, phoneNumber: string, address: string): Promise<APIResponse> {
    try {
        /*Check if session exist?*/
        let _isSessionExist = await getUserSessionId(userId)
        if (!_isSessionExist.isSuccess) {
            return createException("Gio hang khong ton tai!")
        }

        let orderId = await createOrder(userId, sessionId, provider, phoneNumber, address).then()
        deleteShoppingSession(userId, sessionId).then()
        updateProductInventory(orderId, userId).then()

        return createResult(true)
    } catch (e) {
        return createException(e)
    }
}

export async function updateProductInventory(orderId: number, userId: number) {
    const connection = await new Pool(PostgreSQLConfig)
    let productsId = await connection.query(`select productid, quantity
                                             from "OrderDetail"
                                                      inner join "OrderItem" OI on "OrderDetail".id = OI.orderid
                                             where orderid = ${orderId}
                                               and userid = ${userId};`)
    for (let item of productsId.rows) {
        connection.query(`update "Product"
                          set quantity = quantity - ${item.quantity}
                          where id = ${item.productid}`)
    }
    connection.end()
    console.log(productsId)
}

async function createOrder(userId: number, sessionId: number, provider: string, phoneNumber: string, address: string): Promise<any> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let orderId = await createEmptyOrder(userId)
        let paymentId = await createPaymentDetail(orderId, provider, "Pending", phoneNumber, address)
        updatePaymentId(orderId, paymentId).then()
        addCartItemsToOrder(orderId, sessionId, userId).then()
        connection.end()
        return orderId
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
        let result = await connection.query(`select "OrderDetail".id,
                                                    round(total)           as total,
                                                    "OrderDetail".createat as createat,
                                                    status,
                                                    provider,
                                                    address,
                                                    "phoneNumber"
                                             from "OrderDetail"
                                                      inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                             where userid = ${userId}
                                             order by createat desc;`)
        result.rows.map(item => {
            item.createat = new Date(item.createat).toLocaleString("vi-VN")
        })
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

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
}

async function createOrder(userId: number, sessionId: number, provider: string, phoneNumber: string, address: string): Promise<any> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let orderId = await createEmptyOrder(userId)
        let paymentId = await createPaymentDetail(orderId, provider, "Pending", phoneNumber, address)
        await updatePaymentId(orderId, paymentId)
        await addCartItemsToOrder(orderId, sessionId, userId)
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
                                                    round(total)  as total,
                                                    "OrderDetail".createat,
                                                    status,
                                                    provider,
                                                    address,
                                                    "phoneNumber",
                                                    sum(quantity) as "totalProduct"
                                             from "OrderDetail"
                                                      inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                      inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                             where userid = ${userId}
                                             group by "OrderDetail".id, total, "OrderDetail".createat, status, provider,
                                                      address, "phoneNumber"
                                             order by createat desc;`)
        result.rows.map(item => {
            item.createat = new Date(item.createat).toLocaleString("vi-VN")
        })
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function getOrderDetail(userId: number, orderId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select "OrderDetail".id,
                                                      round(total)  as total,
                                                      "OrderDetail".createat,
                                                      status,
                                                      provider,
                                                      address,
                                                      "phoneNumber",
                                                      sum(quantity) as "totalProduct"
                                               from "OrderDetail"
                                                        inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                        inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                               where userid = ${userId}
                                                 and "OrderDetail".id = ${orderId}
                                               group by "OrderDetail".id, total, "OrderDetail".createat, status,
                                                        provider,
                                                        address, "phoneNumber"
                                               order by createat desc;`)
        if (result.rowCount != 1) {
            return createException("Khong tim thay order " + orderId)
        } else {
            return createResult(result.rows[0])
        }
    } catch (e) {
        return createException(e)
    }
}

export async function getItemsInOrder(orderId: number, userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select "OrderItem".id               as "id",
                                                    orderid                      as "orderId",
                                                    productid                    as "productId",
                                                    "OrderItem".quantity         as "quantity",
                                                    P.name                       as "productName",
                                                    P.description                as "description",
                                                    price * "OrderItem".quantity as total,
                                                    P.price                      as price,
                                                    "ProductCategory".name       as "productCategoryName",
                                                    P.displayimage               as "displayImage",
                                                    "OrderItem".size             as "size",
                                                    pricebeforediscount          as "priceBeforeDiscount",
                                                    priceafterdiscount           as "priceAfterDiscount"
                                             from "OrderItem"
                                                      inner join "Product" P on P.id = "OrderItem".productid
                                                      inner join "ProductCategory" on P.categoryid = "ProductCategory".id
                                                      inner join "OrderDetail" on "OrderItem".orderid = "OrderDetail".id
                                             where orderid = ${orderId}
                                               and userid = ${userId};`)
        return createResult(result.rows)
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

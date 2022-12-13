import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult, deleteShoppingSession} from "./index";
import {createPaymentDetail, updatePaymentDetailStatus} from "./PaymentDetails";
import {addCartItemsToOrder} from "./OrderItem";
import {getUserSessionId} from "./ShoppingSession";
import {getUserTokenDevice} from "./User";
import {sendNotification} from "../routes/NotificationRoute";

/* Move temporary cart to order details, cuz ppl confirmed buying */

export async function confirmOrder(userId: number, sessionId: number, provider: string, phoneNumber: string, address: string, note?: string | null): Promise<APIResponse> {
    try {
        if (note == undefined) {
            note = ""
        }
        /*Check if session exist?*/
        let _isSessionExist = await getUserSessionId(userId)
        if (!_isSessionExist.isSuccess) {
            return createException("Gio hang khong ton tai!")
        }
        let userCurrentOrder = await getUserCurrentOrder(userId)
        if (!userCurrentOrder.isSuccess || userCurrentOrder.result != null) {
            return createException("Bạn có đơn hàng chưa hoàn thành nên chưa thể tiếp tục đặt đơn")
        }

        console.log("Enter create order")
        let orderId = await createOrder(userId, sessionId, provider, phoneNumber, address, note).then()
        console.log("End create order")
        await deleteShoppingSession(userId, sessionId).then().catch()
        await updateProductInventory(orderId, userId).then().catch()
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

async function createOrder(userId: number, sessionId: number, provider: string, phoneNumber: string, address: string, note: string): Promise<any> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        console.log("Enter create empty order")
        let orderId = await createEmptyOrder(userId)
        console.log("End create empty order")
        let paymentId = await createPaymentDetail(orderId, provider, "Đợi xác nhận", phoneNumber, address, note)
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
                                                    round(total)              as total,
                                                    "OrderDetail".createat,
                                                    status,
                                                    provider,
                                                    address,
                                                    phonenumber               as "phoneNumber",
                                                    sum("OrderItem".quantity) as "totalProduct",
                                                    displayimage              as "displayImage"
                                             from "OrderDetail"
                                                      inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                      inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                                      inner join "Product" P on "OrderItem".productid = P.id
                                             where userid = ${userId}
                                             group by "OrderDetail".id, total, "OrderDetail".createat, status, provider,
                                                      address, "phoneNumber", displayimage
                                             order by createat desc;`)
        result.rows.map(item => {
            item.createat = new Date(item.createat).toLocaleString("vi-VN")
        })
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function getUserCompletedOrders(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select "OrderDetail".id,
                                                    round(total)  as total,
                                                    "OrderDetail".createat,
                                                    status,
                                                    provider,
                                                    address,
                                                    phonenumber   as "phoneNumber",
                                                    sum(quantity) as "totalProduct"
                                             from "OrderDetail"
                                                      inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                      inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                             where userid = ${userId}
                                               and (status like 'Bị hủy' or status like 'Hoàn thành')
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
                                                      phonenumber   as "phoneNumber",
                                                      sum(quantity) as "totalProduct",
                                                      PD.note       as "note"
                                               from "OrderDetail"
                                                        inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                        inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                               where userid = ${userId}
                                                 and "OrderDetail".id = ${orderId}
                                               group by "OrderDetail".id, total, "OrderDetail".createat, status,
                                                        provider,
                                                        address, "phoneNumber", PD.note
                                               order by createat desc;`)
        let items = await getItemsInOrder(orderId, userId)
        result.rows[0].displayImage = items.result[0].displayImage
        console.log(result.rows[0])
        if (result.rowCount != 1) {
            return createException("Khong tim thay order " + orderId)
        } else {
            return createResult(result.rows[0])
        }
    } catch (e) {
        return createException(e)
    }
}

export async function adminGetOrderDetails(orderId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select "OrderDetail".id,
                                                      round(total)  as total,
                                                      "OrderDetail".createat,
                                                      status,
                                                      provider,
                                                      address,
                                                      phonenumber   as "phoneNumber",
                                                      sum(quantity) as "totalProduct"
                                               from "OrderDetail"
                                                        inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                        inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                               where "OrderDetail".id = ${orderId}
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
                                                    priceafterdiscount           as "priceAfterDiscount",
                                                    note                         as "note"
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

export async function adminGetItemsInOrder(orderId: number): Promise<APIResponse> {
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
                                                    round(pricebeforediscount)   as "priceBeforeDiscount",
                                                    round(priceafterdiscount)    as "priceAfterDiscount",
                                                    note                         as "note"
                                             from "OrderItem"
                                                      inner join "Product" P on P.id = "OrderItem".productid
                                                      inner join "ProductCategory" on P.categoryid = "ProductCategory".id
                                                      inner join "OrderDetail" on "OrderItem".orderid = "OrderDetail".id
                                             where orderid = ${orderId}`)
        connection.end()
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function createEmptyOrder(userId: number): Promise<any> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`insert into "OrderDetail" (id, userid, total, paymentid, createat, modifiedat)
                                             values (default, ${userId}, 0, null, now(), now())
                                             returning id`)
        console.log(result.rows)
        return result.rows[0].id
    } catch (e) {
        console.log(e)
        return 0
    }
}


export async function getOrders(type: string | null): Promise<APIResponse> {
    try {
        if (type == null) type = "%%"
        const connection = await new Pool(PostgreSQLConfig)
        let orders = await connection.query(`select "OrderItem".orderid        as "orderId",
                                                    PD.id                      as "paymentId",
                                                    U.name                     as "username",
                                                    U.id                       as "userId",
                                                    PD.phonenumber             as "phoneNumber",
                                                    status                     as "status",
                                                    P.name                     as "productName",
                                                    round(pricebeforediscount) as "priceBeforeDiscount",
                                                    round(priceafterdiscount)  as "priceAfterDiscount",
                                                    "OrderItem".quantity       as "quantity",
                                                    PD.address                 as "address",
                                                    PD.modifiedat              as "time",
                                                    "OrderItem".note           as "note",
                                                    provider                   as "provider"
                                             from "OrderItem"
                                                      inner join "Product" P on P.id = "OrderItem".productid
                                                      inner join "ProductCategory" on P.categoryid = "ProductCategory".id
                                                      inner join "OrderDetail" on "OrderItem".orderid = "OrderDetail".id
                                                      inner join "User" U on U.id = "OrderDetail".userid
                                                      inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                             where "OrderItem".orderid in (select "OrderDetail".id
                                                                           from "OrderDetail"
                                                                                    inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                                                                    inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid)
                                               and status like '${type}'
                                             order by PD.modifiedat desc `)
        const map = new Map()
        for (let element of orders.rows) {
            if (map.get(element.orderId) == undefined) {
                map.set(element.orderId, {
                    username: element.username,
                    phoneNumber: element.phoneNumber,
                    status: element.status,
                    productName: [element.productName],
                    orderId: element.orderId,
                    paymentId: element.paymentId,
                    priceBeforeDiscount: element.priceBeforeDiscount,
                    priceAfterDiscount: element.priceAfterDiscount,
                    quantity: element.quantity,
                    address: element.address,
                    time: element.time,
                    userId: element.userId,
                    note: element.note,
                    provider : element.provider
                })
            } else {
                let temp = map.get(element.orderId)
                let array = temp.productName
                array.push(element.productName)
                map.set(element.orderId, {
                    username: element.username,
                    phoneNumber: element.phoneNumber,
                    status: element.status,
                    productName: array,
                    orderId: element.orderId,
                    paymentId: element.paymentId,
                    address: element.address,
                    time: element.time,
                    userId: element.userId,
                    note: element.note,
                    provider : element.provider
                })
            }
        }

        let dumpResult = []
        for (let [key, value] of map) {
            let tempObj: any = {}
            tempObj.orderId = key
            tempObj.username = value.username
            tempObj.status = value.status
            tempObj.items = value.productName
            tempObj.phoneNumber = value.phoneNumber
            let detail = await adminGetItemsInOrder(key)
            let total = await adminGetOrderDetails(key)
            tempObj.total = total.result.total
            tempObj.detail = detail.result
            tempObj.address = value.address
            tempObj.paymentId = value.paymentId
            tempObj.time = value.time
            tempObj.userId = value.userId
            tempObj.note = value.note
            tempObj.provider = value.provider
            dumpResult.push(tempObj)
        }
        connection.end()

        dumpResult.map(element => {
            element.time = new Date(element.time).toLocaleString("vi-VN")
        })

        return createResult(dumpResult)
    } catch (e) {
        return createException(e)
    }
}

export async function getUserCurrentOrder(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select orderid       as "orderId",
                                                    round(total)  as "total",
                                                    paymentid     as "paymentId",
                                                    PD.createat   as "createAt",
                                                    PD.modifiedat as "modifiedAt",
                                                    status        as "status",
                                                    provider      as "provider",
                                                    address       as "address",
                                                    phonenumber   as "phoneNumber"
                                             from "OrderDetail"
                                                      inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                             where userid = ${userId}
                                               and (status = 'Đợi xác nhận' or status = 'Đang giao')
                                             order by PD.modifiedat desc;`)
        if (result.rows.length == 0) {
            return createException("Bạn hiện tại chưa có đơn hàng nào!")
        }
        return createResult(result.rows[0])
    } catch (e) {
        return createException(e)
    }
}

export async function deleteOrder(orderId: number, paymentId: number) {
    const connection = await new Pool(PostgreSQLConfig)
    await connection.query(`delete
                            from "OrderDetail"
                            where id = ${orderId}
                              and paymentid = ${paymentId}`)
    await connection.query(`delete
                            from "PaymentDetails"
                            where id = ${paymentId}`)
}

async function getPaymentId(orderId: number): Promise<number | null> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select paymentid as "paymentId"
                                               from "OrderDetail"
                                               where id = ${orderId}
                                               limit 1`)
        if (result.rowCount != 1) {
            return null
        }
        console.log(result.rows)
        connection.end();
        return result.rows[0].paymentId
    } catch (e) {
        return null
    }
}

export async function userCancelOrder(userId: number, orderId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let paymentId = await getPaymentId(orderId)
        if (paymentId == null) {
            return createException("Không tìm thấy order của bạn")
        }
        let result = await connection.query(`update "PaymentDetails"
                                             set status     = 'Bị hủy',
                                                 modifiedat = now()
                                             where id = ${paymentId}
                                               and orderid = ${orderId}
                                               and status like 'Đợi xác nhận'`)
        console.log(result.rows)
        if (result.rowCount != 1) {
            return createException("Bạn không thể hủy đơn này!")
        }
        return createResult("Hủy thành công!")
    } catch (e) {
        return createException(e)
    }
}

import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, removeItemFromCart} from "./index";

export async function addCartItemsToOrder(orderId: number, sessionId: number, userId: number) {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let sessionResult = await connection.query(`select productid                   as "productId",
                                                           "CartItem".quantity         as "quantity",
                                                           price * "CartItem".quantity as "priceBeforeDiscount",
                                                           price * "CartItem".quantity -
                                                           (price * "CartItem".quantity * D.discountpercent) /
                                                           100                         as "priceAfterDiscount",
                                                           "CartItem".size
                                                    from "CartItem"
                                                             inner join "Product" P on P.id = "CartItem".productid
                                                             inner join "ProductCategory" on P.categoryid = "ProductCategory".id
                                                             left outer join "Discount" D on P.discountid = D.id

                                                    where sessionid = ${sessionId};`)
        for (const item of sessionResult.rows) {
            let hey = await connection.query(`insert into "OrderItem" (id, orderid, productid, quantity, createat,
                                                                       modifiedat, size, pricebeforediscount,
                                                                       priceafterdiscount)
                                              values (default, ${orderId}, ${item.productId}, ${item.quantity}, now(),
                                                      now(), '${item.size}', ${item.priceBeforeDiscount},
                                                      ${item.priceAfterDiscount})`)
        }
        updateOrderDetailTotal(orderId, userId).then()
    } catch (e) {
        console.log(e)
    }
}

async function updateOrderDetailTotal(orderId: number, userId: number) {
    const connection = await new Pool(PostgreSQLConfig)
    connection.query(`with total_sum as (select sum(priceafterdiscount)
                                         from "OrderDetail"
                                                  inner join "OrderItem" on "OrderDetail".id = "OrderItem".orderid
                                         where "OrderDetail".id = 43)
                      update "OrderDetail"
                      set total = total_sum.sum
                      from total_sum
                      where id = ${orderId}
                        and userid = ${userId}
    ;`)
    connection.end()
}

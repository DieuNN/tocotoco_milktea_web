import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, removeItemFromCart} from "./index";

export async function addCartItemsToOrder(orderId: number, sessionId: number, userId: number) {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let sessionResult = await connection.query(`select productid           as "productId",
                                                           "CartItem".quantity as "quantity"
                                                    from "CartItem"
                                                             inner join "Product" P on P.id = "CartItem".productid
                                                             inner join "ProductCategory" on P.categoryid = "ProductCategory".id
                                                    where sessionid = ${sessionId};`)
        for (const item of sessionResult.rows) {
            let hey = await connection.query(`insert into "OrderItem"
                                              values (default, ${orderId}, ${item.productId}, ${item.quantity}, now(),
                                                      now())`)
        }
        updateOrderDetailTotal(orderId, userId).then()
    } catch (e) {
        console.log(e)
    }
}

async function updateOrderDetailTotal(orderId: number, userId: number) {
    const connection = await new Pool(PostgreSQLConfig)
    connection.query(`with total_sum as (select sum(OI.quantity * price) -
                                                sum(OI.quantity * price * discountpercent / 100) as "sum"
                                         from "OrderDetail"
                                                  inner join "OrderItem" OI on "OrderDetail".id = OI.orderid
                                                  inner join "Product" P on P.id = OI.productid
                                                  left join "Discount" on P.discountid = "Discount".id
                                         where userid = ${userId}
                                           and "OrderDetail".id = ${orderId})
                      update "OrderDetail"
                      set total = total_sum.sum
                      from total_sum
                      where userid = ${userId}
                        and "OrderDetail".id = ${orderId};`)
}

import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, removeItemFromCart} from "./index";

export async function addCartItemsToOrder(orderId: number, sessionId: number) {
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
    } catch (e) {
        console.log(e)
    }
}

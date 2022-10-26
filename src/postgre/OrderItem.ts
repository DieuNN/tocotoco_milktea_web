import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/debug";
import {createException, removeItemFromCart} from "./index";

export async function addCartItemsToOrder(orderId: number, sessionId: number) {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let ids = await connection.query(`insert into "OrderItem" (id, orderid, productid, quantity)
                                          values (default,
                                                  ${orderId},
                                                  (select "CartItem".productid, "CartItem".quantity
                                                   from "CartItem"
                                                   where sessionid = ${sessionId}))
                                          returning id`)
        console.log(ids)
    } catch (e) {
        return createException(e)
    }
}

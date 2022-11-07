import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult, deleteShoppingSession} from "./index";
import {addCartItemsToOrder} from "./OrderItem";

/* Move temporary cart to order details, cuz ppl confirmed buying */
export async function confirmTransaction(userId: number, sessionId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const {rows} = await connection.query(`
            insert into "PaymentDetails"
            values (default,
                    0,
                    0,
                    '',
                    now(),
                    now(),
                    '')
            returning id
        `)
        let paymentDetailId = rows[0].id
        /*Copy data from Shopping Session */
        const result = await connection.query(`insert into "OrderDetail" (id, userid, total, createat, modifiedat, paymentid)
                                               values (default,
                                                       (select "ShoppingSession".userid,
                                                               "ShoppingSession".total,
                                                               "ShoppingSession".createat,
                                                               "ShoppingSession".modifiedat
                                                        from "ShoppingSession"
                                                        where "ShoppingSession".id = ${sessionId}),
                                                       ${paymentDetailId})
                                               returning id`)
        /* Copy data from cart */
        await addCartItemsToOrder(result.rows[0].id, sessionId)
        await deleteShoppingSession(userId, sessionId)
        return createResult(result.rowCount > 0)
    } catch (e) {
        return createException(e)
    }
}

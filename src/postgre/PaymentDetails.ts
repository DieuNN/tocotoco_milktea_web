import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function createPaymentDetail(orderId: number, provider: String, status: string, phoneNumber: string, address: string, note: string): Promise<number> {
    const connection = await new Pool(PostgreSQLConfig)
    try {
        await connection.query(`begin`)
        const result = await connection.query(`insert into "PaymentDetails" (id, orderid, amount, status, createat,
                                                                             modifiedat, provider, address,
                                                                             phonenumber, note)
                                               values (default,
                                                       ${orderId},
                                                       0,
                                                       '${status}',
                                                       now(),
                                                       now(),
                                                       '${provider}',
                                                       '${address}',
                                                       '${phoneNumber}', '${note}')
                                               returning id`)
        await connection.query(`commit`)
        return result.rows[0].id
    } catch (e) {
        await connection.query(`rollback`)
        return 0
    }
}

//
export async function updatePaymentDetailStatus(paymentId: number, orderId: number, status: string): Promise<APIResponse<boolean>> {
    const connection = await new Pool(PostgreSQLConfig)
    try {
        await connection.query(`begin`)
        const result = await connection.query(`update "PaymentDetails"
                                               set status     = '${status}',
                                                   modifiedat = now()
                                               where id = ${paymentId}
                                                 and orderid = ${orderId}`)
        await connection.query(`rollback`)
        return createResult(result.rowCount == 1)
    } catch (e) {
        await connection.query(`rollback`)
        return createException(e)
    }
}

//
// export async function updatePaymentDetailProvider(paymentId: number, provider: string): Promise<APIResponse> {
//     try {
//         const connection = await new Pool(PostgreSQLConfig)
//         const result = await connection.query(`update "PaymentDetails"
//                                                set provider = '${provider}'
//                                                where id = ${paymentId}`)
//         return createResult(result.rowCount === 1)
//     } catch (e) {
//         return createException(e)
//     }
// }

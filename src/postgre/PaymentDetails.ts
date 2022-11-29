import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function createPaymentDetail(orderId: number, provider: String, status: string, phoneNumber: string, address: string): Promise<number> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`insert into "PaymentDetails" (id, orderid, amount, status, createat,
                                                                             modifiedat, provider, address,
                                                                             "phoneNumber")
                                               values (default,
                                                       ${orderId},
                                                       0,
                                                       '${status}',
                                                       now(),
                                                       now(),
                                                       '${provider}',
                                                       '${address}',
                                                       '${phoneNumber}')
                                               returning id`)
        return result.rows[0].id
    } catch (e) {
        return 0
    }
}

//
export async function updatePaymentDetailStatus(paymentId: number, orderId: number, status: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`update "PaymentDetails"
                                               set status     = '${status}',
                                                   modifiedat = now()
                                               where id = ${paymentId}
                                                 and orderid = ${orderId}`)
        return createResult(result.rowCount == 1)
    } catch (e) {
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

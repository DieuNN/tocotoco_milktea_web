import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/debug";
import {createException, createResult} from "./index";

// export async function createPaymentDetail(orderId: number, provider: String, status: string): Promise<APIResponse> {
//     try {
//         const connection = await new Pool(PostgreSQLConfig)
//         const result = await connection.query(`insert into "PaymentDetails"
//                                                values (default,
//                                                        ${orderId},
//                                                        0,
//                                                        '${status}',
//                                                        now(),
//                                                        now(),
//                                                        '${provider}')`)
//         return createResult(result.rowCount === 1)
//     } catch (e) {
//         return createException(e)
//     }
// }


export async function updatePaymentDetailStatus(paymentId: number, status: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`update "PaymentDetails"
                                               set status = ${status}
                                               where id = ${paymentId} `)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function updatePaymentDetailProvider(paymentId: number, provider: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`update "PaymentDetails"
                                               set provider = '${provider}'
                                               where id = ${paymentId}`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

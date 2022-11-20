import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function getAllStatistical() : Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const queryResult = await connection.query(`select *
                                                    from "OrderDetail"
                                                             inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid`)
        console.log(queryResult.rows)
        let result = {
            total: queryResult.rows.length,
            pending: 0,
            completed: 0,
            canceled: 0
        }
        queryResult.rows.forEach(item=> {
            if (item.status == 'Pending')
                result.pending++
            else if (item.status == 'Complete')
                result.completed++
            else
                result.canceled++
        })
        return createResult(result)
    } catch (e) {
        return createException("Khong the load thong ke!")
    }
}

export default {}

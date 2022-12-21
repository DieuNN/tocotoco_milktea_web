import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function getBestSellerProducts(): Promise<APIResponse<any>> {
    const connection = await new Pool(PostgreSQLConfig)
    try {
        let result = await connection.query(`select productid        as id,
                                                    sum(gr.quantity) as total,
                                                    name,
                                                    displayimage     as "displayImage"
                                             from "OrderItem" gr
                                                      inner join "Product" P on P.id = gr.productid
                                             group by gr.quantity, productid, name, displayimage
                                             order by total desc;`)
        return createResult(result.rows)
    } catch (e) {
        throw createException(e)
    }
}

export async function getRunningOutOfStock(): Promise<APIResponse<any>> {
    const connection = await new Pool(PostgreSQLConfig)
    try {
        let result = await connection.query(`select id as id, name as name, quantity as quantity
                                             from "Product"
                                             where quantity <= 10
                                             order by quantity asc `)
        return createResult(result.rows)
    } catch (e) {
        throw createException(e)
    }
}
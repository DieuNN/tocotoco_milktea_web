import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/debug";
import {createException, createResult} from "./index";

export async function createShoppingSession(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`insert into "ShoppingSession"
                                               values (default,
                                                       ${userId},
                                                       0,
                                                       now(),
                                                       now())`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function deleteShoppingSession(userId: number, sessionId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`delete
                                               from "ShoppingSession"
                                               where id = ${sessionId}
                                                 and userid = ${userId}`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}






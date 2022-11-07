import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

/* As we don't know much about PostgreSQL, we cannot create trigger in Postgre, so we decided to use
* javascript as trigger. We know that it's not recommended, but we don't have much time left :<
* By DieuNN */
async function triggerUpdateSessionTotal(sessionId: number) {
    const connection = await new Pool(PostgreSQLConfig)
    await connection.query(``)
}

export async function isUserHasTempCart(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select count(*)
                                             from "ShoppingSession"
                                             where userid = ${userId}`)
        if (result.rows[0].count == 0) {
            return createResult(true)
        } else {
            return createResult(false)
        }
    } catch (e) {
        return createException(e)
    }
}

export async function createShoppingSession(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const shouldCreateTempCart = await isUserHasTempCart(userId)
        if (shouldCreateTempCart.result === false) {
            return createException("Nguoi dung nay da co gio hang tam thoi!")
        }
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
        if (result.rowCount === 1) {
            return createResult(true)
        } else {
            return createException("Khong tim thay userId " + userId + " va sessionId " + sessionId)
        }
    } catch (e) {
        return createException(e)
    }
}






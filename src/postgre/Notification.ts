import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function getAllNotifications(): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select *
                                             from "Notifications"`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function getPromotionNotifications(): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select *
                                             from "Notifications"
                                             where type = 'Promotion'`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function getNewsNotifications(): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select *
                                             from "Notifications"
                                             where type = 'News'`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function addNotification(title: string, message: string, type: string, image: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`insert into "Notifications" (id, title, message, type, image)
                                             VALUES (default,
                                                     '${title}',
                                                     '${message}',
                                                     '${type}',
                                                     '${image}')`)
        return createResult(result.rowCount != 0)
    } catch (e) {
        return createException(e)
    }
}


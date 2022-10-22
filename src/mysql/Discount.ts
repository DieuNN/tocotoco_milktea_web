import {mySQLConfig} from "../config/debug";
import mySQL, {OkPacket, FieldPacket, RowDataPacket,} from 'mysql2/promise'
import {createException, createResult} from "./index";

export async function createDiscount(discount: Discount): Promise<APIResponse> {
    try {
        const connect = await mySQL.createConnection(mySQLConfig)
        let [row] = await connect.query(`insert into Discount
                                         values (0,
                                                 '${discount.name}',
                                                 '${discount.description}',
                                                 ${discount.discountPercent},
                                                 ${discount.active ? 1 : 0},
                                                 now(),
                                                 now(),
                                                 '${discount.displayImage}')`)
        return createResult((row as unknown as MySQLResult).affectedRows === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function updateDiscount(oldId: number, discount: Discount): Promise<APIResponse> {
    try {
        const connect = await mySQL.createConnection(mySQLConfig)
        let [rows] = await connect.query(` update Discount
                                           set name            = '${discount.name}',
                                               description     = '${discount.description}',
                                               discountPercent = '${discount.discountPercent}',
                                               active          = '${discount.active ? 1 : 0}',
                                               modifiedAt      = now(),
                                               displayImage    = '${discount.displayImage}'
                                           where id = ${oldId}`)
        return createResult((rows as unknown as MySQLResult).affectedRows === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function getDiscount(id: number): Promise<APIResponse> {
    try {
        const connect = await mySQL.createConnection(mySQLConfig)
        let [row, _]: [OkPacket[], FieldPacket[]] = await connect.query(`select *
                                                                         from Discount
                                                                         where id = ${id}`)
        return createResult((row[0] as unknown as Discount))
    } catch (e) {
        return createException(e)
    }
}

export async function deleteDiscount(id: number): Promise<APIResponse> {
    try {
        const connect = await mySQL.createConnection(mySQLConfig)
        let row = await connect.query(`delete
                                       from Discount
                                       where id = ${id}`)
        return createResult((row as unknown as MySQLResult).affectedRows === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function getDiscounts(): Promise<APIResponse> {
    try {
        const connect = await mySQL.createConnection(mySQLConfig)
        let [rows, _] = await connect.query(`select *
                                             from Discount`)
        return createResult(rows as unknown as Discount[])
    } catch (e) {
        return createException(e)
    }
}

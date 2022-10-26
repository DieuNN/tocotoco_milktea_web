import {PostgreSQLConfig} from "../config/debug";
import {createException, createResult} from "./index";
import {Pool} from "pg";

export async function createDiscount(discount: Discount): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`insert into "Discount"
                                          values (0,
                                                  '${discount.name}',
                                                  '${discount.description}',
                                                  ${discount.discountPercent},
                                                  ${discount.active ? 1 : 0},
                                                  now(),
                                                  now(),
                                                  '${discount.displayImage}')`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function updateDiscount(oldId: number, discount: Discount): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(` update "Discount"
                                           set name            = '${discount.name}',
                                               description     = '${discount.description}',
                                               discountPercent = '${discount.discountPercent}',
                                               active          = '${discount.active ? 1 : 0}',
                                               modifiedAt      = now(),
                                               displayImage    = '${discount.displayImage}'
                                           where id = ${oldId}`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function getDiscount(id: number): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`select *
                                          from "Discount"
                                          where id = ${id}`)
        if (result.rowCount === 1) {
            return createResult(result.rows[0])
        } else {
            return createException("Khong tim thay ma giam gia");
        }
    } catch (e) {
        return createException(e)
    }
}

export async function deleteDiscount(id: number): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`delete
                                          from "Discount"
                                          where id = ${id}`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function getDiscounts(): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`select *
                                          from "Discount"`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

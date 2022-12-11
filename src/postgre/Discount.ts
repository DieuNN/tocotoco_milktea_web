import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";
import {Pool} from "pg";

export async function createDiscount(discount: Discount): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`insert into "Discount"
                                          values (default,
                                                  '${discount.name}',
                                                  '${discount.description}',
                                                  '${discount.discountPercent}',
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
        console.log(discount)
        let result = await connect.query(` update "Discount"
                                           set name            = '${discount.name}',
                                               displayimage    = '${discount.displayImage}',
                                               discountpercent = '${discount.discountPercent}',
                                               description     = '${discount.description}',
                                               modifiedat      = now()
                                           where id = ${oldId}
        `)
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
                                          where id = ${id}
                                          order by id`)
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
        console.log(id)
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`delete
                                          from "Discount"
                                          where id = ${id}`)
        console.log(result.rows)
        return createResult(result.rowCount == 1)
    } catch (e) {
        return createException(e)
    }
}

export async function getDiscounts(): Promise<APIResponse> {
    try {
        const connect = await new Pool(PostgreSQLConfig)
        let result = await connect.query(`select *
                                          from "Discount"`)
        result.rows.map(item => {
            item.createat = new Date(item.createat).toLocaleString()
            item.modifiedat = new Date(item.modifiedat).toLocaleString()
        })
        connect.end()
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

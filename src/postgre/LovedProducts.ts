import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult, rollBackTransactions} from "./index";
import {triggerUpdateSessionTotal} from "./ShoppingSession";

export async function getLovedItems(userId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select "LovedItems".id                                  as "id",
                                                    productid                                        as "productId",
                                                    P.name                                           as "productName",
                                                    P.description                                    as "productDescription",
                                                    PC.name                                          as "productCategoryName",
                                                    discountpercent                                  as "discountPercent",
                                                    price                                            as "priceBeforeDiscount",
                                                    round(price - P.price * D.discountpercent / 100) as "priceAfterDiscount",
                                                    P.displayimage                                   as "displayImage",
                                                    size                                             as "size"
                                             from "LovedItems"
                                                      inner join "Product" P on P.id = "LovedItems".productid

                                                      inner join "ProductCategory" PC on PC.id = P.categoryid
                                                      left outer join "Discount" D on D.id = P.discountid
                                             where userid = ${userId}
        ;`)
        result.rows.map(item => {
            item.size = item.size.split(",").filter((it: string) => it != "").join(",")
        })
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function addLovedItem(userId: number, productId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        if ((await isItemAlreadyInList(userId, productId))) {
            return createException("San pham nay da co trong list")
        }
        let result = await connection.query(`insert into "LovedItems" (id, userid, productid)
                                             values (default, ${userId}, ${productId})`)
        return createResult(result.rowCount != 0)
    } catch (e) {
        return createException(e)
    }
}

export async function deleteLovedItem(userId: number, productId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let _isItemInList = await isItemAlreadyInList(userId, productId)
        console.log(_isItemInList)
        if (!_isItemInList) {
            return createException("San pham nay chua co trong list")
        }
        let result = await connection.query(`delete
                                             from "LovedItems"
                                             where userid = ${userId}
                                               and productid = ${productId}`)
        if (result.rowCount == 0) {
            return createException("Khong tim thay item ID")
        } else {
            return createResult(true)
        }
    } catch (e) {
        return createException(e)
    }
}

async function isItemAlreadyInList(userId: number, productId: number): Promise<boolean> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "LovedItems"
                                               where userid = ${userId}
                                                 and productid = ${productId}`)
        return result.rows.length == 1
    } catch (e) {
        return false;
    }
}


export async function isUserLovedProduct(userId: number, productId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select *
                                             from "LovedItems"
                                             where userid = ${userId}
                                               and productid = ${productId}`)
        return createResult(result.rowCount != 0)
    } catch (e) {
        return createException(e)
    }
}

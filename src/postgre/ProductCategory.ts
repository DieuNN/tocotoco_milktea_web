import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";
import {Pool} from "pg";


export async function addProductCategory(productCategory: ProductCategory): Promise<APIResponse<boolean>> {
    const connection = await new Pool(PostgreSQLConfig)
    try {
        await connection.query(`begin`)
        let result = await connection.query(`INSERT INTO "ProductCategory"
                                             values (default,
                                                     '${productCategory.name}',
                                                     '${productCategory.description}',
                                                     '${productCategory.displayImage}',
                                                     now(),
                                                     now())`)
        await connection.query(`commit`)
        return {
            isSuccess: true,
            result: result.rowCount === 1,
            errorMessage: null
        }
    } catch (e) {
        await connection.query(`rollback`)
        return {
            isSuccess: true,
            result: null,
            errorMessage: "Lỗi server: " + e
        }
    }

}

export async function getProductCategories(): Promise<APIResponse<ProductCategory>> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query('select * from "ProductCategory"')
        result.rows.map(item => {
            item.createat = new Date(item.createat).toLocaleString("vi-VN", {timeZone: "Asia/Saigon"})
            item.modifiedat = new Date(item.modifiedat).toLocaleString("vi-VN", {timeZone: "Asia/Saigon"})
        })
        connection.end()
        return {
            isSuccess: true,
            result: result.rows,
            errorMessage: null
        }
    } catch (e) {
        return {
            isSuccess: true,
            result: null,
            errorMessage: "Lỗi server: " + e
        }
    }

}

export async function editProductCategory(oldId: number, productCategory: ProductCategory): Promise<APIResponse<boolean>> {
    const connection = await new Pool(PostgreSQLConfig);
    try {
        await connection.query(`begin`)
        let result = await connection.query(`update "ProductCategory"
                                             set name         = '${productCategory.name}',
                                                 description  = '${productCategory.description}',
                                                 displayImage = '${productCategory.displayImage}',
                                                 modifiedAt   = now()
                                             where id = ${oldId} `);
        await connection.query(`commit`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        await connection.query(`rollback`)
        return createException(e)
    }

}

export async function getProductCategory(id: number): Promise<APIResponse<ProductCategory[]>> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select *
                                             from "ProductCategory"
                                             where id = ${id}`)
        if (result.rowCount === 1) {
            return createResult(result.rows[0])
        } else {
            return createException("Khong tim thay ID");
        }
    } catch (e) {
        return createException(e)
    }
}

export async function deleteProductCategory(id: number): Promise<APIResponse<boolean>> {
    const connection = await new Pool(PostgreSQLConfig)
    try {
        await connection.query(`begin`)
        const result = await connection.query(` delete
                                                FROM "ProductCategory"
                                                where id = ${id}  `)
        await connection.query(`commit`)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

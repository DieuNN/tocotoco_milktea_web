import {PostgreSQLConfig} from "../config/debug";
import {createException, createResult} from "./index";
import {Pool} from "pg";


export async function addProductCategory(productCategory: ProductCategory): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`INSERT INTO "ProductCategory"
                                             values (0,
                                                     '${productCategory.name}',
                                                     '${productCategory.description}',
                                                     '${productCategory.displayImage}',
                                                     now(),
                                                     now())`)

        return {
            isSuccess: true,
            result: result.rowCount === 1,
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

export async function getProductCategories(): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query('select * from "ProductCategory"')
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

export async function editProductCategory(oldId: number, productCategory: ProductCategory): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig);
        let result = await connection.query(`update "ProductCategory"
                                             set name         = '${productCategory.name}',
                                                 description  = '${productCategory.description}',
                                                 displayImage = '${productCategory.displayImage}',
                                                 modifiedAt   = now()
                                             where id = ${oldId} `);

        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }

}

export async function getProductCategory(id: number): Promise<APIResponse> {
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

export async function deleteProductCategory(id: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(` delete
                                                FROM "ProductCategory"
                                                where id = ${id}  `)
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

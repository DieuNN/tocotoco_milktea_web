import {mySQLConfig} from "../config/debug";
import mySQL, {OkPacket, FieldPacket, RowDataPacket,} from 'mysql2/promise'
import {createException, createResult} from "./index";


export async function addProductCategory(productCategory: ProductCategory): Promise<APIResponse> {
    try {
        const connection = await mySQL.createConnection(mySQLConfig)
        let [row] = await connection.execute(`INSERT INTO ProductCategory
                                              values (0,
                                                      '${productCategory.name}',
                                                      '${productCategory.description}',
                                                      '${productCategory.displayImage}',
                                                      now(),
                                                      now())`)
        const result = row as MySQLResult
        return {
            isSuccess: true,
            result: result.affectedRows === 1,
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
        const connection = await mySQL.createConnection(mySQLConfig)
        let [rows, columns]: [OkPacket[], FieldPacket[]] = await connection.execute('select * from ProductCategory')
        let result = rows as unknown as ProductCategory[]
        return {
            isSuccess: true,
            result: result,
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
        const connection = await mySQL.createConnection(mySQLConfig);
        let [row] = await connection.execute(`update ProductCategory
                                              set name         = '${productCategory.name}',
                                                  description  = '${productCategory.description}',
                                                  displayImage = '${productCategory.displayImage}',
                                                  modifiedAt   = now()
                                              where id = ${oldId} `);
        const result = row as MySQLResult
        return createResult(result.affectedRows === 1)
    } catch (e) {
        return createException(e)
    }

}

export async function getProductCategory(id: number): Promise<APIResponse> {
    try {
        const connection = await mySQL.createConnection(mySQLConfig)
        let [rows, columns]: [OkPacket[], FieldPacket[]] = await connection.execute(`select *
                                                                                     from ProductCategory
                                                                                     where id = ${id}`)
        return createResult((rows[0] as unknown as ProductCategory))
    } catch (e) {
        return createException(e)
    }
}

export async function deleteProductCategory(id: number): Promise<APIResponse> {
    try {
        const connection = await mySQL.createConnection(mySQLConfig);
        const [row] = await connection.execute(` delete
                                                 FROM ProductCategory
                                                 where id = ${id}  `)
        return createResult((row as MySQLResult).affectedRows === 1)
    } catch (e) {
        return createException(e)
    }
}

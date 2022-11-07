import {Pool} from 'pg'
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function addProduct(product: Product): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`insert into "Product"
                                               values (default,
                                                       '${product.name}',
                                                       '${product.description}',
                                                       '${product.categoryId}',
                                                       '${product.quantity}',
                                                       '${product.price}',
                                                       '${product.discountId}',
                                                       '${product.displayImage}',
                                                       '${product.size}')`)
        return createResult(true)
    } catch (e) {
        return createException(e)
    }
}

export async function updateProductQuantity(id: number, quantity: number): Promise<APIResponse> {
    if (quantity < 0) {
        return createException("So luong cap nhat " + quantity + " khong hop le!")
    }
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`update "Product"
                                               set quantity = ${quantity}
                                               where id = ${id}`)
        if (result.rowCount === 1) {
            return createResult(result.rowCount === 1)
        } else {
            return createException("Khong tim thay san pham co ID la" + id)
        }
    } catch (e) {
        return createException(e)
    }

}

export async function getProducts(): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "Product"`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}

export async function getProduct(productId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "Product"
                                               where id = ${productId}`)

        if (result.rows.length === 1) {
            return createResult(result.rows[0])
        } else {
            return createException("Khong tim thay id")
        }

    } catch (e) {
        return createException(e)
    }
}

export async function updateProduct(product: Product, productId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`update "Product"
                                               set name        = '${product.name}',
                                                   description = '${product.description}',
                                                   categoryid  = ${product.categoryId},
                                                   quantity    = ${product.quantity},
                                                   price       = ${product.price},
                                                   discountid  = ${product.discountId},
                                                   displayimage= '${product.displayImage}',
                                                   size        = '${product.size}'
                                               where id = ${productId}`
        )
        return createResult(result.rowCount === 1)
    } catch (e) {
        return createException(e)
    }
}

export async function getProductsByCategoryId(categoryId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "Product"
                                               where categoryid = ${categoryId}`)
        return createResult(result.rows)
    } catch (e) {
        return createException(e)
    }
}



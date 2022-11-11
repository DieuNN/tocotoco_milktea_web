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
                                                       ${product.discountId},
                                                       '${product.displayImage}',
                                                       '${product.size}')`)
        return createResult(true)
    } catch (e) {
        return createException(e)
    }
}

export async function deleteProduct(id: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`delete
                                               from "Product"
                                               where id = ${id}`)
        connection.end()
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
        const result = await connection.query(`select "Product".id,
                                                      "Product".name             as "productName",
                                                      "Product".description      as "productDescription",
                                                      "ProductCategory".name     as "productCategoryName",
                                                      "Product".quantity         as "quantity",
                                                      "Product".price            as "price",
                                                      "Discount".name            as "discount",
                                                      "Discount".discountpercent as "discountPercent",
                                                      "Product".price -
                                                      round(("Discount".discountpercent * "Product".price) /
                                                           100)       as "priceAfterDiscount",
                                                      "Product".size             as "size",
                                                      "Product".displayimage     as "displayImage"
                                               from "Product"
                                                        inner join "ProductCategory" on "ProductCategory".id = "Product".categoryid
                                                        left join "Discount" on "Product".discountid = "Discount".id
        `)
        result.rows.map(item => {
            item.size = item.size.toString().split(",").filter((it: string) => {
                return it != "";
            }).join(",")
            if (item.discount == null) {
                item.discount = "Không"
            }
        })
        connection.end()
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

export async function applyDiscount(productId: number, discountId: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`update "Product"
                                             set discountid = ${discountId}
                                             where id = ${productId}`)
        return createResult(result.rowCount == 1)
    } catch (e) {
        return createException(e)
    }
}





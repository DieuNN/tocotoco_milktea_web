import {mySQLConfig} from "../config/debug";
import mySQL, {OkPacket, FieldPacket, RowDataPacket,} from 'mysql2/promise'

export async function addProductCategory(productCategory: ProductCategory): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [row] = await connection.execute(`INSERT INTO ProductCategory
                                          values (0,
                                                  '${productCategory.name}',
                                                  '${productCategory.description}',
                                                  '${productCategory.displayImage}',
                                                  now(),
                                                  now())`)
    const result = row as MySQLResult
    return result.affectedRows === 1;

}

export async function getProductCategories(): Promise<ProductCategory[]> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows, columns]: [OkPacket[], FieldPacket[]] = await connection.execute('select * from ProductCategory')
    return rows as unknown as ProductCategory[]
}

export async function editProductCategory(oldId: number, productCategory: ProductCategory): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig);
    let [row] = await connection.execute(`update ProductCategory
                                          set name         = '${productCategory.name}',
                                              description  = '${productCategory.description}',
                                              displayImage = '${productCategory.displayImage}',
                                              modifiedAt   = now()
                                          where id = ${oldId} `);
    const result = row as MySQLResult
    console.log(result)
    return result.affectedRows === 1
}

export async function getProductCategory(id: number): Promise<ProductCategory | null> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows, columns]: [OkPacket[], FieldPacket[]] = await connection.execute(`select * from ProductCategory where id = ${id}`)

    if (rows.length === 1) {
        return rows[0] as unknown as ProductCategory
    } else {
        return null
    }
}

export async function deleteProductCategory(id: number): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig);
    const [row] = await connection.execute(` delete
                                             FROM ProductCategory
                                             where id = ${id}  `)
    return (row as MySQLResult).affectedRows === 1
}

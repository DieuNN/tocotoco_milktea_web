import {mySQLConfig} from "../config/debug";
import mySQL, {OkPacket, FieldPacket, RowDataPacket,} from 'mysql2/promise'
import md5 from 'md5'

export async function createUser(user: User): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig)
    const encryptedPassword = md5(user.password!)
    let row = await connection.execute(`insert into User
                                        values (0,
                                                '${user.username}',
                                                '${user.email}',
                                                '${encryptedPassword}',
                                                '${user.name}',
                                                '${user.phoneNumber}',
                                                now(),
                                                now())`)
    return (row as unknown as MySQLResult).affectedRows === 1
}

export async function getUsers(): Promise<any> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows, _] = await connection.execute(`select User.id,
                                                     User.name,
                                                     User.email,
                                                     User.phoneNumber,
                                                     User.createAt,
                                                     UserAddress.address
                                              from User
                                                       inner join UserAddress on User.id = UserAddress.userId;`)
    let result = [];
    // @ts-ignore
    for (let element of rows) {
        result.push({
            // @ts-ignore
            name: element.name,
            // @ts-ignore
            email: element.email,
            // @ts-ignore
            phoneNumber: element.phoneNumber,
            // @ts-ignore
            address: element.address,
            // @ts-ignore
            createAt: element.createAt
        })
    }
    if (result.length === 0) {
        return null
    }
    return result
}

export async function getUser(id: number): Promise<any> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows, _]: [OkPacket[], FieldPacket[]] = await connection.execute(`select User.id,
                                                                                  User.name,
                                                                                  User.email,
                                                                                  User.phoneNumber,
                                                                                  User.createAt,
                                                                                  UserAddress.address
                                                                           from User
                                                                                    inner join UserAddress on User.id = UserAddress.userId
                                                                           where User.id = ${id};`)
    if (rows.length == 0) {
        return null
    } else {
        return rows[0]
    }
}

export async function updateUser(oldId: number, user: User): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let encryptedPassword = md5(user.password!)
    let row = await connection.execute(`update User
                                        set name        = '${user.name}',
                                            password    = '${user.password}',
                                            username    = '${user.username}',
                                            email       = '${user.email}',
                                            phoneNumber = '${user.phoneNumber}',
                                            modifiedAt  = now()
                                        where id = ${oldId}
    `)
    return (row as unknown as MySQLResult).affectedRows === 1
}

/*Experimental*/
export async function deleteUser(id: number) {

}



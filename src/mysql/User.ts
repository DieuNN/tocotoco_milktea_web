import {mySQLConfig} from "../config/debug";
import mySQL, {OkPacket, FieldPacket, RowDataPacket,} from 'mysql2/promise'
import md5 from 'md5'
import {createException, createResult} from "./index";

async function isUsernameHasTaken(username: string): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let result = await connection.query(`select count(*)
                                         from User
                                         where username = '${username}'`)
    // @ts-ignore
    return result[0][0]['count(*)'] === 1;
}

export async function createUser(user: User): Promise<APIResponse> {
    const connection = await mySQL.createConnection(mySQLConfig)
    const encryptedPassword = md5(user.password!)

    const isUsernameExist = await isUsernameHasTaken(user.username)

    if (isUsernameExist) {
        return createException("Tên người dùng đã được sử dụng")
    }

    let insertNewUserResult = await connection.execute(`insert into User
                                                        values (0,
                                                                '${user.username}',
                                                                '${user.email}',
                                                                '${encryptedPassword}',
                                                                '${user.name}',
                                                                '${user.phoneNumber}',
                                                                now(),
                                                                now())`)
    let insertIndex = (insertNewUserResult as unknown as MySQLResult[])[0].insertId
    let insertUserAddressResult = await connection.execute(`insert into UserAddress
                                                            values (0,
                                                                    ${insertIndex},
                                                                    '',
                                                                    '')`)
    if ((insertNewUserResult as unknown as MySQLResult[])[0].affectedRows === 1
        && (insertUserAddressResult as unknown as MySQLResult[])[0].affectedRows === 1) {
        return {
            isSuccess: true,
            result: true,
            errorMessage: null
        }
    } else {
        return {
            isSuccess: false,
            result: null,
            errorMessage: "Không thể đăng ký tài khoản do lỗi server!"
        }
    }

}

export async function getUsers(): Promise<APIResponse> {
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
        return {
            isSuccess: false,
            result: null,
            errorMessage: "Lỗi server!"
        }
    }
    return {
        isSuccess: true,
        result: result,
        errorMessage: null
    }
}

export async function getUser(id: number): Promise<any> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows, _]: [OkPacket[], FieldPacket[]] = await connection.execute(`select User.id,
                                                                                  User.username,
                                                                                  User.name,
                                                                                  User.email,
                                                                                  User.phoneNumber,
                                                                                  User.createAt,
                                                                                  UserAddress.address
                                                                           from User
                                                                                    inner join UserAddress on User.id = UserAddress.userId
                                                                           where User.id = ${id};`)
    if (rows.length === 0) {
        return {
            isSuccess: false,
            result: null,
            errorMessage: "Lỗi server!"
        }
    } else {
        return {
            isSuccess: true,
            result: rows[0],
            errorMessage: null
        }
    }
}

export async function updateUser(oldId: number, user: User): Promise<APIResponse> {
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
    if ((row as unknown as MySQLResult).affectedRows === 1) {
        return {
            isSuccess: true,
            result: true,
            errorMessage: null
        }
    }
    return {
        isSuccess: false,
        result: false,
        errorMessage: "Lỗi server!"
    }
}


export async function deleteUser(id: number): Promise<APIResponse> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let result = await connection.execute(`delete
                                           from User
                                           where id = ${id}`)
    if ((result as unknown as MySQLResult).affectedRows === 1) {
        return {
            isSuccess: true,
            result: true,
            errorMessage: null
        }
    }
    return {
        isSuccess: false,
        result: false,
        errorMessage: "Lỗi server!"
    }
}

export async function updateUserAddress(id: number, userAddress: UserAddress): Promise<APIResponse> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let result = await connection.execute(`update UserAddress
                                           set phoneNumber = '${userAddress.phoneNumber}',
                                               address     = '${userAddress.address}'
                                           where id = ${id}
    `)
    if ((result as unknown as MySQLResult).affectedRows === 1) {
        return {
            isSuccess: true,
            result: true,
            errorMessage: null
        }
    }
    return {
        isSuccess: false,
        result: false,
        errorMessage: "Lỗi server!"
    }
}

export async function getUserId(username: string): Promise<APIResponse> {
    try {
        const connection = await mySQL.createConnection(mySQLConfig)
        let result = await connection.query(`select id
                                             from User
                                             where username = '${username}'`)
        // @ts-ignore
        return createResult(result[0][0].id)
    } catch (e) {
        return createException(e)
    }
}


export async function getUserLoginInfo(username: string, password: string, usernameType: string): Promise<APIResponse> {
    let encryptedPassword: string = md5(password)
    const connection = await mySQL.createConnection(mySQLConfig)
    let result;
    switch (usernameType) {
        case "email" : {
            let sqlQuery = `Select count(*)
                            from User
                            where email = '${username}'
                              and password = '${encryptedPassword}'`
            result = await connection.execute(sqlQuery)
            break
        }
        case "phoneNumber" : {
            let sqlQuery = `Select count(*)
                            from User
                            where phoneNumber = '${username}'
                              and password = '${encryptedPassword}'`
            result = await connection.execute(sqlQuery)
            break
        }
        case "username" : {
            let sqlQuery = `Select count(*)
                            from User
                            where username = '${username}'
                              and password = '${encryptedPassword}'`
            result = await connection.execute(sqlQuery)
            break
        }
        default : {
            return {
                isSuccess: false,
                result: false,
                errorMessage: "Thông tin đăng nhập không đúng!"
            }
        }
    }

    // @ts-ignore
    if (result[0][0]['count(*)'] === 1) {
        return {
            isSuccess: true,
            result: true,
            errorMessage: null
        }
    } else {
        return {
            isSuccess: false,
            result: false,
            errorMessage: "Thông tin đăng nhập không đúng!"
        }
    }
}







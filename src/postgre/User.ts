import {PostgreSQLConfig} from "../config/posgre";
import md5 from 'md5'
import {createException, createResult} from "./index";
import {Pool} from "pg";

export async function isUsernameHasTaken(username: string): Promise<boolean> {
    const connection = await new Pool(PostgreSQLConfig)
    let result = await connection.query(`select count(*)
                                         from "User"
                                         where username = '${username}'`)
    return result.rows[0].count != 0
}

export async function createUser(user: User): Promise<APIResponse> {
    const connection = await new Pool(PostgreSQLConfig)
    const encryptedPassword = md5(user.password!)

    const isUsernameExist = await isUsernameHasTaken(user.username)
    // console.log(isUsernameExist)
    if (isUsernameExist) {
        return createException("Tên người dùng đã được sử dụng")
    }

    let insertNewUserId = await connection.query(`insert into "User" (id, email, password, name, phonenumber, createat,
                                                                      modifiedat, username)
                                                      values (DEFAULT,
                                                              '${user.email}',
                                                              '${encryptedPassword}',
                                                              '${user.name}',
                                                              '${user.phoneNumber}',
                                                              now(),
                                                              now(),
                                                              '${user.username}') returning id`)
    let insertIndex = insertNewUserId.rows[0].id
    let insertUserAddress = await connection.query(`insert into "UserAddress"
                                                    values (DEFAULT,
                                                            ${insertIndex},
                                                            '',
                                                            '')`)
    await addUserMomoPayment(insertIndex, "")

    if ((insertNewUserId.rowCount === 1
        && (insertUserAddress.rowCount === 1))) {
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

export async function getUsers() {
    const connection = await new Pool(PostgreSQLConfig)
    let result = await connection.query(`select "User".id, name, email, "User".phoneNumber, createAt, address
                                         from "User"
                                                  inner join "UserAddress" on "User".id = "UserAddress".userId`)

    // let result = await connection.query(`select * from "User"`)
    return {
        isSuccess: true,
        result: result.rows,
        errorMessage: null
    }
}

export async function getUser(id: number): Promise<APIResponse> {
    const connection = await new Pool(PostgreSQLConfig)
    let result = await connection.query(`select "User".id,
                                                "User".username,
                                                "User".name,
                                                "User".email,
                                                "User".phoneNumber,
                                                "User".createAt,
                                                "UserAddress".address
                                         from "User"
                                                  inner join "UserAddress" on "User".id = "UserAddress".userId
                                         where "User".id = ${id};`)

    if (result.rows.length == 0) {
        return {
            isSuccess: false,
            result: null,
            errorMessage: "Khong tim thay user nay"
        }
    } else {
        return {
            isSuccess: true,
            result: result.rows[0],
            errorMessage: null
        }
    }

}

export async function updateUserInfo(oldId: number, user: User): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`update "User"
                                             set name        = '${user.name}',
                                                 username    = '${user.username}',
                                                 email       = '${user.email}',
                                                 phoneNumber = '${user.phoneNumber}',
                                                 modifiedAt  = now()
                                             where id = ${oldId}
        `)
        if (result.rowCount == 1) {
            return createResult(true)
        } else {
            return createException("Khong tim thay user voi ID " + oldId)
        }
    } catch (e) {
        return createException(e)
    }
}


export async function deleteUser(id: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`delete
                                             from "User"
                                             where id = ${id}`)
        return createResult(result.rowCount == 1)

    } catch (e) {
        return createException(e)
    }
}

export async function updateUserAddress(id: number, userAddress: UserAddress): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`update "UserAddress"
                                             set phoneNumber = '${userAddress.phoneNumber}',
                                                 address     = '${userAddress.address}'
                                             where id = ${id}
        `)
        if (result.rowCount === 1) {
            return createResult(true)
        } else {
            return createException("Khong co nguoi dung voi ID " + id);
        }
    } catch (e) {
        return createException(e);
    }
}

export async function getUserAddress(id: number): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`select *
                                               from "UserAddress"
                                               where id = ${id}`)
        if (result.rows.length === 0) {
            return createException("Khong tim thay thong tin voi ID " + id)
        } else {
            return createResult(result.rows[0])
        }
    } catch (e) {
        return createException(e)
    }
}

export async function getUserId(username: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`select id
                                             from "User"
                                             where username = '${username}'`)
        if (result.rows.length === 0) {
            return createException("Khong tim thay ID")
        } else {
            return createResult(result.rows[0].id)
        }
    } catch (e) {
        return createException(e)
    }
}


export async function getUserLoginInfo(username: string, password: string, usernameType: string): Promise<APIResponse> {
    let encryptedPassword: string = md5(password)
    console.log(username)
    console.log(encryptedPassword)
    console.log(usernameType)
    const connection = await new Pool(PostgreSQLConfig)
    let result;
    switch (usernameType) {
        case "email" : {
            let sqlQuery = `Select count(*)
                            from "User"
                            where email = '${username}'
                              and password = '${encryptedPassword}'`
            result = await connection.query(sqlQuery)
            break
        }
        case "phoneNumber" : {
            let sqlQuery = `Select count(*)
                            from "User"
                            where phoneNumber = '${username}'
                              and password = '${encryptedPassword}'`
            result = await connection.query(sqlQuery)
            break
        }
        case "username" : {
            let sqlQuery = `Select count(*)
                            from "User"
                            where username = '${username}'
                              and password = '${encryptedPassword}'`
            result = await connection.query(sqlQuery)
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

    // console.log(result)
    if (result.rows[0].count != 0) {
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

export async function updateUserPassword(id: number, oldPassword: string, newPassword: string): Promise<APIResponse> {
    try {
        let encryptedOldPassword: string = md5(oldPassword)
        let encryptedNewPassword: string = md5(newPassword)
        const connection = await new Pool(PostgreSQLConfig)
        let result = await connection.query(`update "User"
                                             set password = '${encryptedNewPassword}'
                                             where id = ${id}
                                               and password = '${encryptedOldPassword}'`)
        if (result.rowCount === 1) {
            return createResult(true)
        } else {
            return createException("Khong tim thay thong tin");
        }
    } catch (e) {
        return createException(e)
    }
}

export async function addUserMomoPayment(userId: number, momoAccount: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`insert into "UserMomoPayment"
                                               values (default,
                                                       ${userId},
                                                       '${momoAccount}')`)
        if (result.rowCount == 1) {
            return createResult(true)
        } else {
            return createException("Khong tim thay ID")
        }
    } catch (e) {
        return createException(e)
    }
}

export async function updateUserMomoPayment(userId: number, momoAccountId: number, momoAccount: string): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const result = await connection.query(`update "UserMomoPayment"
                                               set momoaccount = '${momoAccount}'
                                               where userid = '${userId}'
                                                 and id = '${momoAccountId}'`)
        if (result.rowCount === 1) {
            return createResult(true)
        } else {
            return createException("Khong tim thay ID")
        }
    } catch (e) {
        return createException(e)
    }
}







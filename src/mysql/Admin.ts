import {PostgreSQLConfig} from "../config/debug";
import {Pool} from 'pg';


export async function isAdminLogin(username: string, password: string, ip: string | undefined): Promise<boolean> {
    // const connection = await mySQL.createConnection(mySQLConfig)
    const connection = new Pool(PostgreSQLConfig)
    let result = await connection.query(`select *
                                         from "Admin"
                                         where username = '${username}'
                                           and password = '${password}' `)
    await connection.query(`INSERT INTO "AdminLoginLog" values (default, now(), '${ip}')`)
    if (result.rowCount == 1) {
        return true
    }
    connection.end()
    return false
}

export async function updateAdminLastLogin() {
    const connection = await new Pool(PostgreSQLConfig)
    let result = await connection.query(`update "Admin"
                                         set lastLogin = now()
                                         where username = 'admin'
                                           and password = 'admin'`)
}

export async function getLog(): Promise<any> {
    const connection = await new Pool(PostgreSQLConfig)
    let result = await connection.query('select * from "AdminLoginLog"')
    console.log(result.rows)
    return result.rows
}

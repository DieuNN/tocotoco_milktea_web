import {mySQLConfig} from "../config/debug";
import mySQL from "mysql2/promise"
import {FieldPacket, OkPacket} from 'mysql2'


export async function isAdminLogin(username: string, password: string, ip : string | undefined): Promise<boolean> {
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows]: [OkPacket[], FieldPacket[]] = await connection.query(`select *
                                                                      from Admin
                                                                      where username = '${username}'
                                                                        and password = '${password}' `)
    await connection.query(`INSERT INTO AdminLoginLog values (0, now(), '${ip}')`)
    if (rows.length == 1) {
        return true
    }
    connection.end()
    return false
}

export async function updateAdminLastLogin() {
    const connection = await mySQL.createConnection(mySQLConfig)
    let result = await connection.query(`update Admin
                                         set lastLogin = now()
                                         where username = 'admin'
                                           and password = 'admin'`)
}

export async function getLog() : Promise<any>{
    const connection = await mySQL.createConnection(mySQLConfig)
    let [rows] = await connection.query('select * from AdminLoginLog')
    return rows
}

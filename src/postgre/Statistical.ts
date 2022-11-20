import {Pool} from "pg";
import {PostgreSQLConfig} from "../config/posgre";
import {createException, createResult} from "./index";

export async function getAllStatistical(): Promise<APIResponse> {
    try {
        const connection = await new Pool(PostgreSQLConfig)
        const queryResult = await connection.query(`select *
                                                    from "OrderDetail"
                                                             inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid`)
        console.log(queryResult.rows)
        let result = {
            total: queryResult.rows.length,
            pending: 0,
            completed: 0,
            canceled: 0
        }
        queryResult.rows.forEach(item => {
            if (item.status == 'Pending')
                result.pending++
            else if (item.status == 'Completed')
                result.completed++
            else
                result.canceled++
        })
        return createResult(result)
    } catch (e) {
        return createException("Khong the load thong ke!")
    }
}

export async function getMonthlyChart(): Promise<any> {
    const connection = await new Pool(PostgreSQLConfig)
    let result: { xAxis: number[], data: number[] } = {
        xAxis: [],
        data: []
    }
    let dateInstance = new Date()
    let daysInMonth = new Date(dateInstance.getFullYear(), dateInstance.getMonth() + 1, 0).getDate()
    let firstDayOfMonth = new Date(dateInstance.getFullYear(), dateInstance.getMonth(), 1).toLocaleString("en-US")
    let lastDayOfMonth = new Date(dateInstance.getFullYear(), dateInstance.getMonth() + 1, 0).toLocaleString("en-US")
    for (let i = 1; i <= daysInMonth; i++) {
        result.xAxis.push(i)
    }
    let total = 0
    let orderData = await connection.query(`select *
                                            from "OrderDetail"
                                                     inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                            where status = 'Completed'
                                              and PD.modifiedat >= '${firstDayOfMonth}'
                                              and PD.modifiedat <= '${lastDayOfMonth}'`)
    for (let i = 1; i <= daysInMonth; i++) {
        let day = new Date(dateInstance.getFullYear(), dateInstance.getMonth(), i + 1)
        let findResult = orderData.rows.filter(item => new Date(item.modifiedat).getDate() == day.getDate())
        if (findResult == undefined || findResult.length == 0) {
            result.data.push(total)
        } else {
            findResult.forEach(item => total += Number(item.total))
            result.data.push(total)
        }
    }

    return result
}

export async function getYearlyChart(): Promise<any> {
    const connection = await new Pool(PostgreSQLConfig)
    let result: { xAxis: number[], data: number[] } = {
        xAxis: [],
        data: []
    }
    for (let i = 1; i <= 12; i++) {
        result.xAxis.push(i)
    }
    let promises: Promise<any>[] = []
    for (let i = 0; i < 12; i++) {
        promises.push(getMonthlyIncome(i))
    }
    let promisesResult = await Promise.all(promises)
    promisesResult.forEach(item => result.data.push(item))
    return result
}

export async function getMonthlyIncome(month: number): Promise<number> {
    const connection = await new Pool(PostgreSQLConfig)
    let dateInstance = new Date()
    let daysInMonth = new Date(dateInstance.getFullYear(), month + 1, 0).getDate()
    let firstDayOfMonth = new Date(dateInstance.getFullYear(), month, 1).toLocaleString("en-US")
    let lastDayOfMonth = new Date(dateInstance.getFullYear(), month + 1, 0).toLocaleString("en-US")
    let total = 0
    let orderData = await connection.query(`select *
                                            from "OrderDetail"
                                                     inner join "PaymentDetails" PD on PD.id = "OrderDetail".paymentid
                                            where status = 'Completed'
                                              and PD.modifiedat >= '${firstDayOfMonth}'
                                              and PD.modifiedat <= '${lastDayOfMonth}'`)
    for (let i = 1; i <= daysInMonth; i++) {
        let day = new Date(dateInstance.getFullYear(), dateInstance.getMonth(), i + 1)
        let findResult = orderData.rows.filter(item => new Date(item.modifiedat).getDate() == day.getDate())
        if (findResult == undefined || findResult.length == 0) {

        } else {
            findResult.forEach(item => total += Number(item.total))

        }
    }
    return total
}

export default {}

import {Application, Response, Request} from 'express';
import multer from "multer";
import {getOrders} from "../postgre/OrderDetails";
import {updatePaymentDetailStatus} from "../postgre/PaymentDetails";

export function orderRoutes(app: Application) {
    app.get("/pending-orders", (req: Request, res: Response) => {
        getOrders("Đợi xác nhận").then(r => {
            console.log(r.result[6].detail)
            res.render("pending_orders", {orders: r.result})
        })
    })
    app.post("/pending-orders/confirm", (req: Request, res: Response) => {
        const {paymentId, orderId} = req.body
        updatePaymentDetailStatus(paymentId, orderId, "Đang giao").then(r=> {
            res.redirect("/pending-orders")
        })
    })
    app.post("/pending-orders/cancel", (req : Request, res : Response)=> {
        const {paymentId, orderId} = req.body
        updatePaymentDetailStatus(paymentId, orderId, "Bị hủy").then(r=> {
            res.redirect("/pending-orders")
        })
    })
}

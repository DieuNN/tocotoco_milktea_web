import {Application, Response, Request} from 'express';
import multer from "multer";
import {deleteOrder, getOrders} from "../postgre/OrderDetails";
import {updatePaymentDetailStatus} from "../postgre/PaymentDetails";
import {getUserTokenDevice} from "../postgre/User";
import {sendNotification} from "./NotificationRoute";

export function orderRoutes(app: Application) {
    app.get("/pending-orders", (req: Request, res: Response) => {
        getOrders("Đợi xác nhận").then(r => {
            console.log(r.result)
            res.render("pending_orders", {orders: r.result})
        })
    })
    app.post("/pending-orders/confirm", (req: Request, res: Response) => {
        const {paymentId, orderId, userId} = req.body
        updatePaymentDetailStatus(paymentId, orderId, "Đang giao").then(r => {
            getUserTokenDevice(userId).then(r1 => {
                console.log(r1)
                sendNotification("Thông báo", "Đơn hàng có mã số " + orderId + " của bạn đang được giao", r1)
            })
            res.redirect("/pending-orders")
        })
    })
    app.post("/pending-orders/cancel", (req: Request, res: Response) => {
        const {paymentId, orderId, userId} = req.body
        updatePaymentDetailStatus(paymentId, orderId, "Bị hủy").then(r => {
            getUserTokenDevice(userId).then(r1 => {
                sendNotification("Thông báo", "Đơn hàng có mã số " + orderId + " của bạn đã bị hủy", r1)
            })
            res.redirect("/pending-orders")
        })
    })
    app.get("/delivering-order", (req: Request, res: Response) => {
        getOrders("Đang giao").then(r => {
            res.render("delivering_orders", {orders: r.result})
        })
    })
    app.post("/delivering-order/confirm", (req: Request, res: Response) => {
        const {paymentId, orderId, userId} = req.body
        updatePaymentDetailStatus(paymentId, orderId, "Hoàn thành").then(r => {
            getUserTokenDevice(userId).then(r1 => {
                sendNotification("Thông báo", "Đơn hàng có mã số " + orderId + " của bạn đã được giao thành công", r1)
            })
            res.redirect("/delivering-order")
        })
    })
    app.post("/delivering-order/cancel", (req: Request, res: Response) => {
        const {paymentId, orderId, userId} = req.body
        updatePaymentDetailStatus(paymentId, orderId, "Bị hủy").then(r => {
            getUserTokenDevice(userId).then(r1 => {
                sendNotification("Thông báo", "Đơn hàng có mã số " + orderId + " của bạn đã bị hủy", r1)
            })
            res.redirect("/delivering-order")
        })
    })
    app.get("/completed-orders", (req: Request, res: Response) => {
        getOrders("Hoàn thành").then(r => {
            res.render("completed_orders", {orders: r.result})
        })
    })
    app.post("/completed-orders/delete", (req: Request, res: Response) => {
        const {paymentId, orderId} = req.body
        deleteOrder(orderId, paymentId).then(r => {
            res.redirect("/completed-orders")
        })
    })
    app.get("/canceled-orders", (req: Request, res: Response) => {
        getOrders("Bị hủy").then(r => {
            res.render("canceled_orders", {orders: r.result})
        })
    })
    app.post("/canceled-orders/delete", (req: Request, res: Response) => {
        const {paymentId, orderId} = req.body
        deleteOrder(orderId, paymentId).then(r => {
            res.redirect("/completed-orders")
        })
    })


}

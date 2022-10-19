import {Application, Request, Response} from "express";
import {getDiscounts, getProductCategories, getProductCategory} from "../mysql";

export function API(app: Application) {
    app.get("/api/product_categories", async (req: Request, res: Response) => {
        const result = await getProductCategories()
        res.json(result)
    })
    app.get("/api/product_category", async (req: Request, res: Response) => {
        const result = await getProductCategory(req.body.id)
        res.json(result)
    })
    app.get("/api/discounts", async (req: Request, res: Response) => {
        const result = await getDiscounts()
        res.json(result)
    })

}

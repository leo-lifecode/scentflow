import { Request, Response } from "express";
import { getProducts } from "../services/product.service";

export async function getProductsController(_req: Request, res: Response) {
  const data = await getProducts();
  res.status(200).json({ success: true, data });
}

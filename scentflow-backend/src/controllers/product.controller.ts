import { Request, Response } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/product.service";

function parseProductInput(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    const error = new Error("Nama, harga, dan stok produk tidak valid");
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  return {
    name,
    price,
    stock,
    description: typeof body.description === "string" ? body.description.trim() : undefined,
    image_url: typeof body.image_url === "string" ? body.image_url.trim() : undefined,
  };
}

export async function getProductsController(_req: Request, res: Response) {
  const data = await getProducts();
  res.status(200).json({ success: true, data });
}

export async function createProductController(req: Request, res: Response) {
  const data = await createProduct(parseProductInput(req.body));
  res.status(201).json({ success: true, data });
}

export async function updateProductController(req: Request, res: Response) {
  const data = await updateProduct(req.params.id, parseProductInput(req.body));
  res.status(200).json({ success: true, data });
}

export async function deleteProductController(req: Request, res: Response) {
  await deleteProduct(req.params.id);
  res.status(204).send();
}

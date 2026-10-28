import { Request, Response } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/product.service";

function parseProductInput(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);
  const size = body.size === null || body.size === undefined || body.size === "" ? null : Number(body.size);

  if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0 ||
      (size !== null && (!Number.isInteger(size) || size <= 0))) {
    const error = new Error("Nama, harga, stok, atau ukuran produk tidak valid");
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  const result: {
    name: string; price: number; stock: number; description?: string;
    image_url?: string; variant?: string | null; size?: number | null;
  } = { name, price, stock };

  if (typeof body.description === "string") result.description = body.description.trim();
  if (typeof body.image_url === "string" || body.image_url === null) result.image_url = typeof body.image_url === "string" ? body.image_url.trim() : "";
  if (typeof body.variant === "string" || body.variant === null) result.variant = typeof body.variant === "string" ? body.variant.trim() : null;
  if (body.size !== undefined) result.size = size;
  return result;
}

function getSingleRouteParam(value: string | string[] | undefined): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
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
  const id = getSingleRouteParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "ID produk tidak valid" });
    return;
  }
  const data = await updateProduct(id, parseProductInput(req.body));
  res.status(200).json({ success: true, data });
}

export async function deleteProductController(req: Request, res: Response) {
  const id = getSingleRouteParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "ID produk tidak valid" });
    return;
  }
  await deleteProduct(id);
  res.status(204).send();
}

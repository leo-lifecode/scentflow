import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { supabase } from "../config/database";

export async function uploadProductImage(req: AuthenticatedRequest, res: Response) {
  const { file_name, content_type, base64 } = req.body as Record<string, unknown>;
  if (typeof file_name !== "string" || typeof content_type !== "string" || typeof base64 !== "string") {
    res.status(400).json({ message: "File gambar tidak valid" });
    return;
  }
  if (!["image/jpeg", "image/png"].includes(content_type)) {
    res.status(400).json({ message: "Hanya gambar JPG atau PNG yang diperbolehkan" });
    return;
  }
  const encoded = base64.replace(/^data:image\/(jpeg|png);base64,/, "");
  const buffer = Buffer.from(encoded, "base64");
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) {
    res.status(400).json({ message: "Ukuran gambar maksimal 5 MB" });
    return;
  }
  const extension = content_type === "image/png" ? "png" : "jpg";
  const safeName = file_name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.(png|jpe?g)$/i, "");
  const path = `${Date.now()}-${safeName || "product"}.${extension}`;
  const { error } = await supabase.storage.from("product-images").upload(path, buffer, {
    contentType: content_type, upsert: false, cacheControl: "3600",
  });
  if (error) throw error;
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  res.status(201).json({ data: { image_url: data.publicUrl } });
}
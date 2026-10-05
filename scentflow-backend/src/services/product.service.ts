import { supabase } from "../config/database";

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  description?: string;
  image_url?: string;
}

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createProduct(input: ProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      price: input.price,
      stock: input.stock,
      description: input.description || null,
      image_url: input.image_url || null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

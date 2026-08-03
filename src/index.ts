import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

const port = process.env.PORT || 5000;
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw error;
    res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

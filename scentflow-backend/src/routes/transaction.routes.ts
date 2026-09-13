import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase"; // Sesuaikan path Supabase client milikmu

const router = Router();

router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

export default router;
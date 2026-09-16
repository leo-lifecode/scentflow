import { Request, Response } from "express";
import { getTransactions } from "../services/transaction.service";

export async function getTransactionsController(_req: Request, res: Response) {
  const data = await getTransactions();
  res.status(200).json({ success: true, data });
}

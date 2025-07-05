import { Request, Response } from "express"
import Client from "../models/Client"
import { createPaginatedResponse } from "../utils/pagination"

export const getClients = async (req: Request, res: Response) => {
  const result = await createPaginatedResponse(
    req,
    Client,
    {},
    {
      populate: "viewings",
      sort: { createdAt: -1 }, // Sort by newest first
    }
  )

  res.json(result)
}

export const getClientById = async (req: Request, res: Response) => {
  const client = await Client.findById(req.params.id).populate("viewings")
  if (!client) return res.status(404).json({ message: "Client not found" })
  res.json(client)
}

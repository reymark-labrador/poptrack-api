import { Request, Response } from "express"
import Client from "../models/Client"

export const getClients = async (_req: Request, res: Response) => {
  const clients = await Client.find().populate("viewings")
  res.json(clients)
}

export const getClientById = async (req: Request, res: Response) => {
  const client = await Client.findById(req.params.id).populate("viewings")
  if (!client) return res.status(404).json({ message: "Client not found" })
  res.json(client)
}

import { Request, Response } from "express"
import Viewing from "../models/Viewing"

export const createViewing = async (req: Request, res: Response) => {
  const { client, property, scheduledAt } = req.body

  const viewing = await Viewing.create({ client, property, scheduledAt })
  res.status(201).json(viewing)
}

export const updateViewing = async (req: Request, res: Response) => {
  const { status, notes } = req.body
  const viewing = await Viewing.findByIdAndUpdate(
    req.params.id,
    { status, notes },
    { new: true }
  )
  if (!viewing) return res.status(404).json({ message: "Viewing not found" })
  res.json(viewing)
}

export const getAllViewings = async (_req: Request, res: Response) => {
  const viewings = await Viewing.find().populate("client").populate("property")
  res.json(viewings)
}

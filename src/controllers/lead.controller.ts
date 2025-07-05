import { Request, Response } from "express"
import Lead from "../models/Lead"
import Client from "../models/Client"
import Viewing from "../models/Viewing"
import mongoose from "mongoose"
import { createPaginatedResponse } from "../utils/pagination"

export const submitLead = async (req: Request, res: Response) => {
  const { name, email, phone, message, property } = req.body

  const lead = await Lead.create({ name, email, phone, message, property })
  res.status(201).json({ message: "Lead submitted", lead: lead.toObject() })
}

export const getLeads = async (req: Request, res: Response) => {
  const result = await createPaginatedResponse(
    req,
    Lead,
    {},
    {
      populate: "property",
      sort: { submittedAt: -1 }, // Sort by newest first
    }
  )

  res.json(result)
}

export const convertLeadToClientAndSchedule = async (
  req: Request,
  res: Response
) => {
  const lead = await Lead.findById(req.params.leadId).populate("property")
  if (!lead) return res.status(404).json({ message: "Lead not found" })

  let client = await Client.findOne({ email: lead.email })
  if (!client) {
    client = await Client.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
    })
  }

  const viewing = await Viewing.create({
    client: client._id,
    property: lead.property._id,
    scheduledAt: req.body.scheduledAt,
  })

  lead.status = "converted"
  lead.convertedToClient = client._id as mongoose.Types.ObjectId
  await lead.save()

  res.status(201).json({
    message: "Lead converted & viewing scheduled",
    viewing: viewing.toObject(),
    client: client.toObject(),
    lead: lead.toObject(),
  })
}

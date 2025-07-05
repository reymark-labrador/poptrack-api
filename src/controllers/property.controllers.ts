import { Request, Response } from "express"
import Property from "../models/Property"
import { createPaginatedResponse } from "../utils/pagination"

export const getProperties = async (req: Request, res: Response) => {
  const { type, city, minPrice, maxPrice, bedrooms, bathrooms, amenities } =
    req.query

  const query: any = {}
  if (type) query.type = type
  if (city) query["location.city"] = city
  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }
  if (bedrooms) query.bedrooms = Number(bedrooms)
  if (bathrooms) query.bathrooms = Number(bathrooms)
  if (amenities) {
    const list = Array.isArray(amenities) ? amenities : [amenities]
    query.amenities = { $all: list }
  }

  const result = await createPaginatedResponse(req, Property, query, {
    sort: { createdAt: -1 }, // Sort by newest first
  })

  res.json(result)
}

export const getPropertyById = async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id)
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json(property)
}

export const createProperty = async (req: Request, res: Response) => {
  const property = await Property.create(req.body)
  res.status(201).json(property)
}

export const updateProperty = async (req: Request, res: Response) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json(property)
}

export const deleteProperty = async (req: Request, res: Response) => {
  const property = await Property.findByIdAndDelete(req.params.id)
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json({ message: "Property deleted" })
}

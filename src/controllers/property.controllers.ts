import { Request, Response } from "express"
import Property from "../models/Property"
import { createPaginatedResponse } from "../utils/pagination"
import {
  PropertyQueryBuilder,
  createPerformanceMonitor,
} from "../utils/queryOptimizer"

export const getProperties = async (req: Request, res: Response) => {
  const monitor = createPerformanceMonitor()

  const {
    type,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    amenities,
    searchTerm,
    archived,
  } = req.query

  // Build optimized query using the query builder
  const queryBuilder = new PropertyQueryBuilder({
    maxLimit: 100,
    defaultLimit: 10,
    enableTextSearch: false,
    enableGeospatial: false,
  })

  // Add filters in order of selectivity (most selective first)
  if (type) queryBuilder.addTypeFilter(type as string)
  if (searchTerm) queryBuilder.addLocationAndTitleFilter(searchTerm as string)
  if (city) queryBuilder.addCityFilter(city as string)
  if (minPrice || maxPrice) {
    queryBuilder.addPriceFilter(
      minPrice ? Number(minPrice) : undefined,
      maxPrice ? Number(maxPrice) : undefined
    )
  }
  if (bedrooms) queryBuilder.addBedroomFilter(Number(bedrooms))
  if (bathrooms) queryBuilder.addBathroomFilter(Number(bathrooms))
  if (amenities) {
    const amenitiesList = Array.isArray(amenities) ? amenities : [amenities]
    queryBuilder.addAmenitiesFilter(amenitiesList as string[])
  }

  const query = queryBuilder.build()
  // Add archived filter directly to the query
  if (archived === undefined) {
    query.archived = false
  } else if (archived === "true") {
    query.archived = true
  } else if (archived === "false") {
    query.archived = false
  }

  const result = await createPaginatedResponse(req, Property, query, {
    sort: { createdAt: -1 }, // Sort by newest first
  })

  // Log performance metrics
  monitor.log("Property search query")

  // Ensure all documents are properly serialized with _id
  const serializedData = result.data.map((property) => property.toObject())

  res.json({
    ...result,
    data: serializedData,
  })
}

export const getPropertyById = async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id)
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json(property.toObject())
}

export const createProperty = async (req: Request, res: Response) => {
  const property = await Property.create(req.body)
  res.status(201).json(property.toObject())
}

export const updateProperty = async (req: Request, res: Response) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json(property.toObject())
}

export const deleteProperty = async (req: Request, res: Response) => {
  const property = await Property.findByIdAndDelete(req.params.id)
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json({ message: "Property deleted" })
}

export const archiveProperty = async (req: Request, res: Response) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { archived: true },
    { new: true }
  )
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json({ message: "Property archived" })
}

export const unarchiveProperty = async (req: Request, res: Response) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { archived: false },
    { new: true }
  )
  if (!property) return res.status(404).json({ message: "Property not found" })
  res.json({ message: "Property unarchived" })
}

export const convertAndSchedule = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params
    const { clientId, scheduledAt, notes } = req.body

    // Validate required fields
    if (!clientId || !scheduledAt) {
      return res.status(400).json({
        message: "Client ID and scheduled date are required",
      })
    }

    // Check if property exists
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ message: "Property not found" })
    }

    // Import Viewing model here to avoid circular dependencies
    const Viewing = (await import("../models/Viewing")).default

    // Create a new viewing
    const viewing = await Viewing.create({
      client: clientId,
      property: propertyId,
      scheduledAt: new Date(scheduledAt),
      status: "scheduled",
      notes: notes || "",
    })

    // Populate the viewing with client and property details
    await viewing.populate(["client", "property"])

    res.status(201).json({
      message: "Lead converted to viewing and scheduled successfully",
      viewing: viewing.toObject(),
    })
  } catch (error) {
    console.error("Error converting and scheduling:", error)
    res.status(500).json({
      message: "Failed to convert and schedule viewing",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

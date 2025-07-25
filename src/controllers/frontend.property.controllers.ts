import { Request, Response } from "express"
import Property from "../models/Property"
import { createPaginatedResponse } from "../utils/pagination"
import {
  PropertyQueryBuilder,
  createPerformanceMonitor,
  parseAmenitiesQuery,
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
    location,
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
  if (location) queryBuilder.addLocationFilter(location as string)
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
    const amenitiesList = parseAmenitiesQuery(amenities)
    queryBuilder.addAmenitiesFilter(amenitiesList)
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

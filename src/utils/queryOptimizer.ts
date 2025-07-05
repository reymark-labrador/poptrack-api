import { Request } from "express"

export interface QueryOptimizationOptions {
  maxLimit?: number
  defaultLimit?: number
  enableTextSearch?: boolean
  enableGeospatial?: boolean
}

/**
 * Optimized query builder for property search
 * Uses index-friendly query patterns for better performance
 */
export class PropertyQueryBuilder {
  private query: any = {}
  private options: QueryOptimizationOptions

  constructor(options: QueryOptimizationOptions = {}) {
    this.options = {
      maxLimit: 100,
      defaultLimit: 10,
      enableTextSearch: false,
      enableGeospatial: false,
      ...options,
    }
  }

  /**
   * Add type filter (uses index: { type: 1 })
   */
  addTypeFilter(type: string): this {
    if (type) {
      this.query.type = type
    }
    return this
  }

  /**
   * Add price range filter (uses index: { price: 1 })
   */
  addPriceFilter(minPrice?: number, maxPrice?: number): this {
    if (minPrice || maxPrice) {
      this.query.price = {}
      if (minPrice) this.query.price.$gte = minPrice
      if (maxPrice) this.query.price.$lte = maxPrice
    }
    return this
  }

  /**
   * Add location search (uses indexes: { "location.city": 1 }, { "location.address": 1 })
   */
  addLocationFilter(location: string): this {
    if (location) {
      this.query.$or = [
        // Exact city match (highest priority)
        { "location.city": { $regex: `^${location}$`, $options: "i" } },
        // City contains search term
        { "location.city": { $regex: location, $options: "i" } },
        // Address contains search term
        { "location.address": { $regex: location, $options: "i" } },
      ]
    }
    return this
  }

  /**
   * Add exact city filter (uses index: { "location.city": 1 })
   */
  addCityFilter(city: string): this {
    if (city) {
      this.query["location.city"] = city
    }
    return this
  }

  /**
   * Add bedroom filter (uses index: { bedrooms: 1 })
   */
  addBedroomFilter(bedrooms: number): this {
    if (bedrooms) {
      this.query.bedrooms = bedrooms
    }
    return this
  }

  /**
   * Add bathroom filter (uses index: { bathrooms: 1 })
   */
  addBathroomFilter(bathrooms: number): this {
    if (bathrooms) {
      this.query.bathrooms = bathrooms
    }
    return this
  }

  /**
   * Add amenities filter (uses index: { amenities: 1 })
   */
  addAmenitiesFilter(amenities: string[]): this {
    if (amenities && amenities.length > 0) {
      this.query.amenities = { $all: amenities }
    }
    return this
  }

  /**
   * Add text search (uses text index)
   */
  addTextSearch(searchTerm: string): this {
    if (searchTerm && this.options.enableTextSearch) {
      this.query.$text = { $search: searchTerm }
    }
    return this
  }

  /**
   * Add geospatial search (uses 2dsphere index)
   */
  addGeospatialFilter(lat: number, lng: number, radius: number): this {
    if (lat && lng && radius && this.options.enableGeospatial) {
      this.query["location.coordinates"] = {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      }
    }
    return this
  }

  /**
   * Get the optimized query
   */
  build(): any {
    return this.query
  }

  /**
   * Get query explanation for performance analysis
   */
  async explain(model: any): Promise<any> {
    return await model.find(this.query).explain("executionStats")
  }
}

/**
 * Extract and validate pagination parameters
 */
export const getOptimizedPaginationParams = (
  req: Request,
  options: QueryOptimizationOptions = {}
) => {
  const { page = 1, limit = options.defaultLimit || 10 } = req.query
  const maxLimit = options.maxLimit || 100

  const currentPage = Math.max(1, +page)
  const currentLimit = Math.min(maxLimit, Math.max(1, +limit))
  const skip = (currentPage - 1) * currentLimit

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
    maxLimit,
  }
}

/**
 * Performance monitoring utility
 */
export const createPerformanceMonitor = () => {
  const startTime = Date.now()

  return {
    start: () => startTime,
    end: () => Date.now() - startTime,
    log: (operation: string) => {
      const duration = Date.now() - startTime
      console.log(`⏱️  ${operation} completed in ${duration}ms`)
      return duration
    },
  }
}

/**
 * Query optimization tips and best practices
 */
export const QUERY_OPTIMIZATION_TIPS = {
  // Index usage
  INDEXES: [
    "Use compound indexes for common filter combinations",
    "Order index fields by selectivity (most selective first)",
    "Include sorting fields in compound indexes",
    "Use covered queries when possible",
  ],

  // Query patterns
  QUERIES: [
    "Use exact matches when possible (avoid $regex for exact values)",
    "Limit result sets with pagination",
    "Use projection to return only needed fields",
    "Avoid $where queries (they can't use indexes)",
  ],

  // Performance monitoring
  MONITORING: [
    "Use .explain() to analyze query performance",
    "Monitor slow queries (>100ms)",
    "Track index usage statistics",
    "Set up query performance alerts",
  ],
}

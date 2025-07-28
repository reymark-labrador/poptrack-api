import { Request } from "express"
import { Model, Document } from "mongoose"

export interface PaginationOptions {
  page?: number
  limit?: number
  populate?: string | string[]
  sort?: Record<string, 1 | -1>
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export interface PaginationQuery {
  page?: string
  limit?: string
}

export const getPaginationParams = (req: Request): PaginationOptions => {
  const { page = 1, limit = 10 } = req.query as PaginationQuery

  // Validate and set defaults for invalid values
  const pageNum = +page
  const limitNum = +limit

  return {
    page: isNaN(pageNum) || pageNum < 1 ? 1 : pageNum,
    limit: isNaN(limitNum) || limitNum < 1 ? 10 : limitNum,
  }
}

export const paginate = async <T extends Document>(
  model: Model<T>,
  query: any = {},
  options: PaginationOptions = {}
): Promise<PaginationResult<T>> => {
  const { page = 1, limit = 10, populate, sort } = options

  const currentPage = +page
  const currentLimit = +limit
  const skip = (currentPage - 1) * currentLimit

  let queryBuilder = model.find(query)

  if (populate) {
    queryBuilder = queryBuilder.populate(populate)
  }

  if (sort) {
    queryBuilder = queryBuilder.sort(sort)
  }

  const [data, total] = await Promise.all([
    queryBuilder.skip(skip).limit(currentLimit),
    model.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / currentLimit)
  const hasNext = currentPage < totalPages
  const hasPrevious = currentPage > 1

  return {
    data,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages,
      hasNext,
      hasPrevious,
    },
  }
}

export const createPaginatedResponse = <T extends Document>(
  req: Request,
  model: Model<T>,
  query: any = {},
  options: Omit<PaginationOptions, "page" | "limit"> = {}
): Promise<PaginationResult<T>> => {
  const paginationParams = getPaginationParams(req)
  return paginate(model, query, { ...paginationParams, ...options })
}

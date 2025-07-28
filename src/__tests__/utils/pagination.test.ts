import { Request } from "express"
import { createPaginatedResponse } from "../../utils/pagination"

// Mock mongoose model
const mockModel = {
  find: jest.fn(),
  countDocuments: jest.fn(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  populate: jest.fn().mockReturnThis(),
}

describe("Pagination Utils", () => {
  let mockRequest: Partial<Request>

  beforeEach(() => {
    mockRequest = {
      query: {},
    }
    jest.clearAllMocks()
  })

  describe("createPaginatedResponse", () => {
    it("should return paginated response with default values", async () => {
      const mockData = [{ id: 1, name: "Test" }]
      const mockTotal = 1

      // Mock the find chain
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(mockData),
        }),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      })

      // Mock countDocuments
      mockModel.countDocuments.mockResolvedValue(mockTotal)

      const result = await createPaginatedResponse(
        mockRequest as Request,
        mockModel as any,
        {}
      )

      expect(result).toEqual({
        data: mockData,
        pagination: {
          page: 1,
          limit: 10,
          total: mockTotal,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      })

      expect(mockModel.find).toHaveBeenCalledWith({})
      expect(mockModel.countDocuments).toHaveBeenCalledWith({})
    })

    it("should handle custom page and limit", async () => {
      mockRequest.query = { page: "2", limit: "5" }
      const mockData = [{ id: 1, name: "Test" }]
      const mockTotal = 10

      // Mock the find chain
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(mockData),
        }),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      })

      // Mock countDocuments
      mockModel.countDocuments.mockResolvedValue(mockTotal)

      const result = await createPaginatedResponse(
        mockRequest as Request,
        mockModel as any,
        {}
      )

      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        total: mockTotal,
        totalPages: 2,
        hasNext: false,
        hasPrevious: true,
      })

      expect(mockModel.find).toHaveBeenCalledWith({})
      expect(mockModel.countDocuments).toHaveBeenCalledWith({})
    })

    it("should handle edge cases", async () => {
      mockRequest.query = { page: "0", limit: "0" }
      const mockData: any[] = []
      const mockTotal = 0

      // Mock the find chain
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(mockData),
        }),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      })

      // Mock countDocuments
      mockModel.countDocuments.mockResolvedValue(mockTotal)

      const result = await createPaginatedResponse(
        mockRequest as Request,
        mockModel as any,
        {}
      )

      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
      })
    })

    it("should handle invalid query parameters", async () => {
      mockRequest.query = { page: "invalid", limit: "invalid" }
      const mockData: any[] = []
      const mockTotal = 0

      // Mock the find chain
      mockModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(mockData),
        }),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
      })

      // Mock countDocuments
      mockModel.countDocuments.mockResolvedValue(mockTotal)

      const result = await createPaginatedResponse(
        mockRequest as Request,
        mockModel as any,
        {}
      )

      expect(result.pagination.page).toBe(1)
      expect(result.pagination.limit).toBe(10)
    })
  })
})

import { Request, Response } from "express"
import {
  getProperties,
  getPropertyById,
  createProperty,
} from "../../controllers/property.controllers"
import Property from "../../models/Property"

// Mock the Property model
jest.mock("../../models/Property")
const MockedProperty = Property as any

// Mock the pagination utility
jest.mock("../../utils/pagination", () => ({
  createPaginatedResponse: jest.fn(),
}))

// Mock the query optimizer
jest.mock("../../utils/queryOptimizer", () => ({
  PropertyQueryBuilder: jest.fn().mockImplementation(() => ({
    addTypeFilter: jest.fn(),
    addLocationAndTitleFilter: jest.fn(),
    addCityFilter: jest.fn(),
    addPriceFilter: jest.fn(),
    addBedroomFilter: jest.fn(),
    addBathroomFilter: jest.fn(),
    addAmenitiesFilter: jest.fn(),
    build: jest.fn().mockReturnValue({}),
  })),
  createPerformanceMonitor: jest.fn().mockReturnValue({
    log: jest.fn(),
  }),
  parseAmenitiesQuery: jest.fn().mockReturnValue([]),
}))

describe("Property Controller", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockJson: jest.Mock
  let mockStatus: jest.Mock

  beforeEach(() => {
    mockJson = jest.fn()
    mockStatus = jest.fn().mockReturnValue({ json: mockJson })

    mockRequest = {
      query: {},
      params: {},
      body: {},
    }

    mockResponse = {
      json: mockJson,
      status: mockStatus,
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getProperties", () => {
    it("should return properties with default filters", async () => {
      const mockPaginatedResponse = {
        data: [],
        pagination: { page: 1, limit: 10, total: 0 },
      }

      const { createPaginatedResponse } = require("../../utils/pagination")
      createPaginatedResponse.mockResolvedValue(mockPaginatedResponse)

      await getProperties(mockRequest as Request, mockResponse as Response)

      expect(mockJson).toHaveBeenCalledWith({
        ...mockPaginatedResponse,
        data: [],
      })
    })

    it("should handle query parameters correctly", async () => {
      mockRequest.query = {
        type: "sale",
        city: "London",
        minPrice: "100000",
        maxPrice: "500000",
        bedrooms: "3",
      }

      const mockPaginatedResponse = {
        data: [],
        pagination: { page: 1, limit: 10, total: 0 },
      }

      const { createPaginatedResponse } = require("../../utils/pagination")
      createPaginatedResponse.mockResolvedValue(mockPaginatedResponse)

      await getProperties(mockRequest as Request, mockResponse as Response)

      expect(createPaginatedResponse).toHaveBeenCalled()
    })
  })

  describe("getPropertyById", () => {
    it("should return property when found", async () => {
      const mockProperty = {
        _id: "123",
        title: "Test Property",
        toObject: jest
          .fn()
          .mockReturnValue({ _id: "123", title: "Test Property" }),
      }

      MockedProperty.findById.mockResolvedValue(mockProperty)
      mockRequest.params = { id: "123" }

      await getPropertyById(mockRequest as Request, mockResponse as Response)

      expect(MockedProperty.findById).toHaveBeenCalledWith("123")
      expect(mockJson).toHaveBeenCalledWith(mockProperty.toObject())
    })

    it("should return 404 when property not found", async () => {
      MockedProperty.findById.mockResolvedValue(null)
      mockRequest.params = { id: "nonexistent" }

      await getPropertyById(mockRequest as Request, mockResponse as Response)

      expect(mockStatus).toHaveBeenCalledWith(404)
      expect(mockJson).toHaveBeenCalledWith({ message: "Property not found" })
    })
  })

  describe("createProperty", () => {
    it("should create property with valid data", async () => {
      const propertyData = {
        title: "New Property",
        price: 250000,
        location: {
          coordinates: { lat: 51.5074, lng: -0.1278 },
        },
      }

      const mockProperty = {
        ...propertyData,
        _id: "123",
        toObject: jest.fn().mockReturnValue({ ...propertyData, _id: "123" }),
      }

      MockedProperty.create.mockResolvedValue(mockProperty)
      mockRequest.body = propertyData

      await createProperty(mockRequest as Request, mockResponse as Response)

      expect(MockedProperty.create).toHaveBeenCalledWith(propertyData)
      expect(mockStatus).toHaveBeenCalledWith(201)
      expect(mockJson).toHaveBeenCalledWith(mockProperty.toObject())
    })

    it("should handle invalid coordinates", async () => {
      const propertyData = {
        title: "New Property",
        location: {
          coordinates: { lat: 100, lng: -0.1278 }, // Invalid latitude
        },
      }

      mockRequest.body = propertyData

      await createProperty(mockRequest as Request, mockResponse as Response)

      expect(mockStatus).toHaveBeenCalledWith(400)
      expect(mockJson).toHaveBeenCalledWith({
        message: "Latitude must be a valid number between -90 and 90",
      })
    })
  })
})

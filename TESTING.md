# Testing Documentation

## Overview

The poptrack-api project uses Jest as the primary testing framework with TypeScript support. The testing architecture is designed to provide comprehensive coverage across different layers of the application, from unit tests to integration tests.

## Test Architecture

### Test Structure

```
src/__tests__/
├── setup.ts                           # Global test setup and configuration
├── app.test.ts                        # Application-level tests
├── basic.test.ts                      # Basic functionality tests
├── controllers/
│   └── property.controller.test.ts    # Controller unit tests
├── integration/
│   └── property.integration.test.ts   # API integration tests
└── utils/
    └── pagination.test.ts             # Utility function tests
```

### Test Configuration

#### Jest Configuration (`jest.config.js`)

- **Preset**: `ts-jest` for TypeScript support
- **Environment**: Node.js
- **Test Matching**: `**/__tests__/**/*.test.ts` and `**/?(*.)+(spec|test).ts`
- **Coverage**: Excludes test files, types, and server entry point
- **Setup**: Uses `src/__tests__/setup.ts` for global configuration
- **Timeout**: 30 seconds for all tests
- **Module Mapping**: Supports `@utils/` path aliases

#### Global Setup (`src/__tests__/setup.ts`)

- Loads test environment variables from `.env.test`
- Sets `NODE_ENV=test`
- Mocks Mongoose connections to avoid database dependencies
- Provides cleanup after all tests

## Test Types and Flows

### 1. Basic Tests (`basic.test.ts`)

**Purpose**: Verify fundamental testing infrastructure and Jest functionality

**Test Flow**:

```typescript
describe("Basic Test Suite", () => {
  it("should pass a simple test", () => {
    expect(1 + 1).toBe(2)
  })

  it("should handle async operations", async () => {
    const result = await Promise.resolve("test")
    expect(result).toBe("test")
  })

  it("should work with arrays", () => {
    const array = [1, 2, 3]
    expect(array).toHaveLength(3)
    expect(array).toContain(2)
  })

  it("should work with objects", () => {
    const obj = { name: "test", value: 42 }
    expect(obj).toHaveProperty("name")
    expect(obj.name).toBe("test")
  })
})
```

**What it tests**:

- Basic Jest assertions
- Async/await functionality
- Array and object operations
- Testing framework setup

### 2. Application Tests (`app.test.ts`)

**Purpose**: Test the Express application setup and route availability

**Test Flow**:

```typescript
describe("App", () => {
  describe("GET /", () => {
    it("should return API is running message", async () => {
      const response = await request(app).get("/")
      expect(response.status).toBe(200)
      expect(response.text).toBe("API is running")
    })
  })

  describe("API Routes", () => {
    it("should have properties route", async () => {
      const response = await request(app).get("/api/properties")
      expect(response.status).not.toBe(404)
    })
    // ... other route tests
  })
})
```

**What it tests**:

- Root endpoint functionality
- Route availability (not 404 errors)
- Express app configuration
- SuperTest integration

### 3. Controller Unit Tests (`controllers/property.controller.test.ts`)

**Purpose**: Test individual controller functions in isolation with mocked dependencies

**Test Flow**:

```typescript
describe("Property Controller", () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockJson: jest.Mock
  let mockStatus: jest.Mock

  beforeEach(() => {
    // Setup mocks for each test
    mockJson = jest.fn()
    mockStatus = jest.fn().mockReturnValue({ json: mockJson })
    mockRequest = { query: {}, params: {}, body: {} }
    mockResponse = { json: mockJson, status: mockStatus }
  })

  describe("getProperties", () => {
    it("should return properties with default filters", async () => {
      // Mock pagination utility
      const { createPaginatedResponse } = require("../../utils/pagination")
      createPaginatedResponse.mockResolvedValue(mockPaginatedResponse)

      await getProperties(mockRequest as Request, mockResponse as Response)

      expect(mockJson).toHaveBeenCalledWith({
        ...mockPaginatedResponse,
        data: [],
      })
    })
  })
})
```

**What it tests**:

- Controller function logic
- Request/response handling
- Error scenarios
- Input validation
- Mocked dependencies (models, utilities)

**Key Mocking Strategy**:

- **Models**: Mock Mongoose models to avoid database calls
- **Utilities**: Mock pagination and query optimization functions
- **Express**: Mock Request and Response objects
- **Dependencies**: Mock all external dependencies

### 4. Integration Tests (`integration/property.integration.test.ts`)

**Purpose**: Test complete API endpoints with full request/response cycles

**Test Flow**:

```typescript
describe("Property API Integration Tests", () => {
  describe("GET /api/properties", () => {
    it("should return properties list", async () => {
      const response = await request(app)
        .get("/api/properties")
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body).toHaveProperty("data")
      expect(response.body).toHaveProperty("pagination")
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it("should handle query parameters", async () => {
      const response = await request(app)
        .get("/api/properties")
        .query({
          type: "sale",
          city: "London",
          minPrice: "100000",
          maxPrice: "500000",
        })
        .expect("Content-Type", /json/)
        .expect(200)

      expect(response.body).toHaveProperty("data")
      expect(response.body).toHaveProperty("pagination")
    })
  })

  describe("POST /api/properties", () => {
    it("should create a new property with valid data", async () => {
      const propertyData = {
        title: "Test Property",
        description: "A test property",
        price: 250000,
        // ... other fields
      }

      const mockProperty = {
        ...propertyData,
        _id: "507f1f77bcf86cd799439011",
        toObject: jest.fn().mockReturnValue({
          ...propertyData,
          _id: "507f1f77bcf86cd799439011",
        }),
      }

      MockedProperty.create.mockResolvedValue(mockProperty)

      const response = await request(app)
        .post("/api/properties")
        .send(propertyData)
        .expect("Content-Type", /json/)
        .expect(201)

      expect(response.body).toHaveProperty("_id")
      expect(response.body.title).toBe(propertyData.title)
    })
  })
})
```

**What it tests**:

- Complete HTTP request/response cycles
- Route handlers with middleware
- Content-Type headers
- Status codes
- Response body structure
- Error handling at API level
- Query parameter processing
- Request body validation

### 5. Utility Tests (`utils/pagination.test.ts`)

**Purpose**: Test utility functions in isolation

**Test Flow**:

```typescript
describe("Pagination Utils", () => {
  let mockRequest: Partial<Request>

  beforeEach(() => {
    mockRequest = { query: {} }
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
    })
  })
})
```

**What it tests**:

- Utility function logic
- Edge cases and error handling
- Input validation
- Return value structure
- Mocked dependencies

## Test Execution

### Available Scripts

```json
{
  "test": "jest", // Run all tests once
  "test:watch": "jest --watch", // Run tests in watch mode
  "test:coverage": "jest --coverage", // Run tests with coverage report
  "test:ci": "jest --ci --coverage --watchAll=false" // CI/CD optimized
}
```

### Running Tests

1. **All Tests**: `npm test`
2. **Watch Mode**: `npm run test:watch`
3. **With Coverage**: `npm run test:coverage`
4. **CI Mode**: `npm run test:ci`

### Test Output

- **Console**: Test results and coverage summary
- **Coverage Reports**: HTML reports in `coverage/` directory
- **Watch Mode**: Interactive mode for development

## Mocking Strategy

### 1. Model Mocking

```typescript
jest.mock("../../models/Property")
const MockedProperty = Property as any

// Usage
MockedProperty.findById.mockResolvedValue(mockProperty)
MockedProperty.create.mockResolvedValue(mockProperty)
```

### 2. Utility Mocking

```typescript
jest.mock("../../utils/pagination", () => ({
  createPaginatedResponse: jest.fn().mockResolvedValue(mockPaginatedResponse),
}))
```

### 3. Express Mocking

```typescript
let mockRequest: Partial<Request>
let mockResponse: Partial<Response>
let mockJson: jest.Mock
let mockStatus: jest.Mock

beforeEach(() => {
  mockJson = jest.fn()
  mockStatus = jest.fn().mockReturnValue({ json: mockJson })
  mockRequest = { query: {}, params: {}, body: {} }
  mockResponse = { json: mockJson, status: mockStatus }
})
```

### 4. Mongoose Error Mocking

```typescript
jest.mock("mongoose", () => ({
  ...jest.requireActual("mongoose"),
  Error: {
    ...jest.requireActual("mongoose").Error,
    CastError: class CastError extends Error {
      constructor(message: string) {
        super(message)
        this.name = "CastError"
      }
    },
    ValidationError: class ValidationError extends Error {
      constructor(message: string) {
        super(message)
        this.name = "ValidationError"
      }
    },
  },
}))
```

## Test Data Management

### 1. Test Data Structure

```typescript
const propertyData = {
  title: "Test Property",
  description: "A test property",
  price: 250000,
  type: "sale",
  bedrooms: 3,
  bathrooms: 2,
  location: {
    address: "123 Test Street",
    city: "London",
    coordinates: {
      lat: 51.5074,
      lng: -0.1278,
    },
  },
}
```

### 2. Mock Response Structure

```typescript
const mockProperty = {
  ...propertyData,
  _id: "507f1f77bcf86cd799439011",
  toObject: jest.fn().mockReturnValue({
    ...propertyData,
    _id: "507f1f77bcf86cd799439011",
  }),
}
```

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking

- Mock external dependencies
- Use `beforeEach` for setup
- Use `afterEach` for cleanup
- Mock at the right level (unit vs integration)

### 3. Assertions

- Test one thing per test
- Use specific assertions
- Test both success and failure cases
- Verify function calls and return values

### 4. Error Testing

- Test validation errors
- Test database errors
- Test network errors
- Test edge cases

## Coverage Goals

The test suite aims for:

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Key API endpoints
- **Error Scenarios**: All major error paths
- **Edge Cases**: Boundary conditions

## Continuous Integration

The `test:ci` script is optimized for CI/CD pipelines:

- No watch mode
- Coverage reporting
- Exit codes for failure detection
- Optimized for automated environments

## Troubleshooting

### Common Issues

1. **Mock Not Working**: Ensure mocks are defined before imports
2. **Async Test Failures**: Use proper async/await patterns
3. **Database Connection**: All database calls are mocked
4. **Environment Variables**: Use `.env.test` for test configuration

### Debugging

1. **Verbose Output**: `npm test -- --verbose`
2. **Single Test**: `npm test -- --testNamePattern="test name"`
3. **Watch Mode**: `npm run test:watch` for interactive debugging
4. **Coverage**: Check `coverage/` directory for detailed reports

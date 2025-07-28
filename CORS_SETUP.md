# CORS Configuration Guide

## Overview

This project implements a production-ready CORS (Cross-Origin Resource Sharing) configuration that adapts to different environments while maintaining security best practices.

## Architecture

### File Structure

```
src/
├── config/
│   ├── cors.ts          # CORS configuration
│   └── env.ts           # Environment loading
├── app.ts               # Express app with CORS middleware
└── server.ts            # Server startup
```

## Configuration

### Environment-Based Origins

The CORS configuration automatically adapts based on `NODE_ENV`:

#### Development/Local (`NODE_ENV=local` or `development`)

```typescript
// Allowed origins for development
;[
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173", // Vite
  "http://localhost:8080", // Vue CLI
  "http://localhost:4200", // Angular
  "http://localhost:4000", // Svelte
  // ... plus 127.0.0.1 variants
]
```

#### Staging (`NODE_ENV=staging`)

```typescript
// Uses environment variables
;[
  process.env.FRONTEND_URL || "https://staging.yourdomain.com",
  process.env.ADMIN_URL || "https://staging-admin.yourdomain.com",
]
```

#### Production (`NODE_ENV=production`)

```typescript
// Uses environment variables
;[
  process.env.FRONTEND_URL || "https://yourdomain.com",
  process.env.ADMIN_URL || "https://admin.yourdomain.com",
]
```

## Security Features

### 1. Origin Validation

- **Dynamic origin checking**: Validates each request against allowed origins
- **No origin handling**: Allows requests from mobile apps and tools like Postman
- **Logging**: Logs blocked requests for monitoring

### 2. Credentials Support

- **Cookies**: Enables cookie-based authentication
- **Authorization headers**: Supports Bearer token authentication
- **Secure**: Only works with specific allowed origins

### 3. Headers Configuration

```typescript
// Allowed headers
allowedHeaders: [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
  "Cache-Control",
  "X-File-Name",
]

// Exposed headers (for pagination, etc.)
exposedHeaders: ["Content-Range", "X-Content-Range", "X-Total-Count"]
```

### 4. Performance Optimization

- **Preflight caching**: 24-hour cache for OPTIONS requests
- **Efficient validation**: Fast origin checking

## Environment Setup

### 1. Create Environment Files

```bash
# Copy the example file
cp env.example .env.local

# For different environments
cp env.example .env.development
cp env.example .env.staging
cp env.example .env.production
```

### 2. Configure Environment Variables

```bash
# .env.local
NODE_ENV=local
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# .env.production
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
```

## Usage Examples

### Frontend Integration

#### React/Vite

```javascript
// Frontend API calls
const apiCall = async () => {
  const response = await fetch("http://localhost:3000/api/properties", {
    method: "GET",
    credentials: "include", // For cookies
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return response.json()
}
```

#### Angular

```typescript
// Angular service
@Injectable()
export class ApiService {
  private baseUrl = "http://localhost:3000/api"

  getProperties(): Observable<any> {
    return this.http.get(`${this.baseUrl}/properties`, {
      withCredentials: true,
    })
  }
}
```

### Testing

#### Unit Tests

```typescript
import { getAllowedOrigins } from "../config/cors"

describe("CORS Configuration", () => {
  it("should allow localhost origins in development", () => {
    process.env.NODE_ENV = "development"
    const origins = getAllowedOrigins()
    expect(origins).toContain("http://localhost:3000")
  })
})
```

## Best Practices

### 1. Security

- ✅ **Never use `origin: '*'`** in production
- ✅ **Validate all origins** against a whitelist
- ✅ **Use HTTPS** in production environments
- ✅ **Log blocked requests** for monitoring

### 2. Performance

- ✅ **Cache preflight responses** (maxAge: 86400)
- ✅ **Minimize allowed headers** to only what's needed
- ✅ **Use environment variables** for flexibility

### 3. Development

- ✅ **Support multiple localhost ports** for different frameworks
- ✅ **Allow no-origin requests** for testing tools
- ✅ **Clear error messages** for debugging

### 4. Production

- ✅ **Use specific domain names** instead of wildcards
- ✅ **Separate staging and production** configurations
- ✅ **Monitor CORS errors** in logs

## Troubleshooting

### Common Issues

#### 1. CORS Error: "No 'Access-Control-Allow-Origin' header"

**Solution**: Check if the origin is in the allowed list

```typescript
// Add your frontend URL to the allowed origins
const allowedOrigins = getAllowedOrigins()
console.log("Allowed origins:", allowedOrigins)
```

#### 2. Credentials Not Working

**Solution**: Ensure both frontend and backend support credentials

```javascript
// Frontend
fetch(url, { credentials: "include" })

// Backend (already configured)
credentials: true
```

#### 3. Preflight Requests Failing

**Solution**: Check if the method is allowed

```typescript
// Verify the method is in the allowed list
methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
```

## Monitoring

### Logs to Watch

```bash
# Allowed request
✅ CORS allowed request from: http://localhost:3000

# Blocked request
🚫 CORS blocked request from: http://malicious-site.com
```

### Metrics to Track

- CORS preflight requests count
- Blocked origins frequency
- Response times for OPTIONS requests

## Deployment Checklist

- [ ] Set `NODE_ENV` to appropriate environment
- [ ] Configure `FRONTEND_URL` and `ADMIN_URL` environment variables
- [ ] Test CORS with actual frontend application
- [ ] Verify credentials work with authentication
- [ ] Monitor CORS logs in production
- [ ] Update allowed origins when adding new frontend applications

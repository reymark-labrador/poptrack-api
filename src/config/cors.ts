import cors from "cors"

// Define allowed origins based on environment
const getAllowedOrigins = (): string[] => {
  const nodeEnv = process.env.NODE_ENV || "development"

  switch (nodeEnv) {
    case "production":
      return [
        process.env.FRONTEND_URL || "https://yourdomain.com",
        process.env.ADMIN_URL || "https://admin.yourdomain.com",
      ].filter(Boolean)

    case "staging":
      return [
        process.env.FRONTEND_URL || "https://staging.yourdomain.com",
        process.env.ADMIN_URL || "https://staging-admin.yourdomain.com",
      ].filter(Boolean)

    case "development":
    case "local":
    default:
      return [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173", // Vite
        "http://localhost:8080", // Vue CLI
        "http://localhost:4200", // Angular
        "http://localhost:4000", // Svelte
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:4200",
        "http://127.0.0.1:4000",
        "http://127.0.0.1:5000",
      ]
  }
}

// CORS configuration options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins()

    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      return callback(null, true)
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.warn(`🚫 CORS blocked request from: ${origin}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range", "X-Total-Count"],
  maxAge: 86400, // Cache preflight response for 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
}

// Create CORS middleware
export const corsMiddleware = cors(corsOptions)

// Export for testing purposes
export { getAllowedOrigins, corsOptions }

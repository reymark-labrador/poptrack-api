import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Application } from "express"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PropTrack API",
      version: "1.0.0",
      description:
        "API documentation for PropTrack - Property Management System",
    },
  },
  apis: ["src/routes/**/*.ts", "src/controllers/**/*.ts"],
} satisfies Parameters<typeof swaggerJsdoc>[0]

const PORT = process.env.PORT || 3000

export const swaggerSpec = swaggerJsdoc(options) as any

export const setupSwagger = (app: Application) => {
  // Serve Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "PropTrack API Documentation",
    })
  )

  // Serve Swagger JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(swaggerSpec)
  })

  console.log(
    `Swagger documentation available at: http://localhost:${PORT}/api-docs`
  )
  console.log(
    `Swagger JSON available at: http://localhost:${PORT}/api-docs.json`
  )
}

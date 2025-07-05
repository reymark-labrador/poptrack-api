import express, { Application, Request, Response } from "express"
import { corsMiddleware } from "./config/cors"

import propertyRoutes from "./routes/property.routes"
import clientRoutes from "./routes/client.routes"
import viewingRoutes from "./routes/viewing.routes"
import leadRoutes from "./routes/lead.routes"
import frontendPropertyRoutes from "./routes/frontend.property.routes"

const app: Application = express()

// Apply CORS middleware
app.use(corsMiddleware)

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("API is running")
})

app.use("/api/properties", propertyRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/viewings", viewingRoutes)
app.use("/api/leads", leadRoutes)
app.use("/api/frontend/properties", frontendPropertyRoutes)

export default app

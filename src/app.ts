import express, { Application, Request, Response } from "express"

import propertyRoutes from "./routes/property.routes"
import clientRoutes from "./routes/client.routes"
import viewingRoutes from "./routes/viewing.routes"

const app: Application = express()
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("API is running")
})

app.use("/api/properties", propertyRoutes)
app.use("/api/clients", clientRoutes)
app.use("/api/viewings", viewingRoutes)

export default app

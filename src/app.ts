import express, { Application, Request, Response } from "express"

import propertyRoutes from "./routes/property.routes"

const app: Application = express()
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.send("API is running")
})

app.use("/api/properties", propertyRoutes)

export default app
